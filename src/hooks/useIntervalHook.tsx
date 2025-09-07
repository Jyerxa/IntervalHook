import {useEffect, useState, useCallback, useRef} from 'react';

interface UseIntervalOptions {
    callback: () => void;
    delay: number;
    autoStart?: boolean;
}

interface UseIntervalReturn {
    start: () => void;
    stop: () => void;
    isRunning: boolean;
}

const useIntervalHook = ({ callback, delay, autoStart = false }: UseIntervalOptions): UseIntervalReturn => {
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const savedCallback = useRef<() => void>();

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const start = useCallback(() => {
        setIntervalId((currentId) => {
            // Prevent multiple intervals
            if (currentId) {
                return currentId;
            }

            const id = setInterval(() => {
                savedCallback.current?.();
            }, delay);
            return id;
        });
    }, [delay]);

    const stop = useCallback(() => {
        setIntervalId((currentId) => {
            if (currentId) {
                clearInterval(currentId);
            }
            return null;
        });
    }, []);

    // Auto-start if requested
    useEffect(() => {
        if (autoStart) {
            start();
        }
    }, [autoStart, start]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            setIntervalId((currentId) => {
                if (currentId) {
                    clearInterval(currentId);
                }
                return null;
            });
        };
    }, []);

    return { 
        start, 
        stop,
        isRunning: intervalId !== null
    };
};

export default useIntervalHook;
