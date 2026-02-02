"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./classes");
const classes_2 = require("./classes");
const classes_3 = require("./classes");
const manager = new classes_3.AccountManager();
// Создаём счёт
const mainAccount = new classes_2.Account(1, "Основной счёт");
// Добавляем несколько транзакций
mainAccount.addTransaction(new classes_1.Transaction(1, 100000, "income", new Date("2026-02-01").toISOString(), "Зарплата"));
mainAccount.addTransaction(new classes_1.Transaction(2, 15000, "expense", new Date("2026-02-02").toISOString(), "Аренда квартиры"));
mainAccount.addTransaction(new classes_1.Transaction(3, 5000, "expense", new Date("2026-02-03").toISOString(), "Еда"));
mainAccount.addTransaction(new classes_1.Transaction(4, 2000, "expense", new Date("2026-02-04").toISOString(), "Подписки"));
// Добавляем счёт в менеджер
manager.addAccount(mainAccount);
// ===== Проверка работы методов =====
console.log("=== Все счета (getAllAccounts) ===");
console.log(manager.getAccounts());
console.log("\n=== Счёт по id (getAccountById) ===");
console.log(manager.getAccountById(1)?.toString());
console.log("\n=== Сводка по счёту (Account.getSummary) ===");
console.log(mainAccount.getSummary());
console.log(mainAccount.getSummaryString());
console.log("\n=== Общая сводка по всем счетам (AccountManager.getSummary) ===");
console.log(manager.getSummary(1));
console.log(manager.getSummaryString());
console.log("\n=== Полное строковое представление бюджета (AccountManager.toString) ===");
console.log(manager.toString());
// Пробуем удалить счёт
console.log("\nУдаляем счёт с id = 1");
console.log("Удалено:", manager.removeAccountById(1));
console.log("Счета после удаления:", manager.getAccounts());
