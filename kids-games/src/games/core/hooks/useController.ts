import { useState, useEffect, useCallback } from 'react';
import { ControllerSystem, InputState, InputAction } from '../systems/ControllerSystem';

export const useController = () => {
    const [inputState, setInputState] = useState<InputState>(
        ControllerSystem.getInitialState()
    );
    
    const keyMap = ControllerSystem.createKeyboardMapper();

    const handleInput = useCallback((action: InputAction, pressed: boolean) => {
        setInputState(current => 
            ControllerSystem.processAction(current, action, pressed)
        );
    }, []);

    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const action = keyMap.get(e.code);
            if (action) {
                e.preventDefault();
                handleInput(action, true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const action = keyMap.get(e.code);
            if (action) {
                e.preventDefault();
                handleInput(action, false);
                if (action === 'JUMP') {
                    handleInput('JUMP_RELEASE', true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleInput, keyMap]);

    return inputState;
}; 