// src/decorators/ReadOnly.ts

// Декоратор, который работает и с "старыми", и с "новыми" декораторами TS.
export function ReadOnly(...args: any[]) {
    // Вариант №1: новый стандартный синтаксис декораторов (value, context)
    // context — объект с полями kind, name, addInitializer и т.д.
    if (
      args.length === 2 &&
      typeof args[1] === "object" &&
      args[1] !== null &&
      "kind" in args[1]
    ) {
      const context = args[1] as {
        kind: string;
        name: string | symbol;
        addInitializer?(init: () => void): void;
      };
  
      // Нас интересуют только поля класса
      if (context.kind === "field" && typeof context.addInitializer === "function") {
        context.addInitializer(function () {
          // На этапе инициализации инстанса делаем поле некорректируемым
          Object.defineProperty(this, context.name, {
            writable: false,
            configurable: false,
          });
        });
      }
  
      // Для полей нужно вернуть исходное значение (декоратор поля может вернуть инициализатор)
      return args[0];
    }
  
    // Вариант №2: legacy-синтаксис декораторов (target, propertyKey)
    const target = args[0];
    const propertyKey = args[1];
  
    const privateKey = Symbol(`__${String(propertyKey)}_value`);
  
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return this[privateKey];
      },
      set: function (newValue: any) {
        // первый set (в конструкторе) разрешаем, дальше — запрещаем
        if (Object.prototype.hasOwnProperty.call(this, privateKey)) {
          throw new Error(
            `Свойство ${String(propertyKey)} доступно только для чтения`
          );
        }
  
        Object.defineProperty(this, privateKey, {
          value: newValue,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      },
      enumerable: true,
      configurable: true,
    });
  }
  