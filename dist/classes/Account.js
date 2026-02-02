"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.BudgetTracker = void 0;
var BudgetTracker;
(function (BudgetTracker) {
    class Account {
        constructor(id, name) {
            this.id = id;
            this.name = name;
            this.transactions = [];
        }
        // --- геттеры сводки ---
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
        // --- методы IAccount ---
        addTransaction(transaction) {
            // здесь безопасно привести к Transaction, если работаем только с этим классом
            this.transactions.push(transaction);
        }
        removeTransactionById(transactionId) {
            let index = -1;
            for (let i = 0; i < this.transactions.length; i++) {
                const t = this.transactions[i];
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
        getTransactions() {
            return [...this.transactions];
        }
        // --- сводка по счёту ---
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
    BudgetTracker.Account = Account;
})(BudgetTracker || (exports.BudgetTracker = BudgetTracker = {}));
exports.Account = BudgetTracker.Account;
