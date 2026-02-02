"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManager = exports.Account = exports.Transaction = void 0;
// 1. Класс Transaction
class Transaction {
    constructor(id, amount, type, // 'income' | 'expense'
    date, // ISO-строка
    description) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
    }
    toString() {
        const sign = this.type === "income" ? "+" : "-";
        return `[${this.date}] ${sign}${this.amount} (${this.type}) — ${this.description} (id: ${this.id})`;
    }
}
exports.Transaction = Transaction;
// 2. Класс Account
// Реализует IAccount и ISummary
class Account {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.transactions = [];
    }
    // Геттеры сводки по счёту
    get income() {
        return this.transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
    }
    get expenses() {
        return this.transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
    }
    get balance() {
        return this.income - this.expenses;
    }
    // Методы IAccount
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }
    removeTransactionById(transactionId) {
        const index = this.transactions.findIndex((t) => t.id === transactionId);
        if (index === -1)
            return false;
        this.transactions.splice(index, 1);
        return true;
    }
    getTransactions() {
        return [...this.transactions];
    }
    // Сводка по счёту
    getSummary() {
        return {
            income: this.income,
            expenses: this.expenses,
            balance: this.balance,
        };
    }
    getSummaryString() {
        return `Счёт "${this.name}": баланс ${this.balance}, доходы ${this.income}, расходы ${this.expenses}, транзакций ${this.transactions.length}`;
    }
    toString() {
        const header = this.getSummaryString();
        const txLines = this.transactions.length === 0
            ? "  (нет транзакций)"
            : this.transactions.map((t) => "  • " + t.toString()).join("\n");
        return `${header}\n${txLines}`;
    }
}
exports.Account = Account;
// 3. Класс AccountManager
// Реализует IAccountManager и ISummary
class AccountManager {
    constructor() {
        // храним счета как IAccount (сюда спокойно можно класть объекты Account)
        this.accounts = [];
    }
    // ---- Геттеры общей сводки по ВСЕМ счетам ----
    get income() {
        return this.accounts.reduce((total, acc) => {
            const incomeForAccount = acc
                .getTransactions()
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0);
            return total + incomeForAccount;
        }, 0);
    }
    get expenses() {
        return this.accounts.reduce((total, acc) => {
            const expensesForAccount = acc
                .getTransactions()
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0);
            return total + expensesForAccount;
        }, 0);
    }
    get balance() {
        return this.income - this.expenses;
    }
    // ---- Методы IAccountManager ----
    addAccount(account) {
        this.accounts.push(account);
    }
    removeAccountById(accountId) {
        const index = this.accounts.findIndex((acc) => acc.id === accountId);
        if (index === -1)
            return false;
        this.accounts.splice(index, 1);
        return true;
    }
    getAccountById(id) {
        return this.accounts.find((acc) => acc.id === id);
    }
    // ВАЖНО: имя и сигнатура как в интерфейсе
    getAccounts() {
        return [...this.accounts];
    }
    // Сводка по КОНКРЕТНОМУ счёту
    getSummary(accountId) {
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
    getSummaryString() {
        return `Всего счетов: ${this.accounts.length}, общий баланс: ${this.balance}, доходы: ${this.income}, расходы: ${this.expenses}`;
    }
    toString() {
        const header = this.getSummaryString();
        if (this.accounts.length === 0) {
            return `${header}\nНет счетов`;
        }
        const lines = this.accounts
            .map((acc) => `• Счёт "${acc.name}": транзакций ${acc.getTransactions().length}`)
            .join("\n");
        return `${header}\n${lines}`;
    }
}
exports.AccountManager = AccountManager;
