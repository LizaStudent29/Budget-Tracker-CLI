"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManager = exports.BudgetTracker = void 0;
var BudgetTracker;
(function (BudgetTracker) {
    class AccountManager {
        constructor() {
            this.accounts = [];
        }
        // --- общая сводка по всем счетам ---
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
        // --- методы IAccountManager ---
        addAccount(account) {
            this.accounts.push(account);
        }
        removeAccountById(accountId) {
            let index = -1;
            for (let i = 0; i < this.accounts.length; i++) {
                const acc = this.accounts[i];
                if (acc.id === accountId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                return false;
            }
            this.accounts.splice(index, 1);
            return true;
        }
        getAccounts() {
            return [...this.accounts];
        }
        getAccountById(id) {
            for (let i = 0; i < this.accounts.length; i++) {
                const acc = this.accounts[i];
                if (acc.id === id) {
                    return acc;
                }
            }
            return undefined;
        }
        getSummary(accountId) {
            const account = this.getAccountById(accountId);
            if (!account) {
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
    BudgetTracker.AccountManager = AccountManager;
})(BudgetTracker || (exports.BudgetTracker = BudgetTracker = {}));
exports.AccountManager = BudgetTracker.AccountManager;
