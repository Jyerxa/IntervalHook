import React from 'react';
import useIntervalHook from './hooks/useIntervalHook';

const App = () => {
    const { start, stop } = useIntervalHook();

    return (
        <div style={{ padding: '20px' }}>
            <h3>Hello</h3>
            <div style={{
                width: '5%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <button onClick={start}> start</button>
                <button onClick={stop}>stop</button>
            </div>
        </div>
    );
};

export default App;
