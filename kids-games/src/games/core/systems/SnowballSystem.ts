import { Snowball, PlatformConfig, PlayerState, AppSize } from '../../xmas/types';
import { PLAYER_HEIGHT } from '../../xmas/constants';

export class SnowballSystem {
    static generateSnowballs(config: PlatformConfig, size: AppSize): Snowball[] {
        const snowballs: Snowball[] = [];
        let currentX = config.startX || size.width; // Use provided startX or default
        
        while (currentX < config.levelWidth) {
            // Random spacing between snowballs
            const spacing = Math.random() * 300 + 200; // 200-500px spacing
            
            const snowballSize = Math.random() * 
                (config.snowballs.maxSize - config.snowballs.minSize) + 
                config.snowballs.minSize;
            
            const maxHeight = size.height - PLAYER_HEIGHT - snowballSize;
            const minHeight = maxHeight * 0.2; // Keep some margin from top (20% of available height)
            const height = Math.random() * (maxHeight - minHeight) + minHeight;
            
            snowballs.push({
                x: currentX,
                y: height,
                size: snowballSize,
                collected: false
            });
            
            currentX += spacing;
        }
        
        return snowballs;
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