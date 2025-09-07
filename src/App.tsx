import React, { useState } from 'react';
import useIntervalHook from './hooks/useIntervalHook';

const App = () => {
    const [count, setCount] = useState(0);
    
    const { start, stop, isRunning } = useIntervalHook({
        callback: () => {
            setCount(prev => prev + 1);
            console.log('hook triggered');
        },
        delay: 1000
    });

    return (
        <div style={{ padding: '20px' }}>
            <h3>Interval Hook Demo</h3>
            <p>Count: {count}</p>
            <p>Status: {isRunning ? 'Running' : 'Stopped'}</p>
            <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '10px'
            }}>
                <button onClick={start} disabled={isRunning}>Start</button>
                <button onClick={stop} disabled={!isRunning}>Stop</button>
                <button onClick={() => setCount(0)}>Reset Count</button>
            </div>
        </div>
    );
};

export default App;
