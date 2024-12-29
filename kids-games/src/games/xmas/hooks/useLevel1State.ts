import { useState, useCallback } from 'react';
import { SnowballSystem } from '../../core/systems/SnowballSystem';
import { PlayerState, Platform, LevelConfig, AppSize, Snowball } from '../types';
import { SwipeState } from '../../core/controllers/SwipeController';
import { handleJumpPlayer } from '../../core/entities/PlayerEntity'
import { DEFAULT_LEVEL_CONFIGS } from '../constants';

export const useLevel1State = (initialState: Level1State) => {
    const [state, setState] = useState(initialState);

    const updateLevel1 = useCallback((
        deltaTime: number, 
        player: PlayerState, 
        levelScroll: number,
        size: AppSize
    ) => {
        setState(prev => {
            const { collectedSnowballs, remainingSnowballs } = 
                SnowballSystem.checkCollisions(player, prev.snowballs, levelScroll);

            // Generate new snowballs only if needed
            const allSnowballs = SnowballSystem.generateSnowballs(
                DEFAULT_LEVEL_CONFIGS.LEVEL_1,
                size,
                prev.score + collectedSnowballs.length,
                prev.goalScore,
                remainingSnowballs
            );

            return {
                ...prev,
                snowballs: allSnowballs,
                score: prev.score + collectedSnowballs.length,
                isLevelComplete: prev.score + collectedSnowballs.length >= prev.goalScore
            };
        });
    }, []);

    const handleJump = (player: PlayerState, swipeState: SwipeState, size: AppSize) => {
        return handleJumpPlayer(player, swipeState, size);
    };

    const initializeLevel = (levelConfig: LevelConfig, size: AppSize) => {
        setState(prev => ({
            ...prev,
            snowballs: SnowballSystem.generateSnowballs(
                levelConfig, 
                size,
                prev.score,
                prev.goalScore
            )
        }));
    };

    return [state, updateLevel1, handleJump, initializeLevel] as const;
}; 