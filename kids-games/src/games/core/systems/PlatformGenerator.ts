import { Platform, PlatformConfig } from '../../xmas/types';
import { GROUND_Y } from '../../xmas/constants';

export class PlatformGenerator {
    static generateLevel(config: PlatformConfig): Platform[] {
        const platforms: Platform[] = [];
        let currentX = config.startX || config.width;  // Use screen width if no startX
        
        while (currentX < config.levelWidth) {
            const width = Math.random() * 
                (config.platformSpecs.maxWidth - config.platformSpecs.minWidth) + 
                config.platformSpecs.minWidth;
                
            const height = Math.random() * 
                (config.platformSpecs.maxHeight - config.platformSpecs.minHeight) + 
                config.platformSpecs.minHeight;
                
            const gap = Math.random() * 
                (config.platformSpecs.maxGap - config.platformSpecs.minGap) + 
                config.platformSpecs.minGap;

            // Randomly make some platforms moving individually
            const isMoving = Math.random() > 0.39;
            const moveDistance = Math.random() * 200 + 100; // Random movement distance between 100-300

            platforms.push({
                x: currentX,
                y: GROUND_Y - height,
                width,
                isScrolling: true,
                scrollSpeed: config.scrollSpeed,
                // Add individual movement properties
                isMoving: isMoving,
                startX: isMoving ? currentX - moveDistance/2 : undefined,
                endX: isMoving ? currentX + moveDistance/2 : undefined,
                speed: isMoving ? 100 : undefined,
                direction: isMoving ? 1 : undefined
            });

            currentX += width + gap;
        }

        return platforms;
    }
} 