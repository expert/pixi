import { useState, useCallback } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform } from './types';
import { useController } from '../core/hooks/useController';
import { PlatformSystem } from '../core/systems/PlatformSystem';
import { PhysicsSystem } from '../core/systems/PhysicsSystem';
import { GameScene } from './components/GameScene';
import { INITIAL_PLATFORMS, PLAYER_SPEED } from './constants';

interface GameXmasProps {   
    onBack: () => void;
}

const GameXmas = ({ onBack }: GameXmasProps) => {
    const [player, setPlayer] = useState<PlayerState>({
        x: 400,
        y: 500,
        velocityY: 0,
        isJumping: false,
        jumpStartTime: null
    });

    const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
    const inputState = useController();

    const updateGame = useCallback((deltaTime: number) => {
        setPlatforms(prev => PlatformSystem.updatePlatforms(prev, deltaTime));

        setPlayer(prev => {
            // Calculate horizontal movement
            let newX = prev.x + inputState.horizontal * PLAYER_SPEED * deltaTime;

            // Start jump if needed
            let newState = inputState.jumpPressed && !prev.isJumping
                ? PhysicsSystem.startJump(prev)
                : prev;

            // Apply physics
            newState = PhysicsSystem.updatePlayerPhysics(
                newState, 
                platforms,
                inputState,
                deltaTime
            );

            // Check platform collisions
            const collision = PhysicsSystem.checkPlatformCollision(
                newX,
                newState.y,
                newState.velocityY,
                platforms
            );

            // Update state with collision results
            newState = {
                ...newState,
                y: collision.newY,
                velocityY: collision.newVelocityY,
                isJumping: collision.isJumping
            };

            // Apply platform movement
            if (!collision.isJumping && collision.platformSpeed !== null) {
                newX += collision.platformSpeed * deltaTime;
            }

            // Keep player within bounds
            newX = Math.max(0, Math.min(800, newX));

            return {
                ...newState,
                x: newX
            };
        });
    }, [inputState, platforms]);

    useGameLoop(updateGame);

    return (
        <GameEngine onBack={onBack}>
            <GameScene platforms={platforms} player={player} />
        </GameEngine>
    );
};

export default GameXmas;