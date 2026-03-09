import { useEffect, useState } from "preact/hooks";

export const splitArray = (array: any[], chunkSize: number) => {
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export const useLocalStorage = (key: string, initialValue: any, validator: Function = () => true) => {
  const [value, setValue] = useState(() => {
    if (localStorage.getItem(key)) {
      const existingValue = JSON.parse(localStorage.getItem(key) as string);
      if (validator(existingValue)) {
        return existingValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
