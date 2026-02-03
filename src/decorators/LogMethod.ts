// src/decorators/LogMethod.ts

export function LogMethod(
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor
  ) {
    // Оригинальный метод — либо из дескриптора, либо прямо с прототипа
    const originalMethod: (...args: any[]) => any =
      descriptor?.value ?? target[propertyKey];
  
    if (typeof originalMethod !== "function") {
      // На всякий случай, если вдруг декорируем не функцию
      return descriptor!;
    }
  
    const wrapper = function (...args: any[]) {
      console.log(`Вызов метода ${propertyKey} с аргументами:`, args);
  
      const result = originalMethod.apply(this, args);
  
      if (result instanceof Promise) {
        return result
          .then((value: any) => {
            console.log(`Метод ${propertyKey} вернул (Promise):`, value);
            return value;
          })
          .catch((err: any) => {
            console.log(`Метод ${propertyKey} завершился с ошибкой:`, err);
            throw err;
          });
      } else {
        console.log(`Метод ${propertyKey} вернул:`, result);
        return result;
      }
    };
  
    if (descriptor) {
      // Классический путь — просто подменяем value
      descriptor.value = wrapper;
      return descriptor;
    } else {
      // Если дескриптор не дали, подменяем метод прямо на прототипе
      target[propertyKey] = wrapper;
      return;
    }
  }
  