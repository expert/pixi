import { useState, useCallback, useEffect } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform, PlatformConfig, Snowball, GameState, LevelConfig, Projectile, Snowman } from './types';
import { PlatformSystem } from '../core/systems/PlatformSystem';
import { PhysicsSystem } from '../core/systems/PhysicsSystem';
import { GameScene } from './components/GameScene';
import { INITIAL_PLATFORMS, PLAYER_SPEED, GROUND_Y, DEFAULT_PLATFORM_CONFIGS, DEFAULT_LEVEL_CONFIGS } from './constants';
import { SwipeState, createSwipeState } from '../core/controllers/SwipeController';
import { JumpIndicator } from './components/JumpIndicator';
import { PlatformGenerator } from '../core/systems/PlatformGenerator';
import { SnowballSystem } from '../core/systems/SnowballSystem';
import { LevelSelector } from './components/LevelSelector';
import { ShootingSystem } from '../core/systems/ShootingSystem';
import { SnowmanSystem } from '../core/systems/SnowmanSystem';

interface GameXmasProps {   
    onBack: () => void;
}

const GameXmas = ({ onBack }: GameXmasProps) => {
    const [currentLevel, setCurrentLevel] = useState<string | null>(null);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);

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
    const [snowballs, setSnowballs] = useState<Snowball[]>([]);
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        timeElapsed: 0,
        isLevelComplete: false,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_1.goalScore
    });
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [snowmen, setSnowmen] = useState<Snowman[]>([]);

    const handleLevelSelect = useCallback((level: string) => {
        setCurrentLevel(level);
        setLevelConfig(DEFAULT_LEVEL_CONFIGS[level]);
        setGameState({
            score: 0,
            timeElapsed: 0,
            isLevelComplete: false,
            goalScore: DEFAULT_LEVEL_CONFIGS[level].goalScore
        });
        setLevelScroll(0);
        setPlatforms([]);
        setSnowballs([]);
        setPlayer({
            x: 400,
            y: GROUND_Y - 25,
            velocityX: 0,
            velocityY: 0,
            isJumping: false,
            jumpStartTime: null,
            currentJumpDirection: 'NONE',
            currentPlatform: null
        });
    }, []);

    const handleNextLevel = useCallback(() => {
        const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3'];
        const currentIndex = levels.indexOf(currentLevel!);
        if (currentIndex < levels.length - 1) {
            handleLevelSelect(levels[currentIndex + 1]);
        }
    }, [currentLevel, handleLevelSelect]);

    useEffect(() => {
        if (levelConfig) {
            setPlatforms(PlatformGenerator.generateLevel(levelConfig));
            if (currentLevel === 'LEVEL_2') {
                setSnowmen([SnowmanSystem.generateSnowman()]);
            } else {
                setSnowballs(SnowballSystem.generateSnowballs(levelConfig));
            }
        }
    }, [levelConfig, currentLevel]);

    const checkAndRegenerateContent = useCallback(() => {
        if (currentLevel === 'LEVEL_2') {
            const lastPlatform = platforms[platforms.length - 1];
            
            if (!gameState.isLevelComplete && 
                lastPlatform.x + lastPlatform.width + levelScroll < 1500) {
                
                const visiblePlatforms = platforms.filter(p => 
                    p.x + p.width + levelScroll > -500
                );

                const lastVisiblePlatform = visiblePlatforms[visiblePlatforms.length - 1];
                const newStartX = lastVisiblePlatform.x + lastVisiblePlatform.width + 
                    platformConfig.platformSpecs.minGap;

                const newPlatforms = PlatformGenerator.generateLevel({
                    ...platformConfig,
                    levelWidth: newStartX + 2000,
                    startX: newStartX
                });

                setPlatforms(visiblePlatforms.concat(newPlatforms));
            }
        } else {
            const lastPlatform = platforms[platforms.length - 1];
            
            if (!gameState.isLevelComplete && 
                lastPlatform.x + lastPlatform.width + levelScroll < 1500) {
                
                const visiblePlatforms = platforms.filter(p => 
                    p.x + p.width + levelScroll > -500
                );

                const lastVisiblePlatform = visiblePlatforms[visiblePlatforms.length - 1];
                const newStartX = lastVisiblePlatform.x + lastVisiblePlatform.width + 
                    platformConfig.platformSpecs.minGap;

                const newPlatforms = PlatformGenerator.generateLevel({
                    ...platformConfig,
                    levelWidth: newStartX + 2000,
                    startX: newStartX
                });

                const newSnowmen = SnowmanSystem.generateSnowman();

                setPlatforms(visiblePlatforms.concat(newPlatforms));
                setSnowmen(prev => {
                    const visibleSnowmen = prev.filter(s => 
                        !s.hit && s.x + levelScroll > -500
                    );
                    return visibleSnowmen.concat(newSnowmen);
                });
            }
        }
    }, [platforms, snowballs, levelScroll, gameState.isLevelComplete, platformConfig, currentLevel]);

    const handleSwipe = useCallback((newSwipeState: SwipeState) => {
        if (currentLevel !== 'LEVEL_2') {
            setSwipeState(newSwipeState);
            if (newSwipeState.isActive && 
                newSwipeState.direction !== 'NONE' && 
                newSwipeState.endPoint && 
                !player.isJumping) {
                setPlayer(prev => PhysicsSystem.startDirectionalJump(
                    prev,
                    newSwipeState.direction,
                    newSwipeState.magnitude
                ));
            }
        } else {
            // if (newSwipeState.isActive && 
            //     newSwipeState.direction !== 'NONE' && 
            if (newSwipeState.isActive && 
                newSwipeState.endPoint) {
                const newProjectile = ShootingSystem.startShot(player, newSwipeState);
                if (newProjectile) {
                    setProjectiles(prev => [...prev, newProjectile]);
                }
            }
        }
    }, [currentLevel, player]);

    const updateGame = useCallback((deltaTime: number) => {
        if (gameState.isLevelComplete) return;

        if (currentLevel === 'LEVEL_2') {
            setProjectiles(prev => 
                prev.filter(p => p.active)
                   .map(p => ShootingSystem.updateProjectile(p, platforms, deltaTime))
            );

            setSnowmen(prev => {
                const updatedSnowmen = SnowmanSystem.updateSnowmen(prev);
                
                if (updatedSnowmen.length < 3 && SnowmanSystem.shouldGenerateNewSnowman()) {
                    return [...updatedSnowmen, SnowmanSystem.generateSnowman()];
                }
                
                return updatedSnowmen;
            });

            const hitResults = ShootingSystem.checkSnowmanHits(projectiles, snowmen);
            if (hitResults.hits > 0) {
                setGameState(prev => ({
                    ...prev,
                    score: prev.score + hitResults.hits,
                    isLevelComplete: prev.score + hitResults.hits >= prev.goalScore
                }));
                setSnowmen(hitResults.remainingSnowmen);
            }
        }

        setGameState(prev => ({
            ...prev,
            timeElapsed: prev.timeElapsed + deltaTime
        }));

        setLevelScroll(prev => prev + platformConfig.scrollSpeed * deltaTime);

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

        const { collectedSnowballs, remainingSnowballs } = 
            SnowballSystem.checkCollisions(player, snowballs, levelScroll);
        
        if (collectedSnowballs.length > 0) {
            setGameState(prev => {
                const newScore = prev.score + collectedSnowballs.length;
                return {
                    ...prev,
                    score: newScore,
                    isLevelComplete: newScore >= prev.goalScore
                };
            });
            setSnowballs(remainingSnowballs);
        }

        checkAndRegenerateContent();

        setPlayer(prev => PhysicsSystem.updatePlayerPhysics(
            prev,
            platforms,
            { horizontal: 0, vertical: 0, isJumping: prev.isJumping, jumpPressed: false },
            deltaTime,
            levelScroll
        ));
    }, [platforms, levelScroll, snowballs, player, platformConfig.scrollSpeed, gameState.isLevelComplete, currentLevel, projectiles, snowmen]);

    useGameLoop(updateGame);

    if (!currentLevel || !levelConfig) {
        return (
            <GameEngine onBack={onBack}>
                <LevelSelector 
                    onSelectLevel={handleLevelSelect}
                    onBack={onBack}
                />
            </GameEngine>
        );
    }

    return (
        <GameEngine onBack={onBack} onSwipe={handleSwipe}>
            <GameScene 
                platforms={platforms} 
                player={player}
                swipeState={swipeState}
                levelScroll={levelScroll}
                snowballs={snowballs}
                score={gameState.score}
                timeElapsed={gameState.timeElapsed}
                goalScore={gameState.goalScore}
                isLevelComplete={gameState.isLevelComplete}
                onNextLevel={handleNextLevel}
                currentLevel={currentLevel}
                projectiles={projectiles}
                snowmen={snowmen}
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