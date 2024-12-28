import { Stage, Container } from '@pixi/react';
import styled from 'styled-components';
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
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        onSwipe({
            isActive: true,
            startPoint: { x: touch.clientX, y: touch.clientY },
            endPoint: null,
            direction: 'NONE',
            magnitude: 0
        });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const currentPoint = { x: touch.clientX, y: touch.clientY };
        
        onSwipe(prev => ({
            ...prev,
            endPoint: currentPoint,
            direction: calculateSwipeDirection(prev.startPoint!, currentPoint),
            magnitude: calculateSwipeMagnitude(prev.startPoint!, currentPoint)
        }));
    };

    const handleTouchEnd = () => {
        onSwipe(createSwipeState());
    };

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