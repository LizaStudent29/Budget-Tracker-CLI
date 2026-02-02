"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Вспомогательная функция для создания транзакции
function createTransaction(id, amount, type, description, date = new Date().toISOString()) {
    return {
        id,
        amount,
        type,
        date,
        description,
    };
}
// Фабрика для создания счёта, реализующего IAccount
function createAccount(id, name) {
    const transactions = [];
    return {
        id,
        name,
        addTransaction(transaction) {
            transactions.push(transaction);
        },
        removeTransactionById(transactionId) {
            const index = transactions.findIndex((t) => t.id === transactionId);
            if (index === -1) {
                return false;
            }
            transactions.splice(index, 1);
            return true;
        },
        getTransactions() {
            // возвращаем копию массива, чтобы его нельзя было сломать снаружи
            return [...transactions];
        },
    };
}
// Объект-менеджер счетов, реализующий IAccountManager
const accountManager = (() => {
    const accounts = [];
    return {
        addAccount(account) {
            accounts.push(account);
        },
        removeAccountById(accountId) {
            const index = accounts.findIndex((acc) => acc.id === accountId);
            if (index === -1) {
                return false;
            }
            accounts.splice(index, 1);
            return true;
        },
        getAccounts() {
            return [...accounts];
        },
        getAccountById(id) {
            return accounts.find((acc) => acc.id === id);
        },
        getSummary(accountId) {
            const account = accounts.find((acc) => acc.id === accountId);
            if (!account) {
                // В реальном коде тут можно бросить ошибку, но по заданию просто вернём нули
                return { income: 0, expenses: 0, balance: 0 };
            }
            const transactions = account.getTransactions();
            let income = 0;
            let expenses = 0;
            for (const tx of transactions) {
                if (tx.type === "income") {
                    income += tx.amount;
                }
                else if (tx.type === "expense") {
                    expenses += tx.amount;
                }
            }
            const balance = income - expenses;
            return { income, expenses, balance };
        },
    };
})();
// ===== Проверка работы =====
// Создаём счёт
const mainAccount = createAccount(1, "Основной счёт");
// Добавляем несколько транзакций
mainAccount.addTransaction(createTransaction(1, 100000, "income", "Зарплата"));
mainAccount.addTransaction(createTransaction(2, 15000, "expense", "Аренда квартиры"));
mainAccount.addTransaction(createTransaction(3, 5000, "expense", "Еда"));
mainAccount.addTransaction(createTransaction(4, 2000, "expense", "Подписки"));
// Добавляем счёт в менеджер
accountManager.addAccount(mainAccount);
// Проверяем методы
console.log("=== Все счета ===");
console.log(accountManager.getAccounts());
console.log("=== Счёт по id ===");
console.log(accountManager.getAccountById(1));
console.log("=== Транзакции по счёту ===");
console.log(mainAccount.getTransactions());
console.log("=== Сводка по счёту ===");
const summary = accountManager.getSummary(1);
console.log(summary);
// Пробуем удалить транзакцию
console.log("Удаление транзакции с id = 2:");
const removed = mainAccount.removeTransactionById(2);
console.log("Удалено:", removed);
console.log("Транзакции после удаления:", mainAccount.getTransactions());
console.log("Сводка после удаления транзакции:");
console.log(accountManager.getSummary(1));
