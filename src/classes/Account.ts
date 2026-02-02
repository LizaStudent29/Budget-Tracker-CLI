import type { IAccount } from "../interfaces/IAccount";
import type { ISummary } from "../interfaces/ISummary";
import type { ITransaction } from "../interfaces/ITransaction";
import type { TransactionType } from "../interfaces/TransactionType";
import { Transaction } from "./Transaction";

export namespace BudgetTracker {
  export class Account implements IAccount, ISummary {
    public transactions: Transaction[] = [];

    constructor(
      public id: number,
      public name: string
    ) {}

    // --- геттеры сводки ---
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

    // --- методы IAccount ---

    addTransaction(transaction: ITransaction): void {
      // здесь безопасно привести к Transaction, если работаем только с этим классом
      this.transactions.push(transaction as Transaction);
    }

    removeTransactionById(transactionId: number): boolean {
        let index: number = -1;
    
        for (let i = 0; i < this.transactions.length; i++) {
          const t: Transaction = this.transactions[i];
          if (t.id === transactionId) {
            index = i;
            break;
          }
        }
    
        if (index === -1) {
          return false;
        }
    
        this.transactions.splice(index, 1);
        return true;
      }

    getTransactions(): ITransaction[] {
      return [...this.transactions];
    }

    // --- сводка по счёту ---

    getSummary(): ISummary {
      return {
        income: this.income,
        expenses: this.expenses,
        balance: this.balance,
      };
    }

    getSummaryString(): string {
      return `Счёт "${this.name}": баланс ${this.balance}, доходы ${this.income}, расходы ${this.expenses}, транзакций ${this.transactions.length}`;
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
}

export import Account = BudgetTracker.Account;
