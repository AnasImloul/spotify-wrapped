import { useEffect, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

/**
 * Paints `fallback` first and mounts `children` right after the frame,
 * in its own task. Lets a page appear instantly while heavy sections fill in.
 */
export function DeferredSection({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      // flushSync gives each section its own task instead of one batched render.
      timeout = setTimeout(() => flushSync(() => setReady(true)), 0);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, []);

  return <>{ready ? children : fallback}</>;
}
