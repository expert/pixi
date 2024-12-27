import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: (deltaTime: number) => void) => {
    const frameId = useRef<number>();
    const lastTime = useRef<number>(0);

    useEffect(() => {
        const animate = (currentTime: number) => {
            if (lastTime.current) {
                const deltaTime = (currentTime - lastTime.current) / 1000; // Convert to seconds
                callback(deltaTime);
            }
            lastTime.current = currentTime;
            frameId.current = requestAnimationFrame(animate);
        };

        frameId.current = requestAnimationFrame(animate);

        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, [callback]);
};
