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

        const horizontalThreshold = 10;
        if (x < -horizontalThreshold) {
            onInput('MOVE_LEFT', true);
            onInput('MOVE_RIGHT', false);
        } else if (x > horizontalThreshold) {
            onInput('MOVE_LEFT', false);
            onInput('MOVE_RIGHT', true);
        } else {
            onInput('MOVE_LEFT', false);
            onInput('MOVE_RIGHT', false);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setPosition({ x: 0, y: 0 });
        onInput('MOVE_LEFT', false);
        onInput('MOVE_RIGHT', false);
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
            <JumpButton
                onTouchStart={() => onInput('JUMP', true)}
                onTouchEnd={() => {
                    onInput('JUMP', false);
                    onInput('JUMP_RELEASE', true);
                }}
            >
                ↑
            </JumpButton>
        </>
    );
}; 