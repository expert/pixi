import { Platform, PlatformConfig } from '../../xmas/types';
import { GROUND_Y } from '../../xmas/constants';

export class PlatformGenerator {
    static generatePlatforms(config: PlatformConfig): Platform[] {
        const platforms: Platform[] = [];
        
        // Calculate base positions based on direction
        const basePositions = this.calculateBasePositions(config);
        
        for (let i = 0; i < config.count; i++) {
            const x = basePositions[i].x;
            const y = basePositions[i].y;
            
            // Generate random platform properties within constraints
            const width = Math.random() * (config.width.max - config.width.min) + config.width.min;
            const speed = Math.random() * (config.speed.max - config.speed.min) + config.speed.min;
            const moveDistance = Math.random() * (config.moveDistance.max - config.moveDistance.min) + config.moveDistance.min;

            // Create platform with movement based on direction
            platforms.push({
                x,
                y,
                width,
                isMoving: true,
                startX: config.direction === 'horizontal' ? x : x - moveDistance/2,
                endX: config.direction === 'horizontal' ? x + moveDistance : x + moveDistance/2,
                speed,
                direction: 1
            });
        }

        return platforms;
    }

    private static calculateBasePositions(config: PlatformConfig): Array<{x: number, y: number}> {
        const positions: Array<{x: number, y: number}> = [];
        
        if (config.direction === 'horizontal') {
            // Spread platforms horizontally with increasing height
            const baseX = 100; // Start from left with padding
            const maxHeight = GROUND_Y - 100; // Keep some space from ground
            
            for (let i = 0; i < config.count; i++) {
                positions.push({
                    x: baseX + i * (600 / config.count), // Spread across 600px width
                    y: maxHeight - (Math.random() * (config.height.max - config.height.min) + config.height.min)
                });
            }
        } else {
            // Spread platforms vertically with alternating sides
            const maxHeight = GROUND_Y - 100;
            const heightStep = maxHeight / config.count;
            
            for (let i = 0; i < config.count; i++) {
                positions.push({
                    x: i % 2 === 0 ? 200 : 600, // Alternate between left and right
                    y: GROUND_Y - 100 - (i * heightStep)
                });
            }
        }

        return positions;
    }
} 