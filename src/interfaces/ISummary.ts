export namespace BudgetTracker {
    export interface ISummary {
      income: number;
      expenses: number;
      balance: number;
    }
  }
  
  export type ISummary = BudgetTracker.ISummary;
  