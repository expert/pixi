import { useState, useCallback } from 'react';
import { LevelConfig } from '../types';
import { DEFAULT_LEVEL_CONFIGS } from '../constants';
import { generatePlatforms } from '../../core/entities/PlatformEntity';
import { SnowmanSystem } from '../../core/systems/SnowmanSystem';
import { HouseSystem } from '../../core/systems/HouseSystem';
import { createPlayer } from '../../core/entities/PlayerEntity';

export const useLevelManager = (initializeLevel1: (config: LevelConfig) => void) => {
    const [currentLevel, setCurrentLevel] = useState<string | null>(null);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);

    const resetLevel = useCallback((level: string) => {
        return {
            levelScroll: 0,
            platforms: [],
            snowballs: [],
            gifts: [],
            player: createPlayer(),
            gameState: {
                score: 0,
                timeElapsed: 0,
                isLevelComplete: false,
                goalScore: DEFAULT_LEVEL_CONFIGS[level].goalScore
            }
        };
    }, []);

    const handleLevelSelect = useCallback((level: string) => {
        setCurrentLevel(level);
        const _levelConfig = DEFAULT_LEVEL_CONFIGS[level];
        setLevelConfig(_levelConfig);

        const initialState = resetLevel(level);
        if(!_levelConfig) return initialState;

        const platforms = ['LEVEL_1', 'LEVEL_2'].includes(level) 
            ? generatePlatforms(_levelConfig) 
            : [];
        
        if (level === 'LEVEL_1') {
            initializeLevel1(_levelConfig);
        }
        
        const snowmen = ['LEVEL_2'].includes(level) 
            ? [SnowmanSystem.generateSnowman()] 
            : [];

        const houses = level === 'LEVEL_4' 
            ? [HouseSystem.generateHouse(width)] 
            : [];

        return {
            ...initialState,
            platforms,
            snowmen,
            houses
        };
    }, [resetLevel, initializeLevel1]);

    const handleNextLevel = useCallback(() => {
        const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'];
        const currentIndex = levels.indexOf(currentLevel!);
        if (currentIndex < levels.length - 1) {
            return handleLevelSelect(levels[currentIndex + 1]);
        }
        return null;
    }, [currentLevel, handleLevelSelect]);

    return {
        currentLevel,
        levelConfig,
        handleLevelSelect,
        handleNextLevel
    };
}; 