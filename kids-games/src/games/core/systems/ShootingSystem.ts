import { PlayerState, Projectile, Platform, Snowman, AppSize } from '../../xmas/types';
import { SwipeState } from '../controllers/SwipeController';

export class ShootingSystem {
    static startShot(player: PlayerState, swipeState: SwipeState, size: AppSize): Projectile | null {
        if (!swipeState.startPoint || !swipeState.endPoint) return null;

        const baseSpeed = Math.min(swipeState.magnitude * 8, size.height - 50);
        
        const dx = swipeState.startPoint.x - swipeState.endPoint.x;
        const dy = swipeState.startPoint.y - swipeState.endPoint.y;
        const angle = Math.atan2(-dy, -dx);

        return {
            x: player.x,
            y: player.y,
            velocityX: baseSpeed * Math.cos(angle),
            velocityY: baseSpeed * Math.sin(angle),
            active: true
        };
    }

    static updateProjectile(projectile: Projectile, platforms: Platform[], size: AppSize, deltaTime: number): Projectile {
        const gravity = 500;
        const newY = projectile.y + projectile.velocityY * deltaTime;
        const newX = projectile.x + projectile.velocityX * deltaTime;
        
        // Check platform collisions
        const hitsPlatform = platforms.some(platform => 
            newX >= platform.x && 
            newX <= platform.x + platform.width &&
            newY >= platform.y && 
            newY <= platform.y + 10
        );
        
        if (hitsPlatform || newY < 0 || newY > size.height) {
            return { ...projectile, active: false };
        }

        return {
            ...projectile,
            x: newX,
            y: newY,
            velocityY: projectile.velocityY + gravity * deltaTime
        };
    }

    static checkSnowmanHits(projectiles: Projectile[], snowmen: Snowman[]) {
        let hits = 0;
        const remainingSnowmen = snowmen.map(snowman => {
            if (snowman.hit) return snowman;
            
            const wasHit = projectiles.some(projectile => {
                if (!projectile.active) return false;
                const distance = Math.sqrt(
                    Math.pow(projectile.x - snowman.x, 2) + 
                    Math.pow(projectile.y - snowman.y, 2)
                );
                return distance < 30; // Snowman hit radius
            });

            if (wasHit) hits++;
            return { ...snowman, hit: wasHit ? true : snowman.hit };
        });

        return { hits, remainingSnowmen };
    }

    static checkPlatformHits(projectiles: Projectile[], platforms: Platform[], levelScroll: number): Projectile[] {
        return projectiles.map(projectile => {
            if (!projectile.active) return projectile;
            
            const hitsPlatform = platforms.some(platform => {
                const platformX = platform.x + levelScroll;
                return projectile.x >= platformX && 
                       projectile.x <= platformX + platform.width &&
                       projectile.y >= platform.y && 
                       projectile.y <= platform.y + 10;
            });

            return hitsPlatform ? { ...projectile, active: false } : projectile;
        });
    }
} 