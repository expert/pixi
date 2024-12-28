import { useEffect } from 'react';
import { PlayerState } from '../../xmas/types';
import { PhysicsSystem } from '../systems/PhysicsSystem';

export const usePlayerControls = (
    player: PlayerState,
    setPlayer: (player: PlayerState) => void,
    setKeys: (keys: Set<string>) => void
) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys((prev: Set<string>) => new Set([...prev, e.key]));
            console.log(e.code);
            if (e.code === 'Space') {
                setPlayer(prev => PhysicsSystem.startJump(prev));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys((prev: Set<string>) => {
                const newKeys = new Set([...prev]);
                newKeys.delete(e.key);
                return newKeys;
            });

            if (e.code === 'Space' && player.isJumping && player.velocityY < 0) {
                setPlayer(prev => ({
                    ...prev,
                    velocityY: prev.velocityY * 0.5
                }));
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