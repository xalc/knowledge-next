import { useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  // eslint-disable-next-line no-unused-vars
): [T, (value: T) => void] => {

  const initValue = getValue(key) ?? initialValue;
  const [storedValue, setStoredValue] = useState(initValue);

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  function getValue(key: string) {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }
  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
