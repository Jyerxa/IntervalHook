import {useEffect, useRef} from 'react';

const useIntervalHook: () => { stop: () => void; start: () => void } = () => {
    const knownMethod = () => {
        console.log('hook triggered');
    }
    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = () => {
        if (intervalIdRef.current !== null) {
            return;
        }
        intervalIdRef.current = setInterval(knownMethod, 1000);
    };

    const stop = () => {
        if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    };

    // Clean up on unmount.
    useEffect(() => {
        return () => {
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []);

    return { start, stop };
};

export default useIntervalHook;
