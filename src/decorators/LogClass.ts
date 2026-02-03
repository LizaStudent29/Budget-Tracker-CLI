// src/decorators/LogClass.ts

export function LogClass<T extends { new (...args: any[]): {} }>(
    constructor: T
  ): T {
    return class extends constructor {
      constructor(...args: any[]) {
        console.log(
          `Создан экземпляр класса ${constructor.name} с аргументами:`,
          args
        );
        super(...args);
      }
    };
  }
  