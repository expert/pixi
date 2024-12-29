import { Snowman, Projectile, AppSize } from '../../xmas/types';
import { 
    createSnowman, 
    updateSnowmanPosition, 
    isSnowmanActive,
    checkProjectileHit 
} from '../entities/SnowmanEntity';

export class SnowmanSystem {
    static generateSnowman(size: AppSize): Snowman {
        const x = Math.random() * (size.width - 100) + 50;
        const y = -50;
        const snowman = createSnowman(x, y);
        return snowman;
    }

    static shouldGenerateNewSnowman(currentSnowmen: Snowman[], goalScore: number, currentScore: number, size: AppSize): boolean {
        // Count only snowmen that are in play (not hit and on screen)
        const activeSnowmen = currentSnowmen.filter(s => 
            !s.hit && 
            s.y > -100 && 
            s.y < size.height - 100
        ).length;
        
        const remainingNeeded = goalScore - currentScore;
        
        // Generate more frequently when fewer snowmen are active
        return activeSnowmen < 3 && remainingNeeded > 0;
    }

    static updateSnowmen(snowmen: Snowman[], deltaTime: number, size: AppSize): Snowman[] {
        const currentTime = performance.now();
        return snowmen
            .map(snowman => updateSnowmanPosition(snowman, deltaTime))
            .filter(snowman => isSnowmanActive(snowman, currentTime, size));
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