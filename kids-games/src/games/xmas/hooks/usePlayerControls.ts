import { useEffect } from 'react';
import { PlayerState } from '../types';
import { INITIAL_JUMP_VELOCITY } from '../constants';

export const usePlayerControls = (
    player: PlayerState,
    setPlayer: (player: PlayerState) => void,
    setKeys: (keys: Set<string>) => void
) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys(prev => new Set(prev).add(e.key));
            
            if (e.code === 'Space' && !player.isJumping) {
                setPlayer({
                    ...player,
                    velocityY: INITIAL_JUMP_VELOCITY,
                    isJumping: true,
                    jumpStartTime: Date.now()
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys(prev => {
                const newKeys = new Set(prev);
                newKeys.delete(e.key);
                return newKeys;
            });

            if (e.code === 'Space' && player.isJumping && player.velocityY < 0) {
                setPlayer({
                    ...player,
                    velocityY: player.velocityY * 0.5
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [player.isJumping, player.velocityY, setKeys, setPlayer]);
}; 