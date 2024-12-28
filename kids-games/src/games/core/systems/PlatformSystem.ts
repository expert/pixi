import { Platform } from '../../xmas/types';

export class PlatformSystem {
    static updatePlatforms(platforms: Platform[], deltaTime: number): Platform[] {
        return platforms.map(platform => {
            let newX = platform.x;

            // Handle individual platform movement
            if (platform.isMoving) {
                newX += platform.speed! * platform.direction! * deltaTime;
                
                // Change direction if reached bounds
                if (newX <= platform.startX! || newX >= platform.endX!) {
                    return {
                        ...platform,
                        x: newX <= platform.startX! ? platform.startX! : platform.endX!,
                        direction: platform.direction! * -1 as 1 | -1
                    };
                }
            }

            // Handle level scrolling
            if (platform.isScrolling) {
                newX += platform.scrollSpeed! * deltaTime;
            }

            return {
                ...platform,
                x: newX
            };
        }).filter(platform => platform.x + platform.width > -100); // Remove platforms that are off screen
    }

    static checkCollisions(x: number, y: number, velocityY: number, platforms: Platform[]): { 
        newY: number, 
        newVelocityY: number, 
        isJumping: boolean,
        platformSpeed?: number 
    } {
        if (velocityY <= 0) return { newY: y, newVelocityY: velocityY, isJumping: true };

        for (const platform of platforms) {
            const playerBottom = y + 25;
            const platformTop = platform.y;
            
            if (velocityY > 0 && 
                playerBottom >= platformTop && 
                playerBottom <= platformTop + 10 && 
                x + 25 > platform.x && 
                x - 25 < platform.x + platform.width) {
                return {
                    newY: platform.y - 25,
                    newVelocityY: 0,
                    isJumping: false,
                    platformSpeed: platform.isMoving ? platform.speed! * platform.direction! : 0
                };
            }
        }

        return { newY: y, newVelocityY: velocityY, isJumping: true };
    }
} 