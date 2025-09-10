import { renderHook, act } from '@testing-library/react';
import useInterval from './useInterval';

// Mock timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('useInterval', () => {
  it('should not start interval immediately by default', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    expect(result.current.isActive).toBe(false);
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should start interval when immediate option is true', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 1000, { immediate: true }));

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should start interval when start is called', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should stop interval when stop is called', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isActive).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should not call callback after stopping
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should restart interval when restart is called', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.restart();
    });

    // Now restart works synchronously, so isActive should be true immediately
    expect(result.current.isActive).toBe(true);

    // Should reset the timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute callback immediately when executeImmediately is true', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => 
      useInterval(callback, 1000, { executeImmediately: true })
    );

    act(() => {
      result.current.start();
    });

    // Should be called immediately
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should be called again after interval
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not start if already active', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    // Try to start again
    act(() => {
      result.current.start();
    });

    // Should still be active and not create multiple intervals
    expect(result.current.isActive).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should only be called once per interval
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not start if delay is null', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, null));

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should update callback without restarting interval', () => {
    let callbackValue = 'first';
    const { result, rerender } = renderHook(
      ({ value }) => useInterval(() => { callbackValue = value; }, 1000),
      { initialProps: { value: 'first' } }
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callbackValue).toBe('first');

    // Update the callback
    rerender({ value: 'second' });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callbackValue).toBe('second');
    expect(result.current.isActive).toBe(true);
  });

  it('should handle delay changes correctly', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      { initialProps: { delay: 1000 } }
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Change delay
    rerender({ delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still use old delay since interval is already running
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should clean up interval on unmount', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    unmount();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should not call callback after unmount
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle multiple start/stop cycles correctly', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    // First cycle
    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stop();
    });

    // Second cycle
    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);

    // Third cycle
    act(() => {
      result.current.stop();
    });

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should work with both immediate and executeImmediately options', () => {
    const callback = jest.fn();
    renderHook(() => 
      useInterval(callback, 1000, { 
        immediate: true, 
        executeImmediately: true 
      })
    );

    // Should be called immediately due to executeImmediately
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should be called again after interval
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should pause and resume interval correctly', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.isPaused).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Pause the interval
    act(() => {
      result.current.pause();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.isPaused).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should not call callback while paused
    expect(callback).toHaveBeenCalledTimes(1);

    // Resume the interval
    act(() => {
      result.current.resume();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.isPaused).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should call callback again after resume
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not pause if not active', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(false);
  });

  it('should handle stop while paused', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInterval(callback, 1000));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('should restart with executeImmediately option', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => 
      useInterval(callback, 1000, { executeImmediately: true })
    );

    act(() => {
      result.current.start();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.restart();
    });

    // Should execute immediately on restart
    expect(callback).toHaveBeenCalledTimes(2);
  });
});