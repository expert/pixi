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

import { useLevel1State } from './hooks/useLevel1State';
import { useLevel2State } from './hooks/useLevel2State';
import { useLevel3State } from './hooks/useLevel3State';
import { useLevel4State } from './hooks/useLevel4State';

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
    const [level2State, updateLevel2, handleLevel2Shot] = useLevel2State({
        projectiles,
        snowmen,
        score: gameState.score,
        goalScore: gameState.goalScore
    });
    const [level1State, updateLevel1, handleLevel1Jump, initializeLevel1] = useLevel1State({
        snowballs: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_1.goalScore
    });
    const [level3State, updateLevel3, updateLevel3Player] = useLevel3State({
        gifts: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_3.goalScore
    });
    const [level4State, updateLevel4, updateLevel4Player] = useLevel4State({
        gifts: [],
        houses: [],
        score: 0,
        goalScore: DEFAULT_LEVEL_CONFIGS.LEVEL_4.goalScore
    });
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
        
        if (level === 'LEVEL_1') {
            initializeLevel1(_levelConfig);
        }
        
        setSnowmen(['LEVEL_2'].includes(level) 
            ? [SnowmanSystem.generateSnowman()] 
            : []
        );
        setHouses(level === 'LEVEL_4' 
            ? [HouseSystem.generateHouse(800)] 
            : []
        );
    }, [initializeLevel1]);

    const handleNextLevel = useCallback(() => {
        const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'];
        const currentIndex = levels.indexOf(currentLevel!);
        if (currentIndex < levels.length - 1) {
            handleLevelSelect(levels[currentIndex + 1]);
        }
    }, [currentLevel, handleLevelSelect]);

    const checkAndRegenerateContent = useCallback(() => {
        switch (currentLevel) {
            case 'LEVEL_1':
                setPlatforms(prev => 
                    regeneratePlatforms(prev, levelScroll, platformConfig)
                );
                break;
            
            case 'LEVEL_2':
                setPlatforms(prev => 
                    regeneratePlatforms(prev, levelScroll, platformConfig)
                );
                setSnowmen(prev => prev.filter(s => 
                    !s.hit && s.x + levelScroll > -500
                ));
                break;
        }
    }, [
        currentLevel, 
        levelScroll, 
        platformConfig
    ]);

    const handleSwipe = useCallback((newSwipeState: SwipeState) => {
        switch (currentLevel) {
            case 'LEVEL_1':
                setSwipeState(newSwipeState);
                setPlayer(handleLevel1Jump(player, newSwipeState));
                break;
            
            case 'LEVEL_2':
                handleLevel2Shot(player, newSwipeState);
                break;
            
            case 'LEVEL_3':
            case 'LEVEL_4':
                setPlayer(handleFlyPlayer(player, newSwipeState));
                break;
        }
    }, [
        currentLevel, 
        player, 
        handleLevel2Shot, 
        handleLevel1Jump
    ]);

    const updateGame = useCallback((deltaTime: number) => {
        if (gameState.isLevelComplete) return;

        // Common platform-based level updates
        const updatePlatformBasedLevel = () => {
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
        };

        switch (currentLevel) {
            case 'LEVEL_1':
                updateLevel1(deltaTime, player, levelScroll);
                setSnowballs(level1State.snowballs);
                setGameState(prev => ({
                    ...prev,
                    score: level1State.score,
                    isLevelComplete: level1State.isLevelComplete
                }));
                updatePlatformBasedLevel();
                break;

            case 'LEVEL_2':
                updateLevel2(deltaTime, platforms, levelScroll);
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
                setPlayer(updateLevel3Player(player, deltaTime));
                updateLevel3(deltaTime, player);
                setGifts(level3State.gifts);
                setGameState(prev => ({
                    ...prev,
                    score: level3State.score,
                    isLevelComplete: level3State.isLevelComplete
                }));
                break;

            case 'LEVEL_4':
                setPlayer(updateLevel4Player(player, deltaTime));
                updateLevel4(deltaTime, player);
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
        currentLevel, platforms, levelScroll, player, platformConfig.scrollSpeed,
        gameState.isLevelComplete, 
        updateLevel1, level1State,
        updateLevel2, level2State,
        updateLevel3, level3State, updateLevel3Player,
        updateLevel4, level4State, updateLevel4Player,
        checkAndRegenerateContent
    ]);

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