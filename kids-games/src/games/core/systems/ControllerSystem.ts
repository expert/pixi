import { PlayerState } from '../../xmas/types';

export type InputAction = 'MOVE_LEFT' | 'MOVE_RIGHT' | 'JUMP' | 'JUMP_RELEASE';

export interface InputState {
    horizontal: number;  // -1 (left) to 1 (right)
    isJumping: boolean;
    jumpPressed: boolean;
}

export class ControllerSystem {
    private static defaultState: InputState = {
        horizontal: 0,
        isJumping: false,
        jumpPressed: false
    };

    static createKeyboardMapper(): Map<string, InputAction> {
        return new Map([
            ['ArrowLeft', 'MOVE_LEFT'],
            ['ArrowRight', 'MOVE_RIGHT'],
            ['Space', 'JUMP'],
        ]);
    }

    static processAction(
        currentInput: InputState,
        action: InputAction,
        pressed: boolean
    ): InputState {
        switch (action) {
            case 'MOVE_LEFT':
                return {
                    ...currentInput,
                    horizontal: pressed ? -1 : 
                        (currentInput.horizontal === -1 ? 0 : currentInput.horizontal)
                };
            case 'MOVE_RIGHT':
                return {
                    ...currentInput,
                    horizontal: pressed ? 1 : 
                        (currentInput.horizontal === 1 ? 0 : currentInput.horizontal)
                };
            case 'JUMP':
                return {
                    ...currentInput,
                    jumpPressed: pressed,
                    isJumping: pressed ? true : currentInput.isJumping
                };
            case 'JUMP_RELEASE':
                return {
                    ...currentInput,
                    jumpPressed: false
                };
            default:
                return currentInput;
        }
    }

    static getInitialState(): InputState {
        return { ...this.defaultState };
    }
} 