import { useState, useCallback } from 'react';
import { AppSize, LevelConfig } from '../types';
import { DEFAULT_LEVEL_CONFIGS } from '../constants';
import { generatePlatforms } from '../../core/entities/PlatformEntity';
import { SnowmanSystem } from '../../core/systems/SnowmanSystem';
import { HouseSystem } from '../../core/systems/HouseSystem';
import { createPlayer } from '../../core/entities/PlayerEntity';

export const useLevelManager = (initializeLevel1: (config: LevelConfig, size: AppSize) => void, size: AppSize) => {
    const [currentLevel, setCurrentLevel] = useState<string | null>(null);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);

    const handleLevelSelect = useCallback((level: string) => {
        console.log('handleLevelSelect', level);
        setCurrentLevel(level);
        const _levelConfig = DEFAULT_LEVEL_CONFIGS[level];
        setLevelConfig(_levelConfig);

        const initialState = {
            levelScroll: 0,
            platforms: ['LEVEL_1', 'LEVEL_2'].includes(level) 
                ? generatePlatforms(_levelConfig, size) 
                : [],
            snowballs: [],
            gifts: [],
            player: createPlayer(size),
            snowmen: ['LEVEL_2'].includes(level) ? [SnowmanSystem.generateSnowman()] : [],
            houses: level === 'LEVEL_4' ? [HouseSystem.generateHouse(size.width, size)] : [],
            gameState: {
                score: 0,
                timeElapsed: 0,
                isLevelComplete: false,
                goalScore: _levelConfig.goalScore
            }
        };

        // Initialize level-specific state
        if (level === 'LEVEL_1') {
            initializeLevel1(_levelConfig, size);
        }

        return initialState;
    }, [size, initializeLevel1]);

    const handleNextLevel = useCallback(() => {
        const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'];
        const currentIndex = levels.indexOf(currentLevel!);
        if (currentIndex < levels.length - 1) {
            const nextLevel = levels[currentIndex + 1];
            console.log('Moving to next level:', nextLevel);
            setCurrentLevel(nextLevel);
            return nextLevel;
        }
        return null;
    }, [currentLevel]);

    return {
        currentLevel,
        levelConfig,
        handleLevelSelect,
        handleNextLevel
    };
}; 