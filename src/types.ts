// 1. Тип TransactionType
export type TransactionType = "income" | "expense";

// 2. Интерфейс транзакции
export interface ITransaction {
  id: number;
  amount: number;
  type: TransactionType;
  date: string;        // ISO-строка, например "2026-02-02T12:00:00.000Z"
  description: string;
}

// 3. Интерфейс счёта
export interface IAccount {
  id: number;
  name: string;

  addTransaction(transaction: ITransaction): void;
  removeTransactionById(transactionId: number): boolean;
  getTransactions(): ITransaction[];
}

// 4. Интерфейс сводки по счёту
export interface ISummary {
  income: number;
  expenses: number;
  balance: number;
}

// 5. Интерфейс менеджера счетов
export interface IAccountManager {
  addAccount(account: IAccount): void;
  removeAccountById(accountId: number): boolean;
  getAccounts(): IAccount[];
  getAccountById(id: number): IAccount | undefined;
  getSummary(accountId: number): ISummary;
}
