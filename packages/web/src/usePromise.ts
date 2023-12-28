import { useEffect, useRef, useState } from "react";

// TODO: narrow type so `null` and `undefined` always return `{ status: "idle" }`?

export type UsePromiseResult<value> =
  | PromiseSettledResult<Awaited<value>>
  | { status: "pending" }
  | { status: "idle" };

export function usePromise<value>(
  promise: PromiseLike<value> | null | undefined,
) {
  const promiseRef = useRef(promise);
  const [result, setResult] = useState<UsePromiseResult<value>>(
    promise == null ? { status: "idle" } : { status: "pending" },
  );

  useEffect(() => {
    if (promise !== promiseRef.current) {
      promiseRef.current = promise;
      setResult(promise == null ? { status: "idle" } : { status: "pending" });
    }
  }, [promise]);

  useEffect(() => {
    if (promise == null) return;
    // TODO: do we need to check if result is already populated?
    void Promise.allSettled([promise]).then(([settled]) => {
      if (promise === promiseRef.current) {
        setResult(settled);
      }
    });
  }, [promise]);

  return result;
}
