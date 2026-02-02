import { Transaction } from "./classes";
import { Account } from "./classes";
import { AccountManager } from "./classes";

const manager = new AccountManager();

// Создаём счёт
const mainAccount = new Account(1, "Основной счёт");

// Добавляем несколько транзакций
mainAccount.addTransaction(
  new Transaction(
    1,
    100_000,
    "income",
    new Date("2026-02-01").toISOString(),
    "Зарплата"
  )
);

mainAccount.addTransaction(
  new Transaction(
    2,
    15_000,
    "expense",
    new Date("2026-02-02").toISOString(),
    "Аренда квартиры"
  )
);

mainAccount.addTransaction(
  new Transaction(
    3,
    5_000,
    "expense",
    new Date("2026-02-03").toISOString(),
    "Еда"
  )
);

mainAccount.addTransaction(
  new Transaction(
    4,
    2_000,
    "expense",
    new Date("2026-02-04").toISOString(),
    "Подписки"
  )
);

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
