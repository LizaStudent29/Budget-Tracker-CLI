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

/**
 * 1. Тип, который по имени поля транзакции возвращает его тип.
 *    Если имя не является ключом ITransaction — даёт never.
 */
export type TransactionFieldType<TField> =
  TField extends keyof ITransaction ? ITransaction[TField] : never;

/**
 * 2. Делает выбранные поля транзакции опциональными, остальные — обязательными.
 *    Например, OptionalTransaction<'description' | 'date'>.
 */
export type OptionalTransaction<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> &
  Partial<Pick<ITransaction, TFields>>;

/**
 * 3. Делает выбранные поля readonly, остальные остаются изменяемыми.
 */
export type ReadonlyTransactionFields<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> &
  Readonly<Pick<ITransaction, TFields>>;

/**
 * 4. Проверяет, описывает ли тип транзакцию с type: 'income'.
 */
export type IsIncome<T> = T extends { type: "income" } ? true : false;

/**
 * 5. Пара удобных типизированных алиасов для сценариев использования
 */

// Транзакция, где date и description можно не указывать (например, черновик)
export type DraftTransaction = OptionalTransaction<"date" | "description">;

// Транзакция, у которой id и amount — только для чтения
export type TransactionWithReadonlyCore = ReadonlyTransactionFields<
  "id" | "amount"
>;

// Превью доходной транзакции (для сводки)
export type IncomeTransactionPreview = {
  id: TransactionFieldType<"id">;
  amount: TransactionFieldType<"amount">;
  date: TransactionFieldType<"date">;
  type: Extract<TransactionType, "income">;
};