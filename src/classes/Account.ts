import { v4 as uuidv4 } from "uuid";

import { IAccount } from "../interfaces/IAccount";
import { ISummary } from "../interfaces/ISummary";
import { ITransaction } from "../interfaces/ITransaction";

import { formatCurrency } from "budget-utils";
import { AccountUpdate } from "../interfaces/utility-types";

export class Account implements IAccount, ISummary {
  private readonly _id: string;

  get id(): string {
    return this._id;
  }

  private transactions: ITransaction[] = [];

  constructor(public name: string) {
    this._id = uuidv4();
  }

  // === IAccount ===

  addTransaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  }

  removeTransactionById(transactionId: string): boolean {
    const index = this.transactions.findIndex((t) => t.id === transactionId);
    if (index === -1) {
      return false;
    }
    this.transactions.splice(index, 1);
    return true;
  }

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
    return `Счёт "${this.name}": баланс ${formatCurrency(
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
}
