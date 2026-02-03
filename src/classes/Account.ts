import { v4 as uuidv4 } from "uuid";

import { IAccount } from "../interfaces/IAccount";
import { ISummary } from "../interfaces/ISummary";
import { ITransaction } from "../interfaces/ITransaction";

import { formatCurrency } from "budget-utils";
import { AccountUpdate } from "../interfaces/utility-types";

import { escapeCsvValue } from "../utils/escapeCsvValue";
import { writeFile } from "fs/promises";

import { LogClass } from "../decorators/LogClass";
import { LogMethod } from "../decorators/LogMethod";
import { ReadOnly } from "../decorators/ReadOnly";
import { Metadata } from "../decorators/Metadata";

@LogClass
export class Account implements IAccount, ISummary {
  @ReadOnly
  public id: string;

  @ReadOnly
  public name: string;

  @Metadata("description", "Массив транзакций счета")
  private transactions: ITransaction[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  // === IAccount ===

  @LogMethod
  addTransaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  }

  @LogMethod
  removeTransactionById(transactionId: string): boolean {
    const index = this.transactions.findIndex((t) => t.id === transactionId);
    if (index === -1) {
      return false;
    }
    this.transactions.splice(index, 1);
    return true;
  }

  @LogMethod
  getTransactions(): ITransaction[] {
    return [...this.transactions];
  }

  update(update: AccountUpdate): void {
    // id не меняем
    if (update.name !== undefined) {
      this.name = update.name;
    }
  }

  // === ISummary (геттеры) ===

  get income(): number {
    return this.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get expenses(): number {
    return this.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    // читаем метаданные свойства transactions
    const metaDescription =
      Reflect.getMetadata(
        "description",
        Object.getPrototypeOf(this),
        "transactions"
      ) || "без описания";

    return `Счёт "${this.name}" (transactions: ${metaDescription}): баланс ${formatCurrency(
      this.balance
    )}, доходы ${formatCurrency(this.income)}, расходы ${formatCurrency(
      this.expenses
    )}, транзакций ${this.transactions.length}`;
  }

  toString(): string {
    const header = this.getSummaryString();

    const txLines =
      this.transactions.length === 0
        ? "  (нет транзакций)"
        : this.transactions.map((t) => "  • " + t.toString()).join("\n");

    return `${header}\n${txLines}`;
  }

  /**
   * Экспорт всех транзакций счёта в CSV-файл.
   * Формат:
   * id,amount,type,date,description
   */
  async exportTransactionsToCSV(filename: string): Promise<void> {
    const header = "id,amount,type,date,description";

    const lines = this.transactions.map((t) => {
      return [
        escapeCsvValue(t.id),
        escapeCsvValue(t.amount),
        escapeCsvValue(t.type),
        escapeCsvValue(t.date),
        escapeCsvValue(t.description),
      ].join(",");
    });

    const csvContent = [header, ...lines].join("\n");

    try {
      await writeFile(filename, csvContent, "utf8");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Не удалось сохранить CSV-файл "${filename}": ${message}`
      );
    }
  }
}
