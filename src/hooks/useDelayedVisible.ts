import {useEffect, useRef, useState} from 'react';

/**
 * Gate for every loader in the app.
 *
 * Returns false until `active` has been true continuously for `delayMs`, then
 * true. Goes back to false the instant `active` does — a request that resolves
 * in 120ms never flashes a loader, which reads as a glitch rather than progress.
 */
export function useDelayedVisible(active: boolean, delayMs = 300): boolean {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };

    if (!active) {
      clear();
      setVisible(false);
      return;
    }

    timer.current = setTimeout(() => setVisible(true), delayMs);
    // fires on unmount and whenever active/delayMs change
    return clear;
  }, [active, delayMs]);

  return visible;
}

export default useDelayedVisible;
