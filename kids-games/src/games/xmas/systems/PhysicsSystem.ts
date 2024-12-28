import { PlayerState, Platform } from '../types';
import { GRAVITY, GROUND_Y, INITIAL_JUMP_VELOCITY, MAX_JUMP_DURATION } from '../constants';

export class PhysicsSystem {
    static startJump(player: PlayerState): PlayerState {
        if (!player.isJumping) {
            return {
                ...player,
                velocityY: INITIAL_JUMP_VELOCITY,
                isJumping: true,
                jumpStartTime: Date.now()
            };
        }
        return player;
    }

    static updatePlayerPhysics(
        player: PlayerState,
        platforms: Platform[],
        keys: Set<string>,
        deltaTime: number
    ): PlayerState {
        let newVelocityY = player.velocityY;
        let isJumping = player.isJumping;
        // console.log(keys, isJumping);
        // Apply gravity
        newVelocityY += GRAVITY * deltaTime;
        console.log(newVelocityY, player.velocityY, isJumping, player.jumpStartTime, Date.now() - player.jumpStartTime, keys.has(' '));
        // Variable jump height
        if (isJumping && keys.has(' ') && 
            player.jumpStartTime && 
            Date.now() - player.jumpStartTime < MAX_JUMP_DURATION && 
            player.velocityY < 0) {
            newVelocityY = INITIAL_JUMP_VELOCITY;
              console.log('jump', newVelocityY, player.velocityY);
        }

        // Update position
        let newY = player.y + newVelocityY * deltaTime;

        // Check ground collision
        if (newY >= GROUND_Y) {
            newY = GROUND_Y;
            newVelocityY = 0;
            isJumping = false;
        }

        return {
            ...player,
            y: newY,
            velocityY: newVelocityY,
            isJumping,
            jumpStartTime: isJumping ? player.jumpStartTime : null
        };
    }

    static checkPlatformCollision(
        x: number,
        y: number,
        velocityY: number,
        platforms: Platform[]
    ): { 
        newY: number;
        newVelocityY: number;
        isJumping: boolean;
        platformSpeed: number | null;
        currentPlatform: Platform | null;
    } {
        for (const platform of platforms) {
            const playerBottom = y + 25;
            const platformTop = platform.y;
            
            if (playerBottom >= platformTop && 
                playerBottom <= platformTop + 10 && 
                x + 25 > platform.x && 
                x - 25 < platform.x + platform.width) {
                return {
                    newY: platform.y - 25,
                    newVelocityY: 0,
                    isJumping: false,
                    platformSpeed: platform.isMoving ? platform.speed! * platform.direction! : 0,
                    currentPlatform: platform
                };
            }
        }

        return { 
            newY: y, 
            newVelocityY: velocityY, 
            isJumping: true, 
            platformSpeed: null,
            currentPlatform: null 
        };
    }
}