import { AppSize, Gift, House } from '../../xmas/types';
import { calculateAvailableHeight } from '../utils/heightCalculator';

export class HouseSystem {
    static generateHouse(startX: number, size: AppSize): House {
        return {
            x: startX,
            y: calculateAvailableHeight(size, 80),
            width: 100,
            height: 80,
            hasReceivedGift: false
        };
    }

    static generateHouses(count: number, size: AppSize): House[] {
        const houses: House[] = [];
        let currentX = size.width;

        for (let i = 0; i < count; i++) {
            houses.push(this.generateHouse(currentX, size));
            currentX += Math.random() * 300 + 400;
        }

        return houses;
    }

    static updateHouses(houses: House[], scrollSpeed: number, deltaTime: number): House[] {
        return houses.map(house => ({
            ...house,
            x: house.x + scrollSpeed * deltaTime
        })).filter(house => house.x > -200); // Remove houses that are off screen
    }

    static checkGiftDelivery(gift: Gift, houses: House[]): {
        deliveredToHouse: boolean;
        updatedHouses: House[];
    } {
        let deliveredToHouse = false;
        const updatedHouses = houses.map(house => {
            if (house.hasReceivedGift) return house;

            if (gift.y >= house.y && 
                gift.x >= house.x && 
                gift.x <= house.x + house.width) {
                deliveredToHouse = true;
                return { ...house, hasReceivedGift: true };
            }
            return house;
        });

        return { deliveredToHouse, updatedHouses };
    }
} 