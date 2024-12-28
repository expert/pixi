import { Stage, Container } from '@pixi/react';
import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { 
    SwipeState, 
    createSwipeState, 
    calculateSwipeDirection, 
    calculateSwipeMagnitude 
} from './controllers/SwipeController';

const GameWrapper = styled.div`
    width: 800px;
    height: 600px;
    position: relative;
    touch-action: none;
`;

interface GameEngineProps {
    children: React.ReactNode;
    onBack: () => void;
    onSwipe?: (state: SwipeState) => void;
}

const GameEngine = ({ children, onBack, onSwipe }: GameEngineProps) => {
    const [swipeState, setSwipeState] = useState<SwipeState>(createSwipeState());

    const handleStart = useCallback((x: number, y: number, rect: DOMRect) => {
        if (!onSwipe) return;
        
        const newState = {
            isActive: true,
            startPoint: { 
                x: x - rect.left, 
                y: y - rect.top 
            },
            endPoint: null,
            direction: 'NONE',
            magnitude: 0
        };
        setSwipeState(newState);
        onSwipe(newState);
    }, [onSwipe]);

    const handleMove = useCallback((x: number, y: number, rect: DOMRect) => {
        if (!onSwipe || !swipeState.isActive || !swipeState.startPoint) return;

        const currentPoint = { 
            x: x - rect.left, 
            y: y - rect.top 
        };
        
        const direction = calculateSwipeDirection(swipeState.startPoint, currentPoint);
        const magnitude = calculateSwipeMagnitude(swipeState.startPoint, currentPoint);

        const newState = {
            ...swipeState,
            endPoint: currentPoint,
            direction,
            magnitude
        };

        setSwipeState(newState);
        onSwipe(newState);
    }, [swipeState, onSwipe]);

    const handleEnd = useCallback(() => {
        if (!onSwipe) return;
        
        if (swipeState.isActive && swipeState.direction !== 'NONE') {
            onSwipe(swipeState);
        }
        
        const newState = createSwipeState();
        setSwipeState(newState);
        onSwipe(newState);
    }, [swipeState, onSwipe]);

    // Touch events
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        handleStart(touch.clientX, touch.clientY, rect);
    }, [handleStart]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        handleMove(touch.clientX, touch.clientY, rect);
    }, [handleMove]);

    // Mouse events
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        handleStart(e.clientX, e.clientY, rect);
    }, [handleStart]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        handleMove(e.clientX, e.clientY, rect);
    }, [handleMove]);

    return (
        <GameWrapper
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
        >
            <Stage
                width={800}
                height={600}
                options={{ backgroundColor: 0x1099bb }}
            >
                <Container>{children}</Container>
            </Stage>
            <button
                onClick={onBack}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                }}
            >
                Back to Menu
            </button>
        </GameWrapper>
    );
};

export default GameEngine;