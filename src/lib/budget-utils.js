// src/lib/budget-utils.js

export function formatCurrency(amount, symbol = "₽") {
    return amount.toFixed(2) + " " + symbol;
  }
  
  