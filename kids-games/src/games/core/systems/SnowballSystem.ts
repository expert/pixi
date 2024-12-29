import { Snowball, PlatformConfig, PlayerState, AppSize } from '../../xmas/types';
import { PLAYER_HEIGHT } from '../../xmas/constants';

export class SnowballSystem {
    static generateSnowballs(
        config: PlatformConfig, 
        size: AppSize, 
        currentScore: number,
        goalScore: number,
        existingSnowballs: Snowball[] = []
    ): Snowball[] {
        // Don't generate more snowballs if goal is reached
        if (currentScore >= goalScore) {
            return existingSnowballs;
        }

        // Keep existing snowballs that are still valid
        const lastSnowball = existingSnowballs[existingSnowballs.length - 1];
        const startX = lastSnowball ? lastSnowball.x + 100 : (config.startX || size.width);
        
        const newSnowballs: Snowball[] = [];
        let currentX = startX;
        
        while (currentX < config.levelWidth) {
            const spacing = config.snowballs.spacing ? 
                Math.random() * 
                    (config.snowballs.spacing.max - config.snowballs.spacing.min) + 
                    config.snowballs.spacing.min
                : Math.random() * 300 + 200;
            
            // More frequent snowball generation
            if (Math.random() < config.snowballs.frequency) {
                const snowballSize = Math.random() * 
                    (config.snowballs.maxSize - config.snowballs.minSize) + 
                    config.snowballs.minSize;
                
                const maxHeight = size.height - PLAYER_HEIGHT - snowballSize;
                const minHeight = maxHeight * 0.1; // Lower minimum height for better distribution
                const height = Math.random() * (maxHeight - minHeight) + minHeight;
                
                newSnowballs.push({
                    x: currentX,
                    y: height,
                    size: snowballSize,
                    collected: false
                });
            }
            
            currentX += spacing;
        }
        
        return [...existingSnowballs, ...newSnowballs];
    }

    static checkCollisions(player: PlayerState, snowballs: Snowball[], levelScroll: number): {
        collectedSnowballs: Snowball[];
        remainingSnowballs: Snowball[];
    } {
        const collectedSnowballs: Snowball[] = [];
        const remainingSnowballs: Snowball[] = [];

        snowballs.forEach(snowball => {
            if (snowball.collected) {
                remainingSnowballs.push(snowball);
                return;
            }

            const snowballX = snowball.x + levelScroll;
            const distance = Math.sqrt(
                Math.pow(player.x - snowballX, 2) + 
                Math.pow(player.y - snowball.y, 2)
            );

            // Use snowball size for more accurate collision
            const collisionRadius = PLAYER_HEIGHT/2 + snowball.size/2;
            if (distance < collisionRadius) {
                collectedSnowballs.push({ ...snowball, collected: true });
            } else {
                remainingSnowballs.push(snowball);
            }
        });

        return { collectedSnowballs, remainingSnowballs };
    }
} 