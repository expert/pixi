import { Snowman, PlatformConfig } from '../../xmas/types';
import { GROUND_Y } from '../../xmas/constants';

export class SnowmanSystem {
    static generateSnowman(): Snowman {
        return {
            x: Math.random() * 600 + 100, // Random position between 100-700
            // y: GROUND_Y - 25,
            y: Math.random() * 500 + 100,
            hit: false,
            createdAt: performance.now(),
            duration: 5000 // 5 seconds
        };
    }

    static updateSnowmen(snowmen: Snowman[]): Snowman[] {
        const currentTime = performance.now();
        
        // Remove expired or hit snowmen
        return snowmen.filter(snowman => {
            const age = currentTime - snowman.createdAt;
            return age < snowman.duration && !snowman.hit;
        });
    }

    static shouldGenerateNewSnowman(): boolean {
        // 5% chance each frame to generate a new snowman if less than 3 exist
        return Math.random() < 0.05;
    }
} 