import type { ITransaction } from "./ITransaction";

export namespace BudgetTracker {
  export interface IAccount {
    id: number;
    name: string;

    addTransaction(transaction: ITransaction): void;
    removeTransactionById(transactionId: number): boolean;
    getTransactions(): ITransaction[];
  }
}

export type IAccount = BudgetTracker.IAccount;
