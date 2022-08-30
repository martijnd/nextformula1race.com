import { RefObject } from 'react';

export function useObserver<T extends Element>(
  target: RefObject<T>,
  callback: (entry: IntersectionObserverEntry) => void
) {
  return () => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (target?.current) {
      observer.observe(target.current);
    }

    return observer;
  };
}
