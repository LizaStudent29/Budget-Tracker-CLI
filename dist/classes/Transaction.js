"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.BudgetTracker = void 0;
var BudgetTracker;
(function (BudgetTracker) {
    class Transaction {
        constructor(id, amount, type, date, description) {
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
    BudgetTracker.Transaction = Transaction;
})(BudgetTracker || (exports.BudgetTracker = BudgetTracker = {}));
exports.Transaction = BudgetTracker.Transaction;
