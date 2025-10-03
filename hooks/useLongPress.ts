// Fix: Import `React` to resolve 'Cannot find namespace React' error for event types.
import React, { useRef, useCallback } from 'react';

const useLongPress = (callback: () => void, ms = 2000) => {
    const timer = useRef<number | null>(null);

    const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        // prevent context menu on long press
        e.preventDefault();
        timer.current = window.setTimeout(() => {
            callback();
        }, ms);
    }, [callback, ms]);

    const stop = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
};

export default useLongPress;