import { SwipeDirection } from "../core/controllers/SwipeController";

export interface AppSize {
    width: number;
    height: number;
}

export interface PlayerState {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    isJumping: boolean;
    jumpStartTime: number | null;
    currentJumpDirection: SwipeDirection;
    currentPlatform: Platform | null;
    isShooting?: boolean;
}

export interface Platform {
    x: number;
    y: number;
    width: number;
    isMoving?: boolean;
    startX?: number;
    endX?: number;
    speed?: number;
    direction?: 1 | -1;
    isScrolling?: boolean;
    scrollSpeed?: number;
}

export interface PlatformConfig {
    count: number;
    direction: 'horizontal' | 'vertical';
    scrollSpeed: number;
    levelWidth: number;
    startX?: number;
    platformSpecs: {
        minWidth: number;
        maxWidth: number;
        minGap: number;  // Minimum gap between platforms
        maxGap: number;  // Maximum gap between platforms
        minHeight: number;
        maxHeight: number;
    };
    snowballs: {
        frequency: number;  // How often snowballs appear (0-1)
        minSize: number;
        maxSize: number;
        minHeight: number;
        maxHeight: number;
    };
}

export interface GameState {
    score: number;
    timeElapsed: number;
    isLevelComplete: boolean;
    goalScore: number;
}

export interface LevelConfig extends PlatformConfig {
    goalScore: number;
    backgroundImage?: string;
}

export interface Projectile {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    active: boolean;
}

export interface Snowman {
    x: number;
    y: number;
    hit: boolean;
    createdAt: number;
    duration: number;
    velocityX: number;
    velocityY: number;
}

export interface Gift {
    x: number;
    y: number;
    collected: boolean;
    createdAt: number;
    velocityY?: number;
    isDelivering?: boolean;
}

export interface House {
    x: number;
    y: number;
    width: number;
    height: number;
    hasReceivedGift: boolean;
}

export interface Snowball {
    x: number;
    y: number;
    size: number;
    collected: boolean;
} 