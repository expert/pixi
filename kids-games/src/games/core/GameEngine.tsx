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
    onSwipe: (state: SwipeState) => void;
}

const GameEngine = ({ children, onBack, onSwipe }: GameEngineProps) => {
    const [swipeState, setSwipeState] = useState<SwipeState>(createSwipeState());

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const newState = {
            isActive: true,
            startPoint: { 
                x: touch.clientX - rect.left, 
                y: touch.clientY - rect.top 
            },
            endPoint: null,
            direction: 'NONE',
            magnitude: 0
        };
        setSwipeState(newState);
        onSwipe(newState);
    }, [onSwipe]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!swipeState.isActive || !swipeState.startPoint) return;

        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const currentPoint = { 
            x: touch.clientX - rect.left, 
            y: touch.clientY - rect.top 
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

    const handleTouchEnd = useCallback(() => {
        if (swipeState.isActive && swipeState.direction !== 'NONE') {
            // Trigger the jump with final swipe state
            onSwipe(swipeState);
        }
        
        // Reset swipe state
        const newState = createSwipeState();
        setSwipeState(newState);
        onSwipe(newState);
    }, [swipeState, onSwipe]);

    return (
        <GameWrapper
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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