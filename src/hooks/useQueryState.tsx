import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

function useQueryState<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramValue = searchParams.get(key) as T | null;
  const value = paramValue ?? defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, newValue);
      setSearchParams(newParams);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

export default useQueryState;
