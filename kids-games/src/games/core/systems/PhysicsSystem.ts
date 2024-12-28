import { PlayerState, Platform } from '../../xmas/types';
import { GRAVITY, GROUND_Y, INITIAL_JUMP_VELOCITY, MAX_JUMP_DURATION } from '../../xmas/constants';
import { InputState } from './ControllerSystem';
import { SwipeDirection } from '../controllers/SwipeController';
import { JUMP_CONFIGS } from '../../xmas/constants';

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
        let newState = { ...player };
        const jumpConfig = JUMP_CONFIGS[player.currentJumpDirection];

        // Apply gravity
        newState.velocityY += GRAVITY * deltaTime;

        // Apply air resistance to horizontal movement
        if (player.isJumping) {
            newState.velocityX *= (1 - jumpConfig.airResistance * deltaTime);
        }

        // Update position
        newState.x += newState.velocityX * deltaTime;
        newState.y += newState.velocityY * deltaTime;

        // Keep player within bounds
        newState.x = Math.max(25, Math.min(775, newState.x));

        // Check ground collision
        if (newState.y >= GROUND_Y - 25) {
            newState = {
                ...newState,
                y: GROUND_Y - 25,
                velocityY: 0,
                velocityX: 0,
                isJumping: false,
                currentJumpDirection: 'NONE'
            };
        }

        // Check platform collisions
        const collision = PhysicsSystem.checkPlatformCollision(
            newState.x,
            newState.y,
            newState.velocityY,
            platforms
        );

        // Apply collision results
        newState = {
            ...newState,
            y: collision.newY,
            velocityY: collision.newVelocityY,
            isJumping: collision.isJumping,
            // Only reset jump state if we've landed
            jumpStartTime: collision.isJumping ? newState.jumpStartTime : null,
            currentJumpDirection: collision.isJumping ? newState.currentJumpDirection : 'NONE'
        };

        // Apply platform movement if landed on a moving platform
        if (!collision.isJumping && collision.platformSpeed !== null) {
            newState.x += collision.platformSpeed * deltaTime;
        }

        return newState;
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
    } {
        // First check ground collision
        if (y >= GROUND_Y - 25) {
            return {
                newY: GROUND_Y - 25,
                newVelocityY: 0,
                isJumping: false,
                platformSpeed: 0
            };
        }

        // Then check platform collisions
        for (const platform of platforms) {
            const playerBottom = y + 25;
            const platformTop = platform.y;
            
            if (velocityY > 0 && 
                playerBottom >= platformTop && 
                playerBottom <= platformTop + 10 && 
                x + 25 > platform.x && 
                x - 25 < platform.x + platform.width) {
                return {
                    newY: platform.y - 25,
                    newVelocityY: 0,
                    isJumping: false,
                    platformSpeed: platform.isMoving ? platform.speed! * platform.direction! : 0
                };
            }
        }

        return { 
            newY: y, 
            newVelocityY: velocityY, 
            isJumping: true, 
            platformSpeed: null 
        };
    }

    static startDirectionalJump(
        player: PlayerState,
        direction: SwipeDirection,
        magnitude: number
    ): PlayerState {
        if (player.isJumping) return player;
        
        const jumpConfig = JUMP_CONFIGS[direction];
        const normalizedMagnitude = Math.min(magnitude / 100, 1);
        
        return {
            ...player,
            velocityX: jumpConfig.horizontalVelocity * normalizedMagnitude,
            velocityY: jumpConfig.verticalVelocity * normalizedMagnitude,
            isJumping: true,
            jumpStartTime: performance.now(),
            currentJumpDirection: direction
        };
    }

    static updateJumpPhysics(
        player: PlayerState,
        deltaTime: number
    ): PlayerState {
        if (!player.isJumping && player.y >= GROUND_Y - 25) {
            return {
                ...player,
                y: GROUND_Y - 25,
                velocityY: 0,
                velocityX: 0
            };
        }

        const jumpConfig = JUMP_CONFIGS[player.currentJumpDirection];
        
        // Apply gravity and air resistance
        const newVelocityY = player.velocityY + jumpConfig.gravity * deltaTime;
        const newVelocityX = player.velocityX * (1 - jumpConfig.airResistance * deltaTime);
        
        return {
            ...player,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            x: player.x + newVelocityX * deltaTime,
            y: player.y + newVelocityY * deltaTime
        };
    }
}