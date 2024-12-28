import { PlayerState, Platform, AppSize } from '../../xmas/types';
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
        deltaTime: number,
        levelScroll: number,
        size: AppSize
    ): PlayerState {
        let newState = { ...player };
        const jumpConfig = JUMP_CONFIGS[player.currentJumpDirection];

        // If player is on a platform, move with it unless jumping
        if (player.currentPlatform && !player.isJumping) {
            // Find the current platform state
            const updatedPlatform = platforms.find(p => 
                p.y === player.currentPlatform!.y && 
                Math.abs((p.x + levelScroll) - (player.currentPlatform!.x + levelScroll)) < 5 && 
                p.width === player.currentPlatform!.width
            );
            
            if (updatedPlatform) {
                // Calculate platform movement
                let platformDeltaX = 0;
                if (updatedPlatform.isMoving) {
                    platformDeltaX = updatedPlatform.speed! * updatedPlatform.direction! * deltaTime;
                }

                // Apply strong friction when on platform
                newState.velocityX *= Math.max(0, 1 - 10 * deltaTime); // Increased friction

                // Calculate new position with reduced sliding
                const relativeX = player.x - (updatedPlatform.x + levelScroll);
                newState = {
                    ...newState,
                    x: updatedPlatform.x + levelScroll + relativeX + platformDeltaX,
                    y: updatedPlatform.y - 25,
                    velocityY: 0,
                    currentPlatform: updatedPlatform
                };

                // Keep player within platform bounds
                const minX = updatedPlatform.x + levelScroll + 25;
                const maxX = updatedPlatform.x + levelScroll + updatedPlatform.width - 25;
                newState.x = Math.max(minX, Math.min(maxX, newState.x));

                return newState;
            }
        }

        // Apply gravity
        newState.velocityY += GRAVITY * deltaTime;

        // Apply air resistance to horizontal movement
        if (player.isJumping) {
            newState.velocityX *= (1 - jumpConfig.airResistance * deltaTime);
        }

        // Update position
        newState.x += newState.velocityX * deltaTime;
        newState.y += newState.velocityY * deltaTime;

        // Keep player within screen bounds
        newState.x = Math.max(25, Math.min(size.width - 25, newState.x));

        // Check ground collision
        if (newState.y >= size.height - 25) {
            newState = {
                ...newState,
                y: size.height - 25,
                velocityY: 0,
                velocityX: 0,
                isJumping: false,
                currentJumpDirection: 'NONE',
                currentPlatform: null
            };
            return newState;
        }

        // Check platform collisions
        const collision = this.checkPlatformCollision(
            newState.x,
            newState.y,
            newState.velocityY,
            platforms,
            levelScroll,
            size
        );

        // Apply collision results
        newState = {
            ...newState,
            y: collision.newY,
            velocityY: collision.newVelocityY,
            isJumping: collision.isJumping,
            currentPlatform: collision.currentPlatform,
            // Only reset jump state if we've landed
            jumpStartTime: collision.isJumping ? newState.jumpStartTime : null,
            currentJumpDirection: collision.isJumping ? newState.currentJumpDirection : 'NONE'
        };

        return newState;
    }

    static checkPlatformCollision(
        x: number,
        y: number,
        velocityY: number,
        platforms: Platform[],
        levelScroll: number,
        size: AppSize
    ): { 
        newY: number;
        newVelocityY: number;
        isJumping: boolean;
        platformSpeed: number | null;
        currentPlatform: Platform | null;
    } {
        // First check ground collision
        if (y >= size.height - 25) {
            return {
                newY: size.height - 25,
                newVelocityY: 0,
                isJumping: false,
                platformSpeed: 0,
                currentPlatform: null
            };
        }

        // Then check platform collisions with scroll offset
        for (const platform of platforms) {
            const playerBottom = y + 25;
            const platformTop = platform.y;
            const platformX = platform.x + levelScroll;
            
            if (velocityY >= 0 && 
                playerBottom >= platformTop && 
                playerBottom <= platformTop + 10 && 
                x + 25 > platformX && 
                x - 25 < platformX + platform.width) {

                // Calculate relative position on platform at collision
                const relativeX = x - platformX;
                
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

    static startDirectionalJump(
        player: PlayerState,
        direction: SwipeDirection,
        magnitude: number,
        size: AppSize
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
            currentJumpDirection: direction,
            currentPlatform: null
        };
    }

    static updateJumpPhysics(
        player: PlayerState,
        deltaTime: number,
        size: AppSize
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