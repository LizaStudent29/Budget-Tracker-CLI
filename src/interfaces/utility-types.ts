import { ITransaction } from "./ITransaction";
import { IAccount } from "./IAccount";
import { TransactionType } from "./TransactionType";

// 1. Частичное обновление

// Частичное обновление транзакции
export type TransactionUpdate = Partial<ITransaction>;

// Частичное обновление аккаунта
export type AccountUpdate = Partial<IAccount>;

// 2. Обязательные поля и исключения

// Все поля обязательны
export type CompleteTransaction = Required<ITransaction>;

// Все поля, кроме description
export type TransactionWithoutDescription = Omit<ITransaction, "description">;

// 3. Выборка ключевых полей

export type TransactionPreview = Pick<
  ITransaction,
  "id" | "amount" | "type" | "date"
>;

export type AccountInfo = Pick<IAccount, "id" | "name">;

// 4. Лимиты по типам транзакций

// TransactionType уже содержит 'income' | 'expense'
export type CategoryLimits = Record<TransactionType, number>;

// 5. Типы, основанные на классе Transaction

type TransactionConstructor = typeof import("../classes/Transaction").Transaction;

export type TransactionConstructorParams =
  ConstructorParameters<TransactionConstructor>;

export type TransactionInstance = InstanceType<TransactionConstructor>;

// 6. Nullable description

export type NullableDescription = Omit<ITransaction, "description"> & {
  description: string | null;
};

export const defaultLimits: CategoryLimits = {
    income: 10000,
    expense: 5000,
  };