import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

function useOptionalQueryState<T extends string>(
  key: string
): [T | undefined, (value: T | undefined) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramValue = searchParams.get(key) as T | null;
  const value = paramValue ?? undefined;

  const setValue = useCallback(
    (newValue: T | undefined) => {
      const newParams = new URLSearchParams(searchParams);
      if (newValue === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, newValue);
      }
      setSearchParams(newParams);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

export default useOptionalQueryState;
