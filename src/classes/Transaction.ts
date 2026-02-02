import type { TransactionType } from "../interfaces/TransactionType";
import type { ITransaction } from "../interfaces/ITransaction";

export namespace BudgetTracker {
  export class Transaction implements ITransaction {
    constructor(
      public id: number,
      public amount: number,
      public type: TransactionType,
      public date: string,
      public description: string
    ) {}

    toString(): string {
      const sign = this.type === "income" ? "+" : "-";
      return `[${this.date}] ${sign}${this.amount} (${this.type}) — ${this.description} (id: ${this.id})`;
    }
  }
}

export import Transaction = BudgetTracker.Transaction;
