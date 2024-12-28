import { useState } from 'react';
import { GiftSystem } from '../../core/systems/GiftSystem';
import { PlayerState, Gift } from '../types';
import { updateFlyPlayer } from '../../core/entities/PlayerEntity';

export const useLevel3State = (initialState: {
    gifts: Gift[];
    score: number;
    goalScore: number;
    isLevelComplete?: boolean;
}) => {
    const [state, setState] = useState({
        ...initialState,
        isLevelComplete: false
    });

    const updateLevel3 = (deltaTime: number, player: PlayerState) => {
        setState(prevState => {
            // Update gifts
            const updatedGifts = GiftSystem.updateGifts(prevState.gifts);
            let newGifts = updatedGifts;
            
            if (updatedGifts.length < 5 && GiftSystem.shouldGenerateNewGift()) {
                newGifts = [...updatedGifts, GiftSystem.generateGift()];
            }

            // Check collisions
            const { collectedGifts, remainingGifts } = 
                GiftSystem.checkCollisions(player.x, player.y, newGifts);
            
            const newScore = prevState.score + collectedGifts.length;

            return {
                gifts: remainingGifts,
                score: newScore,
                goalScore: prevState.goalScore,
                isLevelComplete: newScore >= prevState.goalScore
            };
        });
    };

    const updatePlayer = (player: PlayerState, deltaTime: number, width: number) => {
        return updateFlyPlayer(player, deltaTime, width);
    };

    return [state, updateLevel3, updatePlayer] as const;
}; 