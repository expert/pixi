import { useState, useCallback } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform } from './types';
import { usePlayerControls } from './hooks/usePlayerControls';
import { PlatformSystem } from './systems/PlatformSystem';
import { GameScene } from './components/GameScene';
import { INITIAL_PLATFORMS, PLAYER_SPEED, INITIAL_JUMP_VELOCITY, MAX_JUMP_DURATION, GRAVITY, GROUND_Y } from './constants';

interface GameXmasProps {   
    onBack: () => void;
}

const GameXmas = ({ onBack }: GameXmasProps) => {
    const [player, setPlayer] = useState<PlayerState>({
        x: 400,
        y: GROUND_Y,
        velocityY: 0,
        isJumping: false,
        jumpStartTime: null
    });

    const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
    const [keys, setKeys] = useState<Set<string>>(new Set());

    usePlayerControls(player, setPlayer, setKeys);

    const updateGame = useCallback((deltaTime: number) => {
        setPlatforms(prev => PlatformSystem.updatePlatforms(prev, deltaTime));

        setPlayer(prev => {
            let newX = prev.x + (
                (keys.has('ArrowRight') ? 1 : 0) - 
                (keys.has('ArrowLeft') ? 1 : 0)
            ) * PLAYER_SPEED * deltaTime;

            let newY = prev.y;
            let newVelocityY = prev.velocityY;
            let isJumping = prev.isJumping;

            if (prev.isJumping) {
                if (keys.has(' ') && prev.jumpStartTime && 
                    Date.now() - prev.jumpStartTime < MAX_JUMP_DURATION && 
                    prev.velocityY < 0) {
                    newVelocityY = INITIAL_JUMP_VELOCITY;
                } else {
                    newVelocityY += GRAVITY * deltaTime;
                }
                
                newY += newVelocityY * deltaTime;

                const collision = PlatformSystem.checkCollisions(newX, newY, newVelocityY, platforms);
                newY = collision.newY;
                newVelocityY = collision.newVelocityY;
                isJumping = collision.isJumping;

                if (!isJumping && collision.platformSpeed) {
                    const adjustedX = newX + collision.platformSpeed * deltaTime;
                    if (adjustedX >= 0 && adjustedX <= 800) {
                        newX = adjustedX;
                    }
                }

                if (newY >= GROUND_Y) {
                    newY = GROUND_Y;
                    newVelocityY = 0;
                    isJumping = false;
                }
            }

            return {
                ...prev,
                x: Math.max(0, Math.min(800, newX)),
                y: newY,
                velocityY: newVelocityY,
                isJumping,
                jumpStartTime: isJumping ? prev.jumpStartTime : null
            };
        });
    }, [keys, platforms]);

    useGameLoop(updateGame);

    return (
        <GameEngine onBack={onBack}>
            <GameScene platforms={platforms} player={player} />
        </GameEngine>
    );
};

export default GameXmas;