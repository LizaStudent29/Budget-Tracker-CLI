// ===== Часть 1. Интерфейсы =====

// Объект с числовым идентификатором
export interface Identifiable {
    id: number;
  }
  
  // Объект, который умеет себя описывать
  export interface Describable {
    describe(): string;
  }
  
  // Вспомогательный type-guard для проверки, реализует ли объект Describable
  function isDescribable(value: any): value is Describable {
    return value && typeof value.describe === "function";
  }
  
  // ===== Часть 2. Универсальный класс GenericStorage<T> =====
  
  export class GenericStorage<T extends Identifiable> {
    // приватное хранилище элементов
    private items: T[] = [];
  
    // добавить элемент
    add(item: T): void {
      this.items.push(item);
    }
  
    // удалить элемент по id
    removeById(id: number): boolean {
      const index = this.items.findIndex((item) => item.id === id);
      if (index === -1) {
        return false;
      }
      this.items.splice(index, 1);
      return true;
    }
  
    // получить элемент по id
    getById(id: number): T | undefined {
      return this.items.find((item) => item.id === id);
    }
  
    // получить копию всех элементов
    getAll(): T[] {
      return [...this.items];
    }
  
    // ===== Часть 3. describeAll =====
    describeAll(): void {
      for (const item of this.items) {
        if (isDescribable(item)) {
          console.log(item.describe());
        } else {
          console.log(`Элемент id: ${item.id} не содержит описания.`);
        }
      }
    }
  }
  
  // ===== Часть 4. Класс Product =====
  
  export class Product implements Identifiable, Describable {
    constructor(
      public id: number,
      public name: string,
      public price: number
    ) {}
  
    describe(): string {
      return `Product #${this.id}: ${this.name}, price: $${this.price}`;
    }
  }
  
  // ===== Проверка решения =====
  
  // Создаём хранилище продуктов
  const productStorage = new GenericStorage<Product>();
  
  // Добавляем несколько продуктов
  productStorage.add(new Product(1, "Laptop", 1200));
  productStorage.add(new Product(2, "Headphones", 150));
  productStorage.add(new Product(3, "Mouse", 40));
  
  // Первый вызов describeAll()
  console.log("=== describeAll() для обычных продуктов ===");
  productStorage.describeAll();
  
  // Добавляем объект, у которого НЕТ метода describe
  const rawObject = { id: 999 } as Product; // принудительно приводим к Product
  productStorage.add(rawObject);
  
  // Второй вызов describeAll()
  console.log("\n=== describeAll() после добавления объекта без describe ===");
  productStorage.describeAll();
  