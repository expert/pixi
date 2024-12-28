import { Platform } from "../../xmas/types";

export const updatePlatform = (
    platform: Platform, 
    deltaTime: number
): Platform => {
    if (!platform.isMoving) return platform;

    const newX = platform.x + platform.speed! * platform.direction! * deltaTime;
    
    if (newX <= platform.startX! || newX >= platform.endX!) {
        return {
            ...platform,
            x: newX <= platform.startX! ? platform.startX! : platform.endX!,
            direction: platform.direction! * -1 as 1 | -1
        };
    }

    return {
        ...platform,
        x: newX
    };
};

export const updatePlatforms = (
    platforms: Platform[], 
    deltaTime: number, 
    scrollSpeed: number
): Platform[] => {
    return platforms.map(platform => {
        const updatedPlatform = updatePlatform(platform, deltaTime);
        return {
            ...updatedPlatform,
            x: updatedPlatform.x + scrollSpeed * deltaTime
        };
    });
}; 