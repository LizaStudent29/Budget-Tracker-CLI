import { Account } from "./classes/Account";
import { Transaction } from "./classes/Transaction";
import { AccountManager } from "./classes/AccountManager";
import {
  TransactionPreview,
  AccountInfo,
  CategoryLimits,
  defaultLimits,
} from "./interfaces/utility-types";
import { formatCurrency } from "budget-utils";

import {
    TransactionFieldType,
    DraftTransaction,
    TransactionWithReadonlyCore,
    IncomeTransactionPreview,
    IsIncome,
  } from "./interfaces/utility-types";
  

async function main() {
  const personalAccount = new Account("Личный бюджет");

  const salary = new Transaction(
    1000,
    "income",
    "2023-01-01T00:00:00Z",
    "Зарплата"
  );
  const groceries = new Transaction(
    200,
    "expense",
    "2023-01-05T00:00:00Z",
    "Продукты"
  );
  const utilities = new Transaction(
    150,
    "expense",
    "2023-01-10T00:00:00Z",
    "Коммунальные услуги"
  );

    // === Примеры использования утилитных типов ===

  // 1) TransactionFieldType — вытаскиваем тип отдельного поля
  const exampleAmount: TransactionFieldType<"amount"> = 1234; // number

  // 2) DraftTransaction — можем не задавать дату и описание
  const draft: DraftTransaction = {
    id: "draft-1",
    amount: 999,
    type: "expense",
    // date и description можно не указывать — они опциональны
  };

  // 3) TransactionWithReadonlyCore — id и amount уже нельзя менять
  const readonlyTx: TransactionWithReadonlyCore = {
    id: salary.id,
    amount: salary.amount,
    type: salary.type,
    date: salary.date,
    description: salary.description,
  };

  readonlyTx.description = "Можно менять описание"; 

  // 4) IncomeTransactionPreview — создаём список «превью» только для доходов
  const incomePreviews: IncomeTransactionPreview[] = personalAccount
    .getTransactions()
    .filter((t) => t.type === "income")
    .map((t) => ({
      id: t.id,
      amount: t.amount,
      date: t.date,
      type: "income" as const,
    }));

  console.log("\nПревью доходных транзакций:");
  console.log(incomePreviews);

  // 5) IsIncome — чисто типовая проверка: для типа { type: 'income' } вернёт true, иначе false
  type IncomeCheck = IsIncome<{ type: "income"; amount: number }>; // true
  type ExpenseCheck = IsIncome<{ type: "expense"; amount: number }>; // false

  salary.update({ description: "Зарплата за январь" });

  personalAccount.addTransaction(salary);
  personalAccount.addTransaction(groceries);
  personalAccount.addTransaction(utilities);

  personalAccount.update({ name: "Личный бюджет (обновлён)" });

  const manager = new AccountManager();
  manager.addAccount(personalAccount);

  const limits: CategoryLimits = defaultLimits;

  const allTransactions = personalAccount.getTransactions();
  const previews: TransactionPreview[] = allTransactions.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    date: t.date,
  }));

  const info: AccountInfo = {
    id: personalAccount.id,
    name: personalAccount.name,
  };

  console.log(String(personalAccount));
  console.log(
    `Общий баланс всех бюджетов: ${formatCurrency(manager.balance)}`
  );

  console.log("\nИнформация о счёте:");
  console.log(info);

  console.log("\nЛимиты по категориям:");
  console.log(limits);

  console.log("\nПревью транзакций:");
  previews.forEach((p) => console.log(p));

  console.log("\nТранзакции личного бюджета:");
  personalAccount.getTransactions().forEach((t) => console.log(t.toString()));

  // 🔹 новый шаг — экспорт в CSV
  await personalAccount.exportTransactionsToCSV("transactions.csv");
  console.log('\nТранзакции экспортированы в "transactions.csv"');
}

// Запуск main с обработкой ошибок
main().catch((err) => {
  console.error("Ошибка при выполнении приложения:", err);
});
