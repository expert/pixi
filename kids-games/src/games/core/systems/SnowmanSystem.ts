import { Snowman, Projectile } from '../../xmas/types';
import { 
    createSnowman, 
    updateSnowmanPosition, 
    isSnowmanActive,
    checkProjectileHit 
} from '../entities/SnowmanEntity';

export class SnowmanSystem {
    static generateSnowman(): Snowman {
        const x = 1000; // Fixed position off-screen to the right
        const y = Math.random() * 300 + 200; // Random height
        return createSnowman(x, y);
    }

    static updateSnowmen(snowmen: Snowman[], deltaTime: number): Snowman[] {
        const currentTime = performance.now();
        
        return snowmen
            .map(snowman => updateSnowmanPosition(snowman, deltaTime))
            .filter(snowman => isSnowmanActive(snowman, currentTime));
    }

    static shouldGenerateNewSnowman(): boolean {
        return Math.random() < 0.02;
    }

    static checkSnowmanHits(
        projectiles: Projectile[], 
        snowmen: Snowman[]
    ): { hits: number; remainingSnowmen: Snowman[] } {
        let hits = 0;
        const remainingSnowmen = snowmen.map(snowman => {
            if (snowman.hit) return snowman;
            
            const wasHit = projectiles.some(projectile => {
                if (!projectile.active) return false;
                return checkProjectileHit(snowman, projectile.x, projectile.y);
            });

            if (wasHit) hits++;
            return { ...snowman, hit: wasHit };
        });

        return { hits, remainingSnowmen };
    }
} 