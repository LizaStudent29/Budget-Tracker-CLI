export namespace BudgetTracker {
    // 1. Тип для вида транзакции
    export type TransactionType = "income" | "expense";
  }
  
  // Удобный экспорт для ES-модулей
  export type TransactionType = BudgetTracker.TransactionType;
  