import { Platform, PlatformConfig, AppSize } from "../../xmas/types";
import { PLAYER_HEIGHT } from "../../xmas/constants";

export const createPlatform = (
    x: number,
    y: number,
    width: number,
    size: AppSize,
    config?: {
        isMoving?: boolean;
        startX?: number;
        endX?: number;
        speed?: number;
        direction?: 1 | -1;
    }
): Platform => ({
    x,
    y: Math.min(y, size.height - PLAYER_HEIGHT - 50),
    width,
    ...config
});

export const generatePlatforms = (config: PlatformConfig, size: AppSize): Platform[] => {
    const platforms: Platform[] = [];
    let currentX = config.startX || 0;

    for (let i = 0; i < config.count; i++) {
        const width = Math.random() * 
            (config.platformSpecs.maxWidth - config.platformSpecs.minWidth) + 
            config.platformSpecs.minWidth;

        const y = Math.random() * 
            (size.height - config.platformSpecs.minHeight - PLAYER_HEIGHT) + 
            config.platformSpecs.minHeight;

        const isMoving = Math.random() > 0.7;
        
        const platform = createPlatform(
            currentX,
            y,
            width,
            size,
            isMoving ? {
                isMoving: true,
                startX: currentX,
                endX: currentX + 200,
                speed: 100,
                direction: 1
            } : undefined
        );

        platforms.push(platform);
        
        currentX += width + 
            Math.random() * 
            (config.platformSpecs.maxGap - config.platformSpecs.minGap) + 
            config.platformSpecs.minGap;
    }

    return platforms;
};

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

export const regeneratePlatforms = (
    platforms: Platform[] = [],
    levelScroll: number,
    config: PlatformConfig,
    size: AppSize
): Platform[] => {
    const visiblePlatforms = platforms.filter(p => 
        p.x + p.width + levelScroll > -size.width
    );

    const lastPlatform = platforms[platforms.length - 1];
    if (lastPlatform.x + lastPlatform.width + levelScroll >= size.width * 2) {
        return visiblePlatforms;
    }

    const lastVisiblePlatform = visiblePlatforms[visiblePlatforms.length - 1];
    const newStartX = lastVisiblePlatform.x + lastVisiblePlatform.width + 
        config.platformSpecs.minGap;

    const newPlatforms = generatePlatforms({
        ...config,
        levelWidth: newStartX + 2000,
        startX: newStartX
    }, size);

    return visiblePlatforms.concat(newPlatforms);
}; 