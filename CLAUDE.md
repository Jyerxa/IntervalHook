# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application featuring a custom `useInterval` hook for managing intervals. The project uses Create React App with TypeScript support.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm start

# Run all tests
npm test

# Run tests once (no watch mode)
npm run test -- --watchAll=false

# Run a specific test file
npm test -- src/hooks/useInterval.test.tsx --watchAll=false

# Build production bundle
npm run build
```

### Testing
The project uses Jest with React Testing Library. Tests use fake timers to control interval behavior. When writing or modifying tests:
- Use `jest.useFakeTimers()` in `beforeEach`
- Use `jest.advanceTimersByTime()` to simulate time passing
- Clean up with `jest.useRealTimers()` in `afterEach`

## Architecture

### Core Hook: useInterval
Located at `src/hooks/useInterval.tsx`, this custom React hook provides:
- Controlled interval management with start/stop/restart functions
- Support for immediate execution and auto-start options
- Automatic cleanup on unmount
- TypeScript interfaces for options and return values
- Callback ref pattern to avoid restarts on callback changes

### Key Design Patterns
1. **Callback Ref Pattern**: The hook stores the latest callback in a ref (`callbackRef`) to ensure intervals always use the current callback without restarting
2. **Cleanup on Unmount**: Uses `useEffect` return function to clear intervals when components unmount
3. **State Management**: Tracks `isActive` state to provide UI feedback about interval status
4. **Null Delay Handling**: Passing `null` as delay disables the interval entirely

### Testing Strategy
The test suite (`src/hooks/useInterval.test.tsx`) covers:
- Basic start/stop functionality
- Immediate execution options
- Callback updates without restart
- Cleanup on unmount
- Multiple start/stop cycles
- Null delay handling
- Restart functionality (note: one test currently failing)

## Known Issues
- The "should restart interval when restart is called" test is currently failing due to timing issues with the async restart implementation