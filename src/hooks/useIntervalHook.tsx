import {useEffect, useState} from 'react';

const useIntervalHook: () => { stop: () => void; start: () => void } = () => {
    const knownMethod = () => {
        console.log('hook triggered');
    }
    const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

    const start = () => {
        if (intervalId) {
            return;
        }
        const id = setInterval(knownMethod, 1000);
        setIntervalId(id);
    };

    const stop = () => {
        if(intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    // Clean up on unmount.
    useEffect(() => {
        return () => {
            if(intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    return { start, stop };
};

export default useIntervalHook;
