import { PLAYER_HEIGHT } from "../../xmas/constants";
import { SwipeDirection, SwipeState } from "../controllers/SwipeController";
import { AppSize, Platform } from "../../xmas/types";
import { PhysicsSystem } from "../systems/PhysicsSystem";

export interface Player {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    isJumping: boolean;
    jumpStartTime: number | null;
    currentJumpDirection: SwipeDirection;
    currentPlatform: Platform | null;
}

export const createPlayer = (size: AppSize): Player => ({
    x: size.width / 2,
    y: size.height - 25,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    jumpStartTime: null,
    currentJumpDirection: 'NONE',
    currentPlatform: null
});

export const handleFlyPlayer = (player: Player, newSwipeState: SwipeState, size: AppSize): Player => {
    if (!newSwipeState.isActive || !newSwipeState.endPoint) {  
        return player;
    }
    const dx = newSwipeState.endPoint.x - newSwipeState.startPoint!.x;
    const dy = newSwipeState.endPoint.y - newSwipeState.startPoint!.y;
    const magnitude = Math.min(newSwipeState.magnitude * 2, size.width - 50);
    const angle = Math.atan2(dy, dx);
    
    return {
        ...player,
        velocityX: magnitude * Math.cos(angle),
        velocityY: magnitude * Math.sin(angle),
        isJumping: true
    };
};

export const updateFlyPlayer = (player: Player, deltaTime: number, size: AppSize): Player => {
    const _player = {
        ...player,
        x: player.x + player.velocityX * deltaTime,
        y: player.y + player.velocityY * deltaTime,
        velocityX: player.velocityX * 0.98,
        velocityY: player.velocityY * 0.98
    }

    const boundedPlayer = {
        ..._player,
        x: Math.max(25, Math.min(_player.x, size.width - 25)),
        y: Math.max(25, Math.min(_player.y, size.height - PLAYER_HEIGHT - 25))
    }
    return boundedPlayer;
}

export const handleJumpPlayer = (player: Player, newSwipeState: SwipeState, size: AppSize): Player => {
    if (newSwipeState.isActive && 
        newSwipeState.direction !== 'NONE' && 
        newSwipeState.endPoint && 
        !player.isJumping) {


        return PhysicsSystem.startDirectionalJump(
            player,
            newSwipeState.direction,
            newSwipeState.magnitude,
            size
        );
    }
    return player;
};