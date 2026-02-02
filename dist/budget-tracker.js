"use strict";
// Базовые вычисления для Budget Tracker
// 1. Объявление переменных
var income = 120000; // доход за месяц
var expenses = 85000; // расходы за месяц
var savings = 10000; // сумма, которую хотите отложить
// 2. Вычисления
var netIncome = income - expenses; // чистый доход
var remaining = netIncome - savings; // остаток после сбережений
// 3. Вывод результатов
console.log("💰 Доход:", income);
console.log("💸 Расходы:", expenses);
console.log("🏦 Сбережения:", savings);
console.log("📊 Чистый доход:", netIncome);
console.log("🟢 Остаток после откладывания:", remaining);
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 1. calculateTotal
// Функция принимает массив чисел и возвращает их сумму.
function calculateTotal(values) {
    return values.reduce(function (sum, value) { return sum + value; }, 0);
}
// 2. calculateAverage
// Функция принимает массив чисел и возвращает среднее значение.
// Если массив пустой — возвращает 0.
function calculateAverage(values) {
    if (values.length === 0) {
        return 0;
    }
    var total = calculateTotal(values);
    return total / values.length;
}
// 3. formatCurrency
// Функция принимает число и символ валюты и возвращает строку, например "1000 ₽".
function formatCurrency(amount, symbol) {
    return "".concat(amount, " ").concat(symbol);
}
// 4. getTopValues
// Функция возвращает массив из N наибольших значений.
function getTopValues(values, count) {
    // Делаем копию массива, чтобы не изменять исходный
    var sortedDesc = __spreadArray([], values, true).sort(function (a, b) { return b - a; });
    return sortedDesc.slice(0, count);
}
// 5. printSummary
// Печатает в консоль количество значений, сумму и среднее.
function printSummary(values) {
    var total = calculateTotal(values);
    var average = calculateAverage(values);
    console.log("\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439: ".concat(values.length));
    console.log("\u0421\u0443\u043C\u043C\u0430: ".concat(total));
    console.log("\u0421\u0440\u0435\u0434\u043D\u0435\u0435: ".concat(average));
}
// 6. Проверка решения — примеры вызовов функций
var sampleValues = [100, 500, 1000, 2000, 800];
console.log('=== calculateTotal ===');
console.log(calculateTotal(sampleValues)); // 4400
console.log('=== calculateAverage ===');
console.log(calculateAverage(sampleValues)); // 880
console.log('=== formatCurrency ===');
console.log(formatCurrency(1000, '₽')); // "1000 ₽"
console.log('=== getTopValues ===');
console.log(getTopValues(sampleValues, 2)); // [2000, 1000] или [2000, 1000/800] в зависимости от массива
console.log('=== printSummary ===');
printSummary(sampleValues);
