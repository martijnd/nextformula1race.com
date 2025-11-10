import { RefObject, useEffect, useRef } from 'react';

export function useObserver<T extends Element>(
  target: RefObject<T | null>,
  callback: (entry: IntersectionObserverEntry) => void
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!target?.current) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current(entry);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observerRef.current.observe(target.current);

    // Cleanup on unmount or when target changes
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [target]);

  // Return a no-op function for backward compatibility
  return () => {
    // Observer is managed by useEffect, so this is just for compatibility
  };
}
