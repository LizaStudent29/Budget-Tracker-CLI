// src/decorators/Metadata.ts
import "reflect-metadata";

/**
 * Декоратор для сохранения метаданных о свойстве.
 */
export function Metadata(key: string, value: any) {
  return function (...args: any[]) {
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

      if (context.kind === "field" && typeof context.addInitializer === "function") {
        context.addInitializer(function () {
      
          Reflect.defineMetadata(
            key,
            value,
            Object.getPrototypeOf(this),
            context.name
          );
        });
      }

      return args[0];
    }

    const target = args[0];
    const propertyKey = args[1];

    Reflect.defineMetadata(key, value, target, propertyKey);
  };
}
