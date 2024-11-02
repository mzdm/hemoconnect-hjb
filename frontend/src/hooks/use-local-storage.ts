import { useState } from "react";
import { z } from "zod";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodType<T>
): [T, (value: T) => void] {
  const validateData = (data: unknown): T => {
    if (!schema) return data as T;
    try {
      return schema.parse(data);
    } catch (error) {
      console.error(error);

      throw new Error(`Nepodařilo se zvalidovat data: ${error}`);
    }
  };

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      const parsedItem = item ? JSON.parse(item) : initialValue;
      return validateData(parsedItem);
    } catch (error) {
      console.error(error);

      throw new Error(`Chyba při načítání dat"${key}":${error}`);
    }
  });

  const setValue = (value: T) => {
    console.log("setValue", value);
    try {
      const validatedValue = validateData(value);
      setStoredValue(validatedValue);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(validatedValue));
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Chyba při ukládání "${key}":${error}`);
    }
  };

  return [storedValue, setValue];
}
