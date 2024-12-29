import { useState } from 'react';
import { SnowballSystem } from '../../core/systems/SnowballSystem';
import { PlayerState, Platform, LevelConfig, AppSize, Snowball } from '../types';
import { SwipeState } from '../../core/controllers/SwipeController';
import { handleJumpPlayer } from '../../core/entities/PlayerEntity'
export const useLevel1State = (initialState: {
    snowballs: Snowball[];
    score: number;
    goalScore: number;
    isLevelComplete?: boolean;
    size: AppSize;
    backgroundImage?: string;
}) => { 
    const [state, setState] = useState({
        ...initialState,
        isLevelComplete: false
    });

    const handleJump = (player: PlayerState, swipeState: SwipeState, size: AppSize) => {
        return handleJumpPlayer(player, swipeState, size);
    };

    const updateLevel1 = (
        deltaTime: number, 
        player: PlayerState,
        levelScroll: number,
        size: AppSize
    ) => {
        setState(prevState => {
            const { collectedSnowballs, remainingSnowballs } = 
                SnowballSystem.checkCollisions(player, prevState.snowballs, levelScroll);
            
            const newScore = prevState.score + collectedSnowballs.length;

            return {
                ...prevState,
                snowballs: remainingSnowballs,
                score: newScore,
                goalScore: prevState.goalScore,
                isLevelComplete: newScore >= prevState.goalScore
            };
        });
    };

    const initializeLevel = (levelConfig: LevelConfig, size: AppSize) => {
        setState(prev => ({
            ...prev,
            snowballs: SnowballSystem.generateSnowballs(levelConfig, size)
        }));
    };

    return [state, updateLevel1, handleJump, initializeLevel] as const;
}; 