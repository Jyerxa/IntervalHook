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
        // Prevent multiple intervals
        if (intervalId) {
            return;
        }

        const id = setInterval(() => {
            savedCallback.current?.();
        }, delay);
        setIntervalId(id);
    }, [delay, intervalId]);

    const stop = useCallback(() => {
        if(intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [intervalId]);

    // Auto-start if requested
    useEffect(() => {
        if (autoStart) {
            start();
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [autoStart]); // eslint-disable-line react-hooks/exhaustive-deps

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if(intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    return { 
        start, 
        stop,
        isRunning: intervalId !== null
    };
};

export default useIntervalHook;
