import { useState } from 'react';
import { PlayerState, Gift, House, AppSize } from '../types';
import { HouseSystem } from '../../core/systems/HouseSystem';
import { updateFlyPlayer } from '../../core/entities/PlayerEntity';
import { calculateAvailableHeight } from '../../core/utils/heightCalculator';

export const useLevel4State = (initialState: {
    gifts: Gift[];
    houses: House[];
    score: number;
    goalScore: number;
    isLevelComplete?: boolean;
    size: AppSize;
}) => {
    const [state, setState] = useState({
        ...initialState,
        isLevelComplete: false
    });

    const updateLevel4 = (deltaTime: number, player: PlayerState, size: AppSize) => {
      //@ts-expect-error Fix this
        setState(prevState => {
            // Update houses
            let updatedHouses = HouseSystem.updateHouses(
                prevState.houses, 
                -100 * deltaTime, 
                deltaTime
            ).filter(house => house.x > -200);

            // Generate new houses if needed
            if (updatedHouses.length < 3) {
                updatedHouses = [...updatedHouses, HouseSystem.generateHouse(0, size)];
            }

            // Update gifts
            const updatedGifts = prevState.gifts.map(gift => {
                if (!gift.isDelivering) return gift;

                const newY = gift.y + (gift.velocityY || 0) * deltaTime;
                const newVelocityY = (gift.velocityY || 0) + 800 * deltaTime;

                const { deliveredToHouse, updatedHouses: housesAfterDelivery } = 
                    HouseSystem.checkGiftDelivery(
                        { ...gift, y: newY }, 
                        updatedHouses
                    );

                if (deliveredToHouse) {
                    updatedHouses = housesAfterDelivery;
                    return { ...gift, collected: true };
                }

                if (newY > calculateAvailableHeight(size)) {
                    return { ...gift, collected: true };
                }

                return {
                    ...gift,
                    y: newY,
                    velocityY: newVelocityY
                };
            }).filter(gift => !gift.collected);

            // Add new gift if player dropped one
                //@ts-expect-error Fix this
            const newGifts = player.dropGift 
                ? [...updatedGifts, {
                    x: player.x,
                    y: player.y,
                    collected: false,
                    createdAt: performance.now(),
                    isDelivering: true,
                    velocityY: 0
                }]
                : updatedGifts;

            const deliveredCount = prevState.score + 
                (prevState.gifts.length - updatedGifts.length);

            return {
                gifts: newGifts,
                houses: updatedHouses,
                score: deliveredCount,
                goalScore: prevState.goalScore,
                isLevelComplete: deliveredCount >= prevState.goalScore
            };
        });
    };

    const updatePlayer = (player: PlayerState, deltaTime: number, size: AppSize) => {
        return updateFlyPlayer(player, deltaTime, size);
    };

    return [state, updateLevel4, updatePlayer] as const;
}; 