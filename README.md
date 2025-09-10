# useInterval Hook

A flexible and robust React hook for managing intervals with TypeScript support. This hook provides a clean API for starting, stopping, and restarting intervals with automatic cleanup and customizable behavior.

## Features

- 🚀 **Easy to use**: Simple API with start, stop, pause, resume, and restart functions
- ⏸️ **Pause/Resume**: Pause intervals and resume them later without losing state
- 🔄 **Automatic cleanup**: Intervals are automatically cleared on component unmount
- ⚡ **Flexible options**: Support for immediate start and immediate execution
- 🎯 **TypeScript support**: Full type safety with comprehensive TypeScript definitions
- 🧪 **Well tested**: Comprehensive test coverage with Jest and React Testing Library
- 🔧 **Customizable**: Configurable delay and execution behavior

## Installation

This project was bootstrapped with Create React App. To get started:

```bash
npm install
npm start
```

## API Reference

### `useInterval(callback, delay, options?)`

#### Parameters

- **`callback`** (`() => void`): The function to execute on each interval
- **`delay`** (`number | null`): The delay between executions in milliseconds. Pass `null` to disable the interval
- **`options`** (`UseIntervalOptions`): Optional configuration object

#### Options

```typescript
interface UseIntervalOptions {
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
```

#### Returns

```typescript
interface UseIntervalReturn {
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
```

## Usage Examples

### Basic Usage

```tsx
import React, { useState } from 'react';
import useInterval from './hooks/useInterval';

function Counter() {
  const [count, setCount] = useState(0);
  
  const { start, stop, pause, resume, isActive, isPaused } = useInterval(
    () => setCount(prev => prev + 1),
    1000
  );

  return (
    <div>
      <p>Count: {count}</p>
      <p>Status: {isActive ? (isPaused ? 'Paused' : 'Running') : 'Stopped'}</p>
      <button onClick={start} disabled={isActive && !isPaused}>
        Start
      </button>
      <button onClick={stop} disabled={!isActive}>
        Stop
      </button>
      <button onClick={pause} disabled={!isActive || isPaused}>
        Pause
      </button>
      <button onClick={resume} disabled={!isPaused}>
        Resume
      </button>
    </div>
  );
}
```

### Auto-start with Immediate Execution

```tsx
import React, { useState } from 'react';
import useInterval from './hooks/useInterval';

function AutoCounter() {
  const [count, setCount] = useState(0);
  
  const { stop, isActive } = useInterval(
    () => setCount(prev => prev + 1),
    1000,
    { 
      immediate: true,           // Start immediately
      executeImmediately: true   // Execute callback right away
    }
  );

  return (
    <div>
      <p>Count: {count}</p>
      <p>Status: {isActive ? 'Running' : 'Stopped'}</p>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### Pause and Resume Example

```tsx
import React, { useState } from 'react';
import useInterval from './hooks/useInterval';

function TimerWithPause() {
  const [seconds, setSeconds] = useState(0);
  
  const { start, stop, pause, resume, restart, isActive, isPaused } = useInterval(
    () => setSeconds(prev => prev + 1),
    1000
  );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>{formatTime(seconds)}</h2>
      <div>
        {!isActive && (
          <button onClick={start}>Start Timer</button>
        )}
        {isActive && !isPaused && (
          <button onClick={pause}>Pause</button>
        )}
        {isPaused && (
          <button onClick={resume}>Resume</button>
        )}
        {isActive && (
          <>
            <button onClick={stop}>Stop</button>
            <button onClick={restart}>Restart</button>
          </>
        )}
      </div>
      <p>Status: {!isActive ? 'Ready' : isPaused ? 'Paused' : 'Running'}</p>
    </div>
  );
}
```

### Dynamic Interval Control

```tsx
import React, { useState } from 'react';
import useInterval from './hooks/useInterval';

function DynamicInterval() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  
  const { start, stop, restart, isActive } = useInterval(
    () => setCount(prev => prev + 1),
    delay
  );

  return (
    <div>
      <p>Count: {count}</p>
      <input 
        type="number" 
        value={delay} 
        onChange={(e) => setDelay(Number(e.target.value))}
        placeholder="Delay in ms"
      />
      <div>
        <button onClick={start} disabled={isActive}>Start</button>
        <button onClick={stop} disabled={!isActive}>Stop</button>
        <button onClick={restart}>Restart</button>
      </div>
    </div>
  );
}
```

### Conditional Intervals

```tsx
import React, { useState } from 'react';
import useInterval from './hooks/useInterval';

function ConditionalInterval() {
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(true);
  
  const { isActive } = useInterval(
    () => setCount(prev => prev + 1),
    enabled ? 1000 : null,  // Pass null to disable
    { immediate: true }
  );

  return (
    <div>
      <p>Count: {count}</p>
      <label>
        <input 
          type="checkbox" 
          checked={enabled} 
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Enable interval
      </label>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
```

## Key Features & Behavior

### Pause/Resume Support
The hook provides pause and resume functionality, allowing you to temporarily stop the interval while maintaining its state. When resumed, the interval continues from where it was paused.

### Automatic Cleanup
The hook automatically cleans up intervals when the component unmounts, preventing memory leaks.

### Callback Ref Pattern
The hook uses a ref to store the latest callback, ensuring that interval callbacks always use the most recent version without restarting the interval.

### Restart Functionality
The `restart` function stops the current interval and immediately starts a new one, useful for resetting the timing. The restart now works synchronously without race conditions.

### Null Delay Handling
Passing `null` as the delay disables the interval entirely, making it easy to conditionally enable/disable intervals.

## Available Scripts

### `npm start`
Runs the demo app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Runs the test suite with comprehensive coverage for the useInterval hook.

### `npm run build`
Builds the app for production to the `build` folder.

## Testing

The hook includes comprehensive tests covering:
- Basic start/stop functionality
- Pause and resume functionality
- Immediate execution options
- Callback updates without restart
- Cleanup on unmount
- Multiple start/stop cycles
- Null delay handling
- Restart functionality (now fixed to work synchronously)
- Stop behavior while paused

Run tests with:
```bash
npm test
```

## Browser Support

This hook works in all modern browsers that support React 18+ and the following APIs:
- `setInterval` / `clearInterval`
- `useEffect`, `useCallback`, `useRef` (React hooks)

## License

This project is licensed under the MIT License.

