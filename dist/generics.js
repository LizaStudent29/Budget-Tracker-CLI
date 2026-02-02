"use strict";
// ===== Часть 1. Интерфейсы =====
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.GenericStorage = void 0;
// Вспомогательный type-guard для проверки, реализует ли объект Describable
function isDescribable(value) {
    return value && typeof value.describe === "function";
}
// ===== Часть 2. Универсальный класс GenericStorage<T> =====
class GenericStorage {
    constructor() {
        // приватное хранилище элементов
        this.items = [];
    }
    // добавить элемент
    add(item) {
        this.items.push(item);
    }
    // удалить элемент по id
    removeById(id) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            return false;
        }
        this.items.splice(index, 1);
        return true;
    }
    // получить элемент по id
    getById(id) {
        return this.items.find((item) => item.id === id);
    }
    // получить копию всех элементов
    getAll() {
        return [...this.items];
    }
    // ===== Часть 3. describeAll =====
    describeAll() {
        for (const item of this.items) {
            if (isDescribable(item)) {
                console.log(item.describe());
            }
            else {
                console.log(`Элемент id: ${item.id} не содержит описания.`);
            }
        }
    }
}
exports.GenericStorage = GenericStorage;
// ===== Часть 4. Класс Product =====
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    describe() {
        return `Product #${this.id}: ${this.name}, price: $${this.price}`;
    }
}
exports.Product = Product;
// ===== Проверка решения =====
// Создаём хранилище продуктов
const productStorage = new GenericStorage();
// Добавляем несколько продуктов
productStorage.add(new Product(1, "Laptop", 1200));
productStorage.add(new Product(2, "Headphones", 150));
productStorage.add(new Product(3, "Mouse", 40));
// Первый вызов describeAll()
console.log("=== describeAll() для обычных продуктов ===");
productStorage.describeAll();
// Добавляем объект, у которого НЕТ метода describe
const rawObject = { id: 999 }; // принудительно приводим к Product
productStorage.add(rawObject);
// Второй вызов describeAll()
console.log("\n=== describeAll() после добавления объекта без describe ===");
productStorage.describeAll();
