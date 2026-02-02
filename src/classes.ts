import {
    TransactionType,
    ITransaction,
    IAccount,
    ISummary,
    IAccountManager,
  } from "./types";
  
  // 1. Класс Transaction
  export class Transaction implements ITransaction {
    constructor(
      public id: number,
      public amount: number,
      public type: TransactionType, // 'income' | 'expense'
      public date: string,          // ISO-строка
      public description: string
    ) {}
  
    toString(): string {
      const sign = this.type === "income" ? "+" : "-";
      return `[${this.date}] ${sign}${this.amount} (${this.type}) — ${this.description} (id: ${this.id})`;
    }
  }
  
  // 2. Класс Account
  // Реализует IAccount и ISummary
  export class Account implements IAccount, ISummary {
    public transactions: Transaction[] = [];
  
    constructor(
      public id: number,
      public name: string
    ) {}
  
    // Геттеры сводки по счёту
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
  
    // Методы IAccount
  
    addTransaction(transaction: Transaction): void {
      this.transactions.push(transaction);
    }
  
    removeTransactionById(transactionId: number): boolean {
      const index = this.transactions.findIndex((t) => t.id === transactionId);
      if (index === -1) return false;
      this.transactions.splice(index, 1);
      return true;
    }
  
    getTransactions(): Transaction[] {
      return [...this.transactions];
    }
  
    // Сводка по счёту
  
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
  
  // 3. Класс AccountManager
// Реализует IAccountManager и ISummary
export class AccountManager implements IAccountManager, ISummary {
    // храним счета как IAccount (сюда спокойно можно класть объекты Account)
    public accounts: IAccount[] = [];
  
    // ---- Геттеры общей сводки по ВСЕМ счетам ----
    get income(): number {
      return this.accounts.reduce((total, acc) => {
        const incomeForAccount = acc
          .getTransactions()
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        return total + incomeForAccount;
      }, 0);
    }
  
    get expenses(): number {
      return this.accounts.reduce((total, acc) => {
        const expensesForAccount = acc
          .getTransactions()
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        return total + expensesForAccount;
      }, 0);
    }
  
    get balance(): number {
      return this.income - this.expenses;
    }
  
    // ---- Методы IAccountManager ----
  
    addAccount(account: IAccount): void {
      this.accounts.push(account);
    }
  
    removeAccountById(accountId: number): boolean {
      const index = this.accounts.findIndex((acc) => acc.id === accountId);
      if (index === -1) return false;
      this.accounts.splice(index, 1);
      return true;
    }
  
    getAccountById(id: number): IAccount | undefined {
      return this.accounts.find((acc) => acc.id === id);
    }
  
    // ВАЖНО: имя и сигнатура как в интерфейсе
    getAccounts(): IAccount[] {
      return [...this.accounts];
    }
  
    // Сводка по КОНКРЕТНОМУ счёту
    getSummary(accountId: number): ISummary {
      const account = this.getAccountById(accountId);
      if (!account) {
        // можно кидать ошибку, но для простоты вернём нули
        return { income: 0, expenses: 0, balance: 0 };
      }
  
      const income = account
        .getTransactions()
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
  
      const expenses = account
        .getTransactions()
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
  
      return {
        income,
        expenses,
        balance: income - expenses,
      };
    }
  
    // ---- Удобные методы для отображения ----
  
    getSummaryString(): string {
      return `Всего счетов: ${this.accounts.length}, общий баланс: ${this.balance}, доходы: ${this.income}, расходы: ${this.expenses}`;
    }
  
    toString(): string {
      const header = this.getSummaryString();
      if (this.accounts.length === 0) {
        return `${header}\nНет счетов`;
      }
  
      const lines = this.accounts
        .map(
          (acc) =>
            `• Счёт "${acc.name}": транзакций ${acc.getTransactions().length}`
        )
        .join("\n");
  
      return `${header}\n${lines}`;
    }
  }
  