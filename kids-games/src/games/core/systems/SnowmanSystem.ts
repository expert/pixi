import { Snowman, PlatformConfig } from '../../xmas/types';
import { GROUND_Y } from '../../xmas/constants';

export class SnowmanSystem {
    static generateSnowman(): Snowman {
        return {
            x: 1000, // Fixed position off-screen to the right
            y: Math.random() * 300 + 200, // Adjusted height range
            hit: false,
            createdAt: performance.now(),
            duration: 8000,
            velocityX: -200 // Add velocity for movement
        };
    }

    static updateSnowmen(snowmen: Snowman[], deltaTime: number): Snowman[] {
        const currentTime = performance.now();
        
        return snowmen
            .map(snowman => ({
                ...snowman,
                x: snowman.x + snowman.velocityX * deltaTime // Move snowman left
            }))
            .filter(snowman => {
                const age = currentTime - snowman.createdAt;
                return age < snowman.duration && !snowman.hit && snowman.x > -100;
            });
    }

    static shouldGenerateNewSnowman(): boolean {
        return Math.random() < 0.02; // 2% chance each frame
    }
} 