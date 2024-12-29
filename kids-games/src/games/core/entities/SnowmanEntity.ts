import { Snowman } from "../../xmas/types";

export const createSnowman = (x: number, y: number): Snowman => ({
    x,
    y,
    hit: false,
    createdAt: performance.now(),
    duration: 8000,
    velocityX: -50,
    velocityY: 150
});

export const updateSnowmanPosition = (
    snowman: Snowman, 
    deltaTime: number
): Snowman => ({
    ...snowman,
    x: snowman.x + snowman.velocityX * deltaTime,
    y: snowman.y + snowman.velocityY * deltaTime
});

export const isSnowmanActive = (
    snowman: Snowman, 
    currentTime: number
): boolean => {
    const age = currentTime - snowman.createdAt;
    return age < snowman.duration && !snowman.hit && snowman.y < 800;
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