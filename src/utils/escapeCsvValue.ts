// src/utils/escapeCsvValue.ts

/**
 * Экранирует значение для CSV.
 * Если есть запятая, кавычки или перенос строки —
 * оборачиваем в двойные кавычки и удваиваем внутренние ".
 */
export function escapeCsvValue(value: string | number): string {
    const str = String(value);
  
    const hasSpecial =
      str.includes(",") ||
      str.includes('"') ||
      str.includes("'") ||
      str.includes("\n");
  
    if (!hasSpecial) {
      return str;
    }
  
    // внутри CSV двойные кавычки экранируются удвоением
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  