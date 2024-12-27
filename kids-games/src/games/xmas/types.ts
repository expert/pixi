export interface PlayerState {
    x: number;
    y: number;
    velocityY: number;
    isJumping: boolean;
    jumpStartTime: number | null;
}

export interface Platform {
    x: number;
    y: number;
    width: number;
} 