"use strict";
// 1. calculateTotal
// Функция принимает массив чисел и возвращает их сумму.
function calculateTotal(values) {
    return values.reduce((sum, value) => sum + value, 0);
}
// 2. calculateAverage
// Функция принимает массив чисел и возвращает среднее значение.
// Если массив пустой — возвращает 0.
function calculateAverage(values) {
    if (values.length === 0) {
        return 0;
    }
    const total = calculateTotal(values);
    return total / values.length;
}
// 3. formatCurrency
// Функция принимает число и символ валюты и возвращает строку, например "1000 ₽".
function formatCurrency(amount, symbol) {
    return `${amount} ${symbol}`;
}
// 4. getTopValues
// Функция возвращает массив из N наибольших значений.
function getTopValues(values, count) {
    // Делаем копию массива, чтобы не изменять исходный
    const sortedDesc = [...values].sort((a, b) => b - a);
    return sortedDesc.slice(0, count);
}
// 5. printSummary
// Печатает в консоль количество значений, сумму и среднее.
function printSummary(values) {
    const total = calculateTotal(values);
    const average = calculateAverage(values);
    console.log(`Всего записей: ${values.length}`);
    console.log(`Сумма: ${total}`);
    console.log(`Среднее: ${average}`);
}
// 6. Проверка решения — примеры вызовов функций
const sampleValues = [100, 500, 1000, 2000, 800];
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
