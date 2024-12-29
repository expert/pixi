import { Platform, PlatformConfig, AppSize } from "../../xmas/types";
import { PLAYER_HEIGHT } from "../../xmas/constants";
import { calculateAvailableHeight } from '../utils/heightCalculator';

const PATTERNS = {
    STAIR_UP: 'STAIR_UP',
    STAIR_DOWN: 'STAIR_DOWN',
    MAZE: 'MAZE',
    ZIGZAG: 'ZIGZAG',
    RANDOM: 'RANDOM'
} as const;

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
    y: Math.min(y, calculateAvailableHeight(size, 50)),
    width,
    ...config
});

export const generatePlatforms = (config: PlatformConfig, size: AppSize): Platform[] => {
    const platforms: Platform[] = [];
    let currentX = config.startX || 0;
    let currentY = calculateAvailableHeight(size, 100); // Start near bottom
    const pattern = config.pattern || PATTERNS.RANDOM;
    
    // Define safe zone from top of screen
    const TOP_MARGIN = 150; // Increased margin from top
    const BOTTOM_MARGIN = 100;
    const PLAYABLE_HEIGHT = calculateAvailableHeight(size, TOP_MARGIN);
    const BASE_HEIGHT = calculateAvailableHeight(size, BOTTOM_MARGIN);
    
    // Add wave control for STAIR_UP
    const WAVE_LENGTH = 10; // How many platforms before changing direction
    let isGoingUp = true;
    let stepCount = 0;

    for (let i = 0; i < config.count; i++) {
        const width = Math.random() * 
            (config.platformSpecs.maxWidth - config.platformSpecs.minWidth) + 
            config.platformSpecs.minWidth;

        // Calculate Y position based on pattern
        switch (pattern) {
            case PATTERNS.STAIR_UP:
                stepCount++;
                if (stepCount >= WAVE_LENGTH) {
                    isGoingUp = !isGoingUp;
                    stepCount = 0;
                }

                if (isGoingUp) {
                    currentY = Math.max(
                        TOP_MARGIN + PLAYER_HEIGHT + 50,
                        currentY - 60
                    );
                } else {
                    currentY = Math.min(
                        BASE_HEIGHT,
                        currentY + 60
                    );
                }
                break;
            case PATTERNS.STAIR_DOWN:
                currentY = Math.min(currentY + 60, BASE_HEIGHT);
                break;
            case PATTERNS.MAZE:
                if (i % 2 === 0) {
                    currentY = BASE_HEIGHT - (Math.random() * 200);
                } else {
                    currentY = TOP_MARGIN + PLAYER_HEIGHT + 100 + 
                        (Math.random() * (PLAYABLE_HEIGHT * 0.4));
                }
                break;
            case PATTERNS.ZIGZAG:
                const amplitude = (PLAYABLE_HEIGHT - TOP_MARGIN) * 0.3;
                const midPoint = calculateAvailableHeight(size, PLAYABLE_HEIGHT / 2);
                currentY = midPoint + Math.sin(i * 0.5) * amplitude;
                break;
            case PATTERNS.RANDOM:
            default:
                currentY = TOP_MARGIN + PLAYER_HEIGHT + 
                    Math.random() * (PLAYABLE_HEIGHT - TOP_MARGIN - 100);
        }

        const isMoving = Math.random() > 0.7;
        
        const platform = createPlatform(
            currentX,
            currentY,
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
        
        // Adjust horizontal gap based on pattern
        const gap = pattern === PATTERNS.MAZE ? 
            config.platformSpecs.minGap : 
            Math.random() * 
                (config.platformSpecs.maxGap - config.platformSpecs.minGap) + 
                config.platformSpecs.minGap;
        
        currentX += width + gap;
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