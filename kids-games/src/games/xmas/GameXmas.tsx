import { useState, useCallback, useEffect } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform, PlatformConfig } from './types';
import { PlatformSystem } from '../core/systems/PlatformSystem';
import { PhysicsSystem } from '../core/systems/PhysicsSystem';
import { GameScene } from './components/GameScene';
import { INITIAL_PLATFORMS, PLAYER_SPEED, GROUND_Y, DEFAULT_PLATFORM_CONFIGS } from './constants';
import { SwipeState, createSwipeState } from '../core/controllers/SwipeController';
import { JumpIndicator } from './components/JumpIndicator';
import { PlatformGenerator } from '../core/systems/PlatformGenerator';

interface GameXmasProps {   
    onBack: () => void;
}

const GameXmas = ({ onBack }: GameXmasProps) => {
    const [player, setPlayer] = useState<PlayerState>({
        x: 400,
        y: GROUND_Y - 25,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        jumpStartTime: null,
        currentJumpDirection: 'NONE'
    });

    const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
    const [swipeState, setSwipeState] = useState<SwipeState>(createSwipeState());
    const [platformConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIGS.LEVEL_1);
    const [levelScroll, setLevelScroll] = useState(0);

    useEffect(() => {
        setPlatforms(PlatformGenerator.generateLevel(platformConfig));
    }, [platformConfig]);

    const checkPlatformRegeneration = useCallback(() => {
        if (platformConfig.direction === 'horizontal') {
            const lastPlatform = platforms[platforms.length - 1];
            if (player.x > lastPlatform.x + lastPlatform.width) {
                setPlatforms(PlatformGenerator.generateLevel(platformConfig));
            }
        }
    }, [platforms, player.x, platformConfig]);

    const handleSwipe = useCallback((newSwipeState: SwipeState) => {
        setSwipeState(newSwipeState);
        
        if (newSwipeState.isActive && 
            newSwipeState.direction !== 'NONE' && 
            newSwipeState.endPoint && 
            !player.isJumping) {
            console.log('Triggering jump:', newSwipeState.direction, newSwipeState.magnitude);
            setPlayer(prev => PhysicsSystem.startDirectionalJump(
                prev,
                newSwipeState.direction,
                newSwipeState.magnitude
            ));
        }
    }, [player.isJumping]);

    const updateGame = useCallback((deltaTime: number) => {
        setLevelScroll(prev => prev + DEFAULT_PLATFORM_CONFIGS.LEVEL_1.scrollSpeed * deltaTime);

        setPlatforms(prev => prev.map(platform => {
            if (!platform.isMoving) return platform;

            const newX = platform.x + platform.speed! * platform.direction! * deltaTime;
            
            if (newX <= platform.startX! || newX >= platform.endX!) {
                return {
                    ...platform,
                    x: newX <= platform.startX! ? platform.startX! : platform.endX!,
                    direction: platform.direction! * -1 as 1 | -1
                };
            }

            return {
                ...platform,
                x: newX
            };
        }));

        setPlayer(prev => PhysicsSystem.updatePlayerPhysics(
            prev,
            platforms,
            { horizontal: 0, vertical: 0, isJumping: prev.isJumping, jumpPressed: false },
            deltaTime
        ));
    }, [platforms]);

    useGameLoop(updateGame);

    return (
        <GameEngine onBack={onBack} onSwipe={handleSwipe}>
            <GameScene 
                platforms={platforms} 
                player={player}
                swipeState={swipeState}
                levelScroll={levelScroll}
            />
            <JumpIndicator 
                isVisible={player.isJumping}
                direction={player.currentJumpDirection}
                x={player.x}
                y={player.y}
            />
        </GameEngine>
    );
};

export default GameXmas;