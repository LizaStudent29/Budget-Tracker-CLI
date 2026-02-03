import inquirer from "inquirer";
import { AccountManager } from "../classes/AccountManager";
import { Account } from "../classes/Account";
import { Transaction } from "../classes/Transaction";
import { TransactionType } from "../interfaces/TransactionType";

type MainAction =
  | { type: "account"; id: string }
  | { type: "create" }
  | { type: "exit" };

type AccountMenuAction =
  | "add"
  | "removeTx"
  | "export"
  | "removeAcc"
  | "back";

export class ApplicationController {
  public accountManager: AccountManager;

  constructor() {
    this.accountManager = new AccountManager();

    // 🧩 Начальное заполнение: пара счетов с транзакциями
    const acc1 = new Account("Основной счёт");
    acc1.addTransaction(
      new Transaction(1000, "income", "2023-01-01", "Зарплата")
    );
    acc1.addTransaction(
      new Transaction(250, "expense", "2023-01-02", "Продукты")
    );

    const acc2 = new Account("Накопления");
    acc2.addTransaction(
      new Transaction(5000, "income", "2023-02-01", "Бонус")
    );
    acc2.addTransaction(
      new Transaction(1200, "expense", "2023-02-10", "Покупка техники")
    );

    this.accountManager.addAccount(acc1);
    this.accountManager.addAccount(acc2);
  }

  // ───────────────────────────────────────────────────────────────
  // Главный цикл приложения (меню по цифрам)
  // ───────────────────────────────────────────────────────────────

  public async start(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.clear();

      const accounts = this.accountManager.getAccounts() as Account[];

      console.log("=== Список счетов ===\n");
      if (accounts.length === 0) {
        console.log("Пока нет ни одного счёта.");
      }

      // Формируем список опций
      const options: { label: string; action: MainAction }[] = [];

      accounts.forEach((acc) => {
        options.push({
          label: `${acc.name} (баланс: ${acc.balance})`,
          action: { type: "account", id: acc.id },
        });
      });

      options.push(
        { label: "➕ Создать новый счёт", action: { type: "create" } },
        { label: "🚪 Выход", action: { type: "exit" } }
      );

      // Печатаем меню
      options.forEach((opt, index) => {
        console.log(`${index + 1}. ${opt.label}`);
      });

      const choiceIndex = await this.askMenuIndex(
        "\nВведите номер пункта меню:",
        options.length
      );

      const chosen = options[choiceIndex].action;

      if (chosen.type === "create") {
        await this.createAccount();
      } else if (chosen.type === "exit") {
        exit = true;
      } else if (chosen.type === "account") {
        await this.watchAccount(chosen.id);
      }
    }

    console.log("До встречи!");
  }

  // ───────────────────────────────────────────────────────────────
  // Создание счёта
  // ───────────────────────────────────────────────────────────────

  public async createAccount(): Promise<void> {
    console.clear();

    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: "input",
        name: "name",
        message: "Введите название нового счёта:",
        validate: (input) =>
          input.trim().length > 0 || "Название не может быть пустым",
      },
    ]);

    const account = new Account(name.trim());
    this.accountManager.addAccount(account);

    console.log(`\nСчёт "${account.name}" создан.`);
    await this.pause();
  }

  // ───────────────────────────────────────────────────────────────
  // Просмотр счёта и его меню
  // ───────────────────────────────────────────────────────────────

  public async watchAccount(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(
      accountId
    ) as Account | undefined;

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    let back = false;

    while (!back) {
      console.clear();

      console.log("=== Просмотр счёта ===\n");
      console.log(account.getSummaryString());
      console.log("\nТранзакции:");

      const transactions = account.getTransactions();

      if (transactions.length === 0) {
        console.log("  (нет транзакций)");
      } else {
        transactions.forEach((t) => console.log("  " + t.toString()));
      }

      const actions: { label: string; value: AccountMenuAction }[] = [
        { label: "➕ Добавить транзакцию", value: "add" },
        { label: "🗑 Удалить транзакцию", value: "removeTx" },
        { label: "📄 Экспортировать в CSV", value: "export" },
        { label: "🗑 Удалить счёт", value: "removeAcc" },
        { label: "⬅ Назад к списку счетов", value: "back" },
      ];

      console.log("\n=== Действия ===");
      actions.forEach((a, idx) => {
        console.log(`${idx + 1}. ${a.label}`);
      });

      const index = await this.askMenuIndex(
        "\nВведите номер действия:",
        actions.length
      );
      const action = actions[index].value;

      if (action === "add") {
        await this.addTransaction(account.id);
      } else if (action === "removeTx") {
        await this.removeTransaction(account.id);
      } else if (action === "export") {
        await this.exportTransactionsToCSV(account.id);
      } else if (action === "removeAcc") {
        await this.removeAccount(account.id);
        back = true;
      } else if (action === "back") {
        back = true;
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Удаление счёта
  // ───────────────────────────────────────────────────────────────

  public async removeAccount(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(
      accountId
    ) as Account | undefined;

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: "confirm",
        name: "confirm",
        message: `Точно удалить счёт "${account.name}"?`,
        default: false,
      },
    ]);

    if (!confirm) {
      return;
    }

    const ok = this.accountManager.removeAccountById(accountId);
    if (ok) {
      console.log(`Счёт "${account.name}" удалён.`);
    } else {
      console.log("Не удалось удалить счёт.");
    }

    await this.pause();
  }

  // ───────────────────────────────────────────────────────────────
  // Добавление транзакции
  // ───────────────────────────────────────────────────────────────

  public async addTransaction(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(
      accountId
    ) as Account | undefined;

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    console.clear();
    console.log(`Добавление транзакции для счёта "${account.name}"\n`);

    // сумма
    const { amountInput } = await inquirer.prompt<{ amountInput: string }>([
      {
        type: "input",
        name: "amountInput",
        message: "Сумма (число > 0):",
        validate: (input) => {
          const num = parseFloat(input.replace(",", "."));
          if (isNaN(num) || num <= 0) {
            return "Введите число больше нуля";
          }
          return true;
        },
      },
    ]);

    const amount = parseFloat(amountInput.replace(",", "."));

    // тип транзакции
    console.log("\nТип транзакции:");
    console.log("1. Доход");
    console.log("2. Расход");

    const typeIndex = await this.askMenuIndex(
      "Введите номер типа транзакции:",
      2
    );

    const type: TransactionType = typeIndex === 0 ? "income" : "expense";

    // дата
    const today = new Date().toISOString().slice(0, 10);

    const { date } = await inquirer.prompt<{ date: string }>([
      {
        type: "input",
        name: "date",
        message: "Дата (YYYY-MM-DD):",
        default: today,
      },
    ]);

    // описание
    const { description } = await inquirer.prompt<{ description: string }>([
      {
        type: "input",
        name: "description",
        message: "Описание:",
        default: "",
      },
    ]);

    const isoDate = new Date(date).toISOString();

    const tx = new Transaction(amount, type, isoDate, description);
    account.addTransaction(tx);

    console.log("\nТранзакция добавлена.");
    await this.pause();
  }

  // ───────────────────────────────────────────────────────────────
  // Удаление транзакции
  // ───────────────────────────────────────────────────────────────

  public async removeTransaction(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(
      accountId
    ) as Account | undefined;

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    const transactions = account.getTransactions();

    if (transactions.length === 0) {
      console.log("У этого счёта нет транзакций.");
      await this.pause();
      return;
    }

    console.log("\nСписок транзакций:");
    transactions.forEach((t, idx) => {
      console.log(`${idx + 1}. ${t.toString()}`);
    });

    const index = await this.askMenuIndex(
      "\nВведите номер транзакции для удаления:",
      transactions.length
    );

    const tx = transactions[index];

    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: "confirm",
        name: "confirm",
        message: `Точно удалить транзакцию: ${tx.toString()}?`,
        default: false,
      },
    ]);

    if (!confirm) {
      return;
    }

    const ok = account.removeTransactionById(tx.id);
    if (ok) {
      console.log("\nТранзакция удалена.");
    } else {
      console.log("\nНе удалось удалить транзакцию.");
    }

    await this.pause();
  }

  // ───────────────────────────────────────────────────────────────
  // Экспорт транзакций в CSV
  // ───────────────────────────────────────────────────────────────

  public async exportTransactionsToCSV(accountId: string): Promise<void> {
    const account = this.accountManager.getAccountById(
      accountId
    ) as Account | undefined;

    if (!account) {
      console.log("Счёт не найден.");
      await this.pause();
      return;
    }

    const { filename } = await inquirer.prompt<{ filename: string }>([
      {
        type: "input",
        name: "filename",
        message: "Имя файла для экспорта (без .csv):",
        default: account.name.replace(/\s+/g, "_").toLowerCase(),
      },
    ]);

    const safeName =
      filename.trim().length > 0 ? filename.trim() : "transactions";
    const fullName = `${safeName}.csv`;

    try {
      await account.exportTransactionsToCSV(fullName);
      console.log(`\nТранзакции экспортированы в файл "${fullName}".`);
    } catch (err) {
      console.error("\nОшибка при экспорте:", err);
    }

    await this.pause();
  }

  // ───────────────────────────────────────────────────────────────
  // Вспомогательные методы
  // ───────────────────────────────────────────────────────────────

  private async pause(
    message = "Нажмите Enter, чтобы продолжить..."
  ): Promise<void> {
    await inquirer.prompt([
      {
        type: "input",
        name: "continue",
        message,
      },
    ]);
  }

  /**
   * Запрашивает у пользователя номер пункта меню от 1 до max.
   * Возвращает индекс (0..max-1).
   */
  private async askMenuIndex(
    message: string,
    max: number
  ): Promise<number> {
    const { choice } = await inquirer.prompt<{ choice: string }>([
      {
        type: "input",
        name: "choice",
        message,
        validate: (input) => {
          const num = parseInt(input, 10);
          if (isNaN(num) || num < 1 || num > max) {
            return `Введите число от 1 до ${max}`;
          }
          return true;
        },
      },
    ]);

    const num = parseInt(choice, 10);
    return num - 1;
  }
}
