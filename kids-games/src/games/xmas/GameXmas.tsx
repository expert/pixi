import { useState, useCallback, useEffect } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform, PlatformConfig, Snowball, GameState, LevelConfig, Projectile, Snowman, Gift, House } from './types';
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
import { GiftSystem } from '../core/systems/GiftSystem';
import { HouseSystem } from '../core/systems/HouseSystem';
import { createPlayer, handleFlyPlayer, handleJumpPlayer, updateFlyPlayer } from '../core/entities/PlayerEntity';
import { generatePlatforms, regeneratePlatforms, updatePlatforms } from '../core/entities/PlatformEntity';

interface GameXmasProps {   
    onBack: () => void;
}

const GameXmas = ({ onBack }: GameXmasProps) => {
    const [currentLevel, setCurrentLevel] = useState<string | null>(null);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);

    const [player, setPlayer] = useState<PlayerState>(createPlayer());

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
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [houses, setHouses] = useState<House[]>([]);
    const resetLevel = (level: string) => {
        setLevelScroll(0);
        setPlatforms([]);
        setSnowballs([]);
        setGifts([]);
        setGameState({
            score: 0,
            timeElapsed: 0,
            isLevelComplete: false,
            goalScore: DEFAULT_LEVEL_CONFIGS[level].goalScore
        });

        setPlayer(createPlayer());
    }
    const handleLevelSelect = useCallback((level: string) => {
        setCurrentLevel(level);
        const _levelConfig = DEFAULT_LEVEL_CONFIGS[level];
        setLevelConfig(_levelConfig);

        resetLevel(level);
        if(!_levelConfig) return;

        setPlatforms(['LEVEL_1', 'LEVEL_2'].includes(level) 
            ? generatePlatforms(_levelConfig) 
            : []
        );
        
        setSnowballs(['LEVEL_1'].includes(level) 
            ? SnowballSystem.generateSnowballs(_levelConfig) 
            : []
        );
        setSnowmen(['LEVEL_2'].includes(level) 
            ? [SnowmanSystem.generateSnowman()] 
            : []
        );
        setHouses(level === 'LEVEL_4' 
            ? [HouseSystem.generateHouse(800)] 
            : []
        );
    }, []);

    const handleNextLevel = useCallback(() => {
        const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'];
        const currentIndex = levels.indexOf(currentLevel!);
        if (currentIndex < levels.length - 1) {
            handleLevelSelect(levels[currentIndex + 1]);
        }
    }, [currentLevel, handleLevelSelect]);

    const checkAndRegenerateContent = useCallback(() => {
        if (currentLevel === 'LEVEL_1' || currentLevel === 'LEVEL_2') {
            setPlatforms(prev => regeneratePlatforms(prev, levelScroll, platformConfig));
            
            if (currentLevel === 'LEVEL_2') {
                setSnowmen(prev => {
                    const visibleSnowmen = prev.filter(s => 
                        !s.hit && s.x + levelScroll > -500
                    );
                    return visibleSnowmen; 
                });
            }
        }
    }, [currentLevel, levelScroll, platformConfig]);

    const handleSwipe = useCallback((newSwipeState: SwipeState) => {
        if (currentLevel === 'LEVEL_3' || currentLevel === 'LEVEL_4') {
            setPlayer(handleFlyPlayer(player, newSwipeState));
        } else if (currentLevel === 'LEVEL_2') {
            if (newSwipeState.isActive && newSwipeState.endPoint) {
                const newProjectile = ShootingSystem.startShot(player, newSwipeState);
                if (newProjectile) {
                    setProjectiles(prev => [...prev, newProjectile]);
                }
            }
        } else if (currentLevel === 'LEVEL_1') {
            setSwipeState(newSwipeState);
            setPlayer(handleJumpPlayer(player, newSwipeState));
        }
    }, [currentLevel, player]);

    const updateGame = useCallback((deltaTime: number) => {
        if (gameState.isLevelComplete) return;

        if (currentLevel === 'LEVEL_4') {
            setPlayer(updateFlyPlayer(player, deltaTime));

            setHouses(prev => 
                HouseSystem.updateHouses(prev, -100 * deltaTime, deltaTime)
                    .filter(house => house.x > -200)
            );

            if (houses.length < 3) {
                setHouses(prev => [...prev, HouseSystem.generateHouse(800)]);
            }

            setGifts(prev => prev.map(gift => {
                if (!gift.isDelivering) return gift;

                const newY = gift.y + (gift.velocityY || 0) * deltaTime;
                const newVelocityY = (gift.velocityY || 0) + 800 * deltaTime;

                const { deliveredToHouse, updatedHouses } = 
                    HouseSystem.checkGiftDelivery({ ...gift, y: newY }, houses);

                if (deliveredToHouse) {
                    setHouses(updatedHouses);
                    setGameState(prev => ({
                        ...prev,
                        score: prev.score + 1,
                        isLevelComplete: prev.score + 1 >= prev.goalScore
                    }));
                    return { ...gift, collected: true };
                }

                if (newY > GROUND_Y) {
                    return { ...gift, collected: true };
                }

                return {
                    ...gift,
                    y: newY,
                    velocityY: newVelocityY
                };
            }).filter(gift => !gift.collected));

            if (player.dropGift) {
                setGifts(prev => [...prev, {
                    x: player.x,
                    y: player.y,
                    collected: false,
                    createdAt: performance.now(),
                    isDelivering: true,
                    velocityY: 0
                }]);
                setPlayer(prev => ({ ...prev, dropGift: false }));
            }
        } else if (currentLevel === 'LEVEL_3') {
            setPlayer(updateFlyPlayer(player, deltaTime));

            setGifts(prev => {
                const updatedGifts = GiftSystem.updateGifts(prev);
                if (updatedGifts.length < 5 && GiftSystem.shouldGenerateNewGift()) {
                    return [...updatedGifts, GiftSystem.generateGift()];
                }
                return updatedGifts;
            });

            const { collectedGifts, remainingGifts } = 
                GiftSystem.checkCollisions(player.x, player.y, gifts);
            
            if (collectedGifts.length > 0) {
                setGameState(prev => ({
                    ...prev,
                    score: prev.score + collectedGifts.length,
                    isLevelComplete: prev.score + collectedGifts.length >= prev.goalScore
                }));
                setGifts(remainingGifts);
            }
        } else if (currentLevel === 'LEVEL_2' || currentLevel === 'LEVEL_1') {
            if (currentLevel === 'LEVEL_2') {
                setProjectiles(prev => {
                    const afterPlatformHits = ShootingSystem.checkPlatformHits(prev, platforms, levelScroll);
                    return afterPlatformHits.filter(p => p.active)
                        .map(p => ShootingSystem.updateProjectile(p, platforms, deltaTime));
                });

                setSnowmen(prev => {
                    const updatedSnowmen = SnowmanSystem.updateSnowmen(prev, deltaTime);
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
            } else {
                const { collectedSnowballs, remainingSnowballs } = 
                    SnowballSystem.checkCollisions(player, snowballs, levelScroll);
                
                if (collectedSnowballs.length > 0) {
                    setGameState(prev => ({
                        ...prev,
                        score: prev.score + collectedSnowballs.length,
                        isLevelComplete: prev.score + collectedSnowballs.length >= prev.goalScore
                    }));
                    setSnowballs(remainingSnowballs);
                }
            }

            checkAndRegenerateContent();
            setLevelScroll(prev => prev + platformConfig.scrollSpeed * deltaTime);
            setPlatforms(prev => updatePlatforms(prev, deltaTime, platformConfig.scrollSpeed));

            setPlayer(prev => PhysicsSystem.updatePlayerPhysics(
                prev,
                platforms,
                { horizontal: 0, vertical: 0, isJumping: prev.isJumping, jumpPressed: false },
                deltaTime,
                levelScroll
            ));
        }

        setGameState(prev => ({
            ...prev,
            timeElapsed: prev.timeElapsed + deltaTime
        }));
    }, [currentLevel, platforms, levelScroll, snowballs, player, platformConfig.scrollSpeed, gameState.isLevelComplete, projectiles, snowmen, gifts, houses, checkAndRegenerateContent]);

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
                gifts={gifts}
                houses={houses}
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