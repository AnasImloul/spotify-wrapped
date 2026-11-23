import { useEffect, useRef, useState, type DependencyList } from 'react';

interface DeferredComputation<T> {
  data: T | undefined;
  isPending: boolean;
}

/**
 * Runs an expensive computation after the current frame has painted, so the
 * surrounding UI (a tab switch, a filter change) can render immediately.
 * Returns the previous result while a new one is computing.
 */
export function useDeferredComputation<T>(
  compute: () => T,
  deps: DependencyList
): DeferredComputation<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isPending, setIsPending] = useState(true);
  const computeRef = useRef(compute);
  computeRef.current = compute;

  useEffect(() => {
    let cancelled = false;
    setIsPending(true);

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      timeout = setTimeout(() => {
        if (cancelled) return;
        const result = computeRef.current();
        if (cancelled) return;
        setData(() => result);
        setIsPending(false);
      }, 0);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, deps);

  return { data, isPending };
}
