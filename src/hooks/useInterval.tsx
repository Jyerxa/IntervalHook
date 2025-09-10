import { useEffect, useRef, useCallback, useState } from 'react';

export interface UseIntervalOptions {
  /**
   * Whether to start the interval immediately when the hook is called
   * @default false
   */
  immediate?: boolean;
  /**
   * Whether to execute the callback immediately when starting the interval
   * @default false
   */
  executeImmediately?: boolean;
}

export interface UseIntervalReturn {
  /**
   * Start the interval
   */
  start: () => void;
  /**
   * Stop the interval
   */
  stop: () => void;
  /**
   * Pause the interval (can be resumed)
   */
  pause: () => void;
  /**
   * Resume a paused interval
   */
  resume: () => void;
  /**
   * Restart the interval (stop and start again)
   */
  restart: () => void;
  /**
   * Whether the interval is currently active
   */
  isActive: boolean;
  /**
   * Whether the interval is paused
   */
  isPaused: boolean;
}

/**
 * A flexible React hook for managing intervals
 * 
 * @param callback - The function to execute on each interval
 * @param delay - The delay between executions in milliseconds (null to disable)
 * @param options - Additional options for the interval behavior
 * @returns Object with start, stop, restart functions and isActive state
 * 
 * @example
 * ```tsx
 * const { start, stop, isActive } = useInterval(
 *   () => console.log('Hello'),
 *   1000,
 *   { immediate: true }
 * );
 * ```
 */
const useInterval = (
  callback: () => void,
  delay: number | null,
  options: UseIntervalOptions = {}
): UseIntervalReturn => {
  const { immediate = false, executeImmediately = false } = options;
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pausedCallbackRef = useRef<(() => void) | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    // Don't start if already active or delay is null
    if (intervalRef.current !== null || delay === null) return;

    // Execute immediately if requested
    if (executeImmediately) {
      callbackRef.current();
    }

    // Set up the interval
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, delay);

    setIsActive(true);
    setIsPaused(false);
  }, [delay, executeImmediately]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Always reset states when stopping, even if paused
    setIsActive(false);
    setIsPaused(false);
    pausedCallbackRef.current = null;
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current && !isPaused) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPaused(true);
      // Store the callback for resume
      pausedCallbackRef.current = callbackRef.current;
    }
  }, [isPaused]);

  const resume = useCallback(() => {
    if (isPaused && delay !== null) {
      // Set up the interval again
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, delay);
      setIsPaused(false);
    }
  }, [isPaused, delay]);

  const restart = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    // Start immediately without setTimeout to avoid race condition
    if (delay !== null) {
      if (executeImmediately) {
        callbackRef.current();
      }
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, delay);
      setIsActive(true);
    }
  }, [delay, executeImmediately]);

  // Handle immediate start
  useEffect(() => {
    if (immediate && delay !== null) {
      start();
    }
  }, [immediate, delay, start]);

  // Cleanup on unmount
  useEffect(() => {
    return stop;
  }, [stop]);

  return { start, stop, pause, resume, restart, isActive, isPaused };
};

export default useInterval;
