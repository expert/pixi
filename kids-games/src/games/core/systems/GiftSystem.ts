import { Gift, PlatformConfig, AppSize } from '../../xmas/types';
import { calculateAvailableHeight } from '../utils/heightCalculator';

export class GiftSystem {
    static generateGift(size: AppSize): Gift {
        return {
            x: Math.random() * 600 + 100,
            y: Math.random() * calculateAvailableHeight(size, 100) + 50,
            collected: false,
            createdAt: performance.now()
        };
    }

    static updateGifts(gifts: Gift[]): Gift[] {
        return gifts.filter(gift => !gift.collected);
    }

    static shouldGenerateNewGift(): boolean {
        return Math.random() < 0.03;
    }

    static checkCollisions(playerX: number, playerY: number, gifts: Gift[]): {
        collectedGifts: Gift[];
        remainingGifts: Gift[];
    } {
        const collectedGifts: Gift[] = [];
        const remainingGifts: Gift[] = [];

        gifts.forEach(gift => {
            if (gift.collected) {
                remainingGifts.push(gift);
                return;
            }

            const distance = Math.sqrt(
                Math.pow(playerX - gift.x, 2) + 
                Math.pow(playerY - gift.y, 2)
            );

            if (distance < 40) {
                collectedGifts.push({ ...gift, collected: true });
            } else {
                remainingGifts.push(gift);
            }
        });

        return { collectedGifts, remainingGifts };
    }
} 