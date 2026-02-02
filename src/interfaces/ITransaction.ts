import type { TransactionType } from "./TransactionType";

export namespace BudgetTracker {
  export interface ITransaction {
    id: number;
    amount: number;
    type: TransactionType;
    date: string;       // ISO-строка
    description: string;
  }
}

export type ITransaction = BudgetTracker.ITransaction;
