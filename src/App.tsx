import React, { useState } from 'react';
import useInterval from './hooks/useInterval';

const App = () => {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');

    // Example 1: Basic counter with custom callback
    const { start, stop, restart, isActive } = useInterval(
        () => {
            setCount(prev => {
                const newCount = prev + 1;
                setMessage(`Hook triggered ${newCount} times`);
                return newCount;
            });
        },
        1000
    );

    // Example 2: Different interval with immediate execution
    const { 
        start: startFast, 
        stop: stopFast, 
        isActive: isFastActive 
    } = useInterval(
        () => setMessage(prev => prev + ' [Fast tick]'),
        500,
        { executeImmediately: true }
    );

    return (
        <div style={{ padding: '20px' }}>
            <h3>Interval Hook Demo</h3>
            
            {/* Counter Example */}
            <div style={{ marginBottom: '20px' }}>
                <h4>Counter Example (1 second interval)</h4>
                <p>Count: {count}</p>
                <p>{message}</p>
                <p>Status: {isActive ? '🟢 Active' : '🔴 Stopped'}</p>
                
                <div style={{ marginTop: '10px' }}>
                    <button onClick={start} disabled={isActive} style={{ marginRight: '10px' }}>
                        Start
                    </button>
                    <button onClick={stop} disabled={!isActive} style={{ marginRight: '10px' }}>
                        Stop
                    </button>
                    <button onClick={restart} style={{ marginRight: '10px' }}>
                        Restart
                    </button>
                    <button onClick={() => setCount(0)} style={{ marginRight: '10px' }}>
                        Reset Count
                    </button>
                </div>
            </div>

            {/* Fast Interval Example */}
            <div>
                <h4>Fast Interval Example (0.5 second interval)</h4>
                <p>Adds "[Fast tick]" to the message when active</p>
                <p>Status: {isFastActive ? '🟢 Active' : '🔴 Stopped'}</p>
                
                <div style={{ marginTop: '10px' }}>
                    <button onClick={startFast} disabled={isFastActive} style={{ marginRight: '10px' }}>
                        Start Fast
                    </button>
                    <button onClick={stopFast} disabled={!isFastActive}>
                        Stop Fast
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
