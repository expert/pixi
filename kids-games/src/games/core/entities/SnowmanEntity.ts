import { AppSize, Snowman } from "../../xmas/types";

export const createSnowman = (x: number, y: number): Snowman => ({
    x,
    y,
    hit: false,
    createdAt: performance.now(),
    duration: 10000,
    velocityX: Math.random() * 6 - 3,
    velocityY: 50
});

export const updateSnowmanPosition = (
    snowman: Snowman,  
    deltaTime: number
): Snowman => {
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    const newX = Math.max(20, Math.min(410, snowman.x + snowman.velocityX * clampedDelta));
    const newY = snowman.y + snowman.velocityY * clampedDelta;
    
    return {
        ...snowman,
        x: newX,
        y: newY
    };
};

export const isSnowmanActive = (
    snowman: Snowman, 
    currentTime: number,
    size: AppSize
): boolean => {
    const isWithinBounds = !snowman.hit && 
                          snowman.y < size.height + 50 &&
                          snowman.x >= -50 &&  
                          snowman.x <= size.width + 50;
                          
    const isWithinDuration = (currentTime - snowman.createdAt) < snowman.duration;
    
    return isWithinBounds && isWithinDuration;
};

export const checkProjectileHit = (
    snowman: Snowman,
    projectileX: number,
    projectileY: number,
    hitRadius: number = 30
): boolean => {
    if (snowman.hit) return false;
    
    const distance = Math.sqrt(
        Math.pow(projectileX - snowman.x, 2) + 
        Math.pow(projectileY - snowman.y, 2)
    );
    return distance < hitRadius;
}; 