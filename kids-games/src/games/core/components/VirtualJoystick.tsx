import { useState } from 'react';
import { InputAction } from '../systems/ControllerSystem';
import { JoystickContainer, JoystickKnob, JumpButton } from './VirtualJoystickStyles';

interface VirtualJoystickProps {
    onInput: (action: InputAction, pressed: boolean) => void;
}

export const VirtualJoystick = ({ onInput }: VirtualJoystickProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleJoystickMove = (clientX: number, clientY: number) => {
        const container = document.querySelector('#joystick-container');
        if (!container || !isDragging) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let x = clientX - centerX;
        let y = clientY - centerY;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = rect.width / 2 - 20;
        
        if (distance > maxDistance) {
            x = (x / distance) * maxDistance;
            y = (y / distance) * maxDistance;
        }

        setPosition({ x, y });

        // Calculate normalized direction
        const normalizedX = x / maxDistance;
        const normalizedY = y / maxDistance;
        const threshold = 0.3;

        // Handle horizontal movement
        if (normalizedX < -threshold) {
            onInput('MOVE_LEFT', true);
            onInput('MOVE_RIGHT', false);
        } else if (normalizedX > threshold) {
            onInput('MOVE_LEFT', false);
            onInput('MOVE_RIGHT', true);
        } else {
            onInput('MOVE_LEFT', false);
            onInput('MOVE_RIGHT', false);
        }

        // Handle vertical movement (including jump)
        if (normalizedY < -threshold) {
            onInput('JUMP', true);
        } else {
            onInput('JUMP', false);
            onInput('JUMP_RELEASE', true);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setPosition({ x: 0, y: 0 });
        onInput('MOVE_LEFT', false);
        onInput('MOVE_RIGHT', false);
        onInput('JUMP', false);
        onInput('JUMP_RELEASE', true);
    };

    return (
        <>
            <JoystickContainer
                id="joystick-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <JoystickKnob $x={position.x} $y={position.y} />
            </JoystickContainer>
        </>
    );
}; 