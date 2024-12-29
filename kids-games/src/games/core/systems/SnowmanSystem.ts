import { Snowman, Projectile } from '../../xmas/types';
import { 
    createSnowman, 
    updateSnowmanPosition, 
    isSnowmanActive,
    checkProjectileHit 
} from '../entities/SnowmanEntity';

export class SnowmanSystem {
    static generateSnowman(): Snowman {
        // Random position at the top of the screen
        const x = Math.random() * 100 + 200; // Random x position
        const y = -50; // Start above the screen
        return createSnowman(x, y);
    }

    static shouldGenerateNewSnowman(currentSnowmen: Snowman[], goalScore: number, currentScore: number): boolean {
        // Keep generating snowmen until goal is reached
        const activeSnowmen = currentSnowmen.filter(s => !s.hit && s.y < 800).length;
        const remainingNeeded = goalScore - currentScore;
        
        // Generate more frequently if we need more hits
        const baseChance = 0.1; // Increased base chance
        const dynamicChance = Math.min(0.3, baseChance + (remainingNeeded * 0.02));
        
        return activeSnowmen < 5 && remainingNeeded > 0 && Math.random() < dynamicChance;
    }

    static updateSnowmen(snowmen: Snowman[], deltaTime: number): Snowman[] {
        const currentTime = performance.now();
        return snowmen
            .map(snowman => updateSnowmanPosition(snowman, deltaTime))
            .filter(snowman => isSnowmanActive(snowman, currentTime));
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