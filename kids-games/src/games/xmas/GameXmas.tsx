import { useState, useCallback } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform } from './types';
import { usePlayerControls } from './hooks/usePlayerControls';
import { PlatformSystem } from './systems/PlatformSystem';
import { PhysicsSystem } from './systems/PhysicsSystem';
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
    const [keys, setKeys] = useState<Set<string>>(new Set());

    usePlayerControls(player, setPlayer, setKeys);

    const updateGame = useCallback((deltaTime: number) => {
        setPlatforms(prev => PlatformSystem.updatePlatforms(prev, deltaTime));

        setPlayer(prev => {
            // Calculate horizontal movement
            let newX = prev.x + (
                (keys.has('ArrowRight') ? 1 : 0) - 
                (keys.has('ArrowLeft') ? 1 : 0)
            ) * PLAYER_SPEED * deltaTime;

            // Apply physics and get new state
            let newState = PhysicsSystem.updatePlayerPhysics(prev, platforms, keys, deltaTime);

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

            // Apply platform movement to player if standing on platform
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
    }, [keys, platforms]);

    useGameLoop(updateGame);

    return (
        <GameEngine onBack={onBack}>
            <GameScene platforms={platforms} player={player} />
        </GameEngine>
    );
};

export default GameXmas;