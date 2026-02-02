import type { IAccountManager } from "../interfaces/IAccountManager";
import type { IAccount } from "../interfaces/IAccount";
import type { ISummary } from "../interfaces/ISummary";

export namespace BudgetTracker {
  export class AccountManager implements IAccountManager, ISummary {
    public accounts: IAccount[] = [];

    // --- общая сводка по всем счетам ---

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

    // --- методы IAccountManager ---

    addAccount(account: IAccount): void {
      this.accounts.push(account);
    }

    removeAccountById(accountId: number): boolean {
        let index: number = -1;
    
        for (let i = 0; i < this.accounts.length; i++) {
          const acc: IAccount = this.accounts[i];
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
    

    getAccounts(): IAccount[] {
      return [...this.accounts];
    }

    getAccountById(id: number): IAccount | undefined {
        for (let i = 0; i < this.accounts.length; i++) {
          const acc: IAccount = this.accounts[i];
          if (acc.id === id) {
            return acc;
          }
        }
        return undefined;
      }
    

    getSummary(accountId: number): ISummary {
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
}

export import AccountManager = BudgetTracker.AccountManager;
