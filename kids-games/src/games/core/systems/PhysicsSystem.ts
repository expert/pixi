import { PlayerState, Platform } from '../../xmas/types';
import { GRAVITY, GROUND_Y, INITIAL_JUMP_VELOCITY, MAX_JUMP_DURATION } from '../../xmas/constants';
import { InputState } from './ControllerSystem';

export class PhysicsSystem {
    static startJump(player: PlayerState): PlayerState {
        console.log('startJump', player);
        if (!player.isJumping) {
            return {
                ...player,
                velocityY: INITIAL_JUMP_VELOCITY,
                isJumping: true,
                jumpStartTime: performance.now()
            };
        }
        return player;
    }

    static updatePlayerPhysics(
        player: PlayerState,
        platforms: Platform[],
        inputState: InputState,
        deltaTime: number
    ): PlayerState {
        let newVelocityY = player.velocityY;
        let isJumping = player.isJumping;

        // Apply gravity
        newVelocityY += GRAVITY * deltaTime;

        // Variable jump height - hold jump for higher jumps
        if (isJumping && inputState.jumpPressed && 
            player.jumpStartTime && 
            performance.now() - player.jumpStartTime < MAX_JUMP_DURATION) {
            newVelocityY = INITIAL_JUMP_VELOCITY;
        }
        // console.log(`isJumping: ${isJumping} - jumpPressed: ${inputState.jumpPressed} - jumpStartTime: ${player.jumpStartTime} - jumpDuration: ${Date.now() - player.jumpStartTime < MAX_JUMP_DURATION}`);
        // Cut jump short when button is released
        if (!inputState.jumpPressed && newVelocityY < 0) {
            newVelocityY *= 0.5;
        }

        // Update position
        let newY = player.y + newVelocityY * deltaTime;

        // Check ground collision
        if (newY >= GROUND_Y) {
            newY = GROUND_Y;
            newVelocityY = 0;
            isJumping = false;
        }

        // Check platform collisions
        const collision = PhysicsSystem.checkPlatformCollision(
            player.x,
            newY,
            newVelocityY,
            platforms
        );

        return {
            ...player,
            y: collision.newY,
            velocityY: collision.newVelocityY,
            isJumping: collision.isJumping,
            jumpStartTime: collision.isJumping ? player.jumpStartTime : null
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