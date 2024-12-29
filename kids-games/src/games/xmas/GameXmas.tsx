import { useState, useCallback } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform, PlatformConfig, GameState, Projectile, Snowman, Gift, House, AppSize, Snowball } from './types';
import { PhysicsSystem } from '../core/systems/PhysicsSystem';
import { GameScene } from './components/GameScene';
import { DEFAULT_LEVEL_CONFIGS } from './constants';
import { SwipeState, createSwipeState } from '../core/controllers/SwipeController';
import { JumpIndicator } from './components/JumpIndicator';
import { LevelSelector } from './components/LevelSelector';
import { createPlayer, handleFlyPlayer } from '../core/entities/PlayerEntity';
import { regeneratePlatforms, updatePlatforms } from '../core/entities/PlatformEntity';
import { SnowballSystem } from '../core/systems/SnowballSystem';

import { useLevelManager } from './hooks/useLevelManager';
import { useLevel1State } from './hooks/useLevel1State';
import { useLevel2State } from './hooks/useLevel2State';
import { useLevel3State } from './hooks/useLevel3State';
import { useLevel4State } from './hooks/useLevel4State';
import { useResponsiveSize } from '../../hooks/useResponsiveSize';

interface GameXmasProps {   
    onBack: () => void;
}

const GameXmas = ({ onBack }: GameXmasProps) => {
    const size = useResponsiveSize({ maxWidth: 800, maxHeight: 1100 });
    const [level1State, updateLevel1, handleLevel1Jump, initializeLevel1] = useLevel1State({
        snowballs: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_1.goalScore,
        size,
        backgroundImage: '/images/Christmas Santa Claus Icon.png',
    });
    const [level3State, updateLevel3, updateLevel3Player] = useLevel3State({
        gifts: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_3.goalScore,
        size
    });
    const [level4State, updateLevel4, updateLevel4Player] = useLevel4State({
        gifts: [],
        houses: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_4.goalScore,
        size
    });
    const [level2State, updateLevel2, handleLevel2Shot] = useLevel2State({
        projectiles: [],
        snowmen: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_2.goalScore,
        size
    });

    const {
        currentLevel,
        levelConfig,
        handleLevelSelect,
        handleNextLevel
    } = useLevelManager(initializeLevel1, size);

    const [player, setPlayer] = useState<PlayerState>(createPlayer(size ));
    const [platforms, setPlatforms] = useState<Platform[]>();
    const [swipeState, setSwipeState] = useState<SwipeState>(createSwipeState());
    const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);
    const [levelScroll, setLevelScroll] = useState(0);
    const [snowballs, setSnowballs] = useState<Snowball[]>([]);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [snowmen, setSnowmen] = useState<Snowman[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [houses, setHouses] = useState<House[]>([]);
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        timeElapsed: 0,
        isLevelComplete: false,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_1.goalScore
    });

    // When a level is selected, update all the state
    const onLevelSelect = useCallback((level: string) => {
        console.log('Starting level:', level);
        const newState = handleLevelSelect(level);
        
        // Reset all state for new level
        setLevelScroll(0);
        setPlatformConfig(DEFAULT_LEVEL_CONFIGS[level]);
        
        // Update all game state with new values
        setPlayer(newState.player);
        setPlatforms(newState.platforms);
        setSnowballs(newState.snowballs);
        setProjectiles([]);
        setSnowmen(newState.snowmen);
        setGifts(newState.gifts);
        setHouses(newState.houses);
        setGameState(newState.gameState);
        
        // Reset swipe state
        setSwipeState(createSwipeState());
    }, [handleLevelSelect]);

    const checkAndRegenerateContent = useCallback(() => {
        switch (currentLevel) {
            case 'LEVEL_1':
                setPlatformConfig(DEFAULT_LEVEL_CONFIGS[currentLevel]);
                setPlatforms(prev => 
                    regeneratePlatforms(prev, levelScroll, DEFAULT_LEVEL_CONFIGS.LEVEL_1, size)
                );
                break;
            
            case 'LEVEL_2':
                setPlatformConfig(DEFAULT_LEVEL_CONFIGS[currentLevel]);
                setPlatforms(prev => 
                    regeneratePlatforms(prev, levelScroll, DEFAULT_LEVEL_CONFIGS.LEVEL_2, size)
                );
                setSnowmen(prev => prev.filter(s => 
                    !s.hit && s.x + levelScroll > -size.width
                ));
                break;
        }
    }, [
        currentLevel, 
        levelScroll, 
        platformConfig,
        size,
        gameState.score,
        gameState.goalScore
    ]);

    const handleSwipe = useCallback((newSwipeState: SwipeState) => {
        switch (currentLevel) {
            case 'LEVEL_1':
                setSwipeState(newSwipeState);
                setPlayer(handleLevel1Jump(player, newSwipeState, size));
                break;
            
            case 'LEVEL_2':
                handleLevel2Shot(player, newSwipeState, size);
                break;
            
            case 'LEVEL_3':
            case 'LEVEL_4':
                setPlayer(handleFlyPlayer(player, newSwipeState, size));
                break;
        }
    }, [
        currentLevel, 
        player, 
        handleLevel2Shot, 
        handleLevel1Jump,
        size
    ]);

    const updateGame = useCallback((deltaTime: number) => {
        if (gameState.isLevelComplete) return;

        // Common platform-based level updates
        const updatePlatformBasedLevel = () => {
            checkAndRegenerateContent();
            setLevelScroll(prev => prev + (platformConfig?.scrollSpeed || 0) * deltaTime);
            setPlatforms(prev => updatePlatforms(prev, deltaTime, platformConfig?.scrollSpeed || 0));
            setPlayer(prev => PhysicsSystem.updatePlayerPhysics(
                prev,
                platforms || [],
                { horizontal: 0, vertical: 0, isJumping: prev.isJumping, jumpPressed: false },
                deltaTime,
                levelScroll,
                size
            ));
        };

        switch (currentLevel) {
            case 'LEVEL_1':
                updateLevel1(deltaTime, player, levelScroll, size);
                setSnowballs(level1State.snowballs);
                setGameState(prev => ({
                    ...prev,
                    score: level1State.score,
                    isLevelComplete: level1State.isLevelComplete
                }));
                updatePlatformBasedLevel();
                break;

            case 'LEVEL_2':
                updateLevel2(deltaTime, platforms || [], levelScroll, size);
                setProjectiles(level2State.projectiles);
                setSnowmen(level2State.snowmen);
                setGameState(prev => ({
                    ...prev,
                    score: level2State.score,
                    isLevelComplete: level2State.isLevelComplete
                }));
                updatePlatformBasedLevel();
                break; 

            case 'LEVEL_3':
                setPlayer(updateLevel3Player(player, deltaTime, size));
                updateLevel3(deltaTime, player, size);
                setGifts(level3State.gifts);
                setGameState(prev => ({
                    ...prev,
                    score: level3State.score,
                    isLevelComplete: level3State.isLevelComplete
                }));
                break;

            case 'LEVEL_4':
                setPlayer(updateLevel4Player(player, deltaTime, size));
                updateLevel4(deltaTime, player, size);
                setHouses(level4State.houses);
                setGifts(level4State.gifts);
                setGameState(prev => ({
                    ...prev,
                    score: level4State.score,
                    isLevelComplete: level4State.isLevelComplete
                }));
                if (player.dropGift) {
                    setPlayer(prev => ({ ...prev, dropGift: false }));
                }
                break;

        }

        setGameState(prev => ({
            ...prev,
            timeElapsed: prev.timeElapsed + deltaTime
        }));
    }, [
        currentLevel, platforms, levelScroll, player, platformConfig?.scrollSpeed,
        gameState.isLevelComplete, 
        updateLevel1, level1State,
        updateLevel2, level2State,
        updateLevel3, level3State, updateLevel3Player,
        updateLevel4, level4State, updateLevel4Player,
        checkAndRegenerateContent
    ]);

    useGameLoop(updateGame);

    const handleGameNextLevel = useCallback(() => {
        const nextLevel = handleNextLevel();
        if (nextLevel) {
            onLevelSelect(nextLevel);
        }
    }, [handleNextLevel, onLevelSelect]);

    if (!currentLevel || !levelConfig) {
        return (
            <GameEngine onBack={onBack} width={size.width} height={size.height}>
                <LevelSelector 
                    onSelectLevel={onLevelSelect}
                    onBack={onBack}
                    size={size}
                />
            </GameEngine>
        );
    }

    return (
        <GameEngine onBack={onBack} onSwipe={handleSwipe} width={size.width} height={size.height}>
            <GameScene 
                size={size}
                platforms={platforms || []} 
                player={player}
                swipeState={swipeState}
                levelScroll={levelScroll}
                snowballs={snowballs}
                score={gameState.score}
                timeElapsed={gameState.timeElapsed}
                goalScore={gameState.goalScore}
                isLevelComplete={gameState.isLevelComplete}
                onNextLevel={handleGameNextLevel}
                currentLevel={currentLevel}
                currentLevelConfig={levelConfig}
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

