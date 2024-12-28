import { SwipeDirection } from "../core/controllers/SwipeController";

export interface PlayerState {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    isJumping: boolean;
    jumpStartTime: number | null;
    currentJumpDirection: SwipeDirection;
    currentPlatform: Platform | null;
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
}

export interface PlatformConfig {
    count: number;
    direction: 'horizontal' | 'vertical';
    spacing: {
        min: number;
        max: number;
    };
    height: {
        min: number;
        max: number;
    };
    width: {
        min: number;
        max: number;
    };
    speed: {
        min: number;
        max: number;
    };
    moveDistance: {
        min: number;
        max: number;
    };
} 