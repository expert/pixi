import { useState } from 'react';
import { SnowballSystem } from '../../core/systems/SnowballSystem';
import { PlayerState, Platform, LevelConfig } from '../types';
import { SwipeState } from '../../core/controllers/SwipeController';
import { handleJumpPlayer } from '../../core/entities/PlayerEntity'
export const useLevel1State = (initialState: {
    snowballs: Snowball[];
    score: number;
    goalScore: number;
    isLevelComplete?: boolean;
}) => {
    const [state, setState] = useState({
        ...initialState,
        isLevelComplete: false
    });

    const handleJump = (player: PlayerState, swipeState: SwipeState) => {
        return handleJumpPlayer(player, swipeState);
    };

    const updateLevel1 = (
        deltaTime: number, 
        player: PlayerState,
        levelScroll: number
    ) => {
        setState(prevState => {
            const { collectedSnowballs, remainingSnowballs } = 
                SnowballSystem.checkCollisions(player, prevState.snowballs, levelScroll);
            
            const newScore = prevState.score + collectedSnowballs.length;

            return {
                snowballs: remainingSnowballs,
                score: newScore,
                goalScore: prevState.goalScore,
                isLevelComplete: newScore >= prevState.goalScore
            };
        });
    };

    const initializeLevel = (levelConfig: LevelConfig) => {
        setState(prev => ({
            ...prev,
            snowballs: SnowballSystem.generateSnowballs(levelConfig)
        }));
    };

    return [state, updateLevel1, handleJump, initializeLevel] as const;
}; 