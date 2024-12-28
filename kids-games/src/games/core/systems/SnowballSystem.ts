import { Snowball, PlatformConfig, PlayerState } from '../../xmas/types';
import { GROUND_Y } from '../../xmas/constants';

export class SnowballSystem {
    static generateSnowballs(config: PlatformConfig): Snowball[] {
        const snowballs: Snowball[] = [];
        let currentX = config.startX || 800; // Use provided startX or default
        
        while (currentX < config.levelWidth) {
            // Random spacing between snowballs
            const spacing = Math.random() * 300 + 200; // 200-500px spacing
            
            const size = Math.random() * 
                (config.snowballs.maxSize - config.snowballs.minSize) + 
                config.snowballs.minSize;
            
            // Calculate y position from ground up
            const height = Math.random() * 
                (GROUND_Y - 100) + 100; // Keep some margin from top
            
            snowballs.push({
                x: currentX,
                y: GROUND_Y - height,
                size,
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

            if (distance < (25 + snowball.size / 2)) {
                collectedSnowballs.push({ ...snowball, collected: true });
            } else {
                remainingSnowballs.push(snowball);
            }
        });

        return { collectedSnowballs, remainingSnowballs };
    }
} 