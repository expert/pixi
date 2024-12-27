import { Container, Graphics } from '@pixi/react';
import { useCallback, useState, useEffect } from 'react';
import GameEngine from '../core/GameEngine';
import { useGameLoop } from '../../hooks/useGameLoop';
import { PlayerState, Platform } from './types';

interface GameXmasProps {   
    onBack: () => void;
}

const PLAYER_SPEED = 200;
const INITIAL_JUMP_VELOCITY = -400;
const MAX_JUMP_DURATION = 400; // milliseconds
const GRAVITY = 900;
const GROUND_Y = 500;

// Define some platforms
const PLATFORMS: Platform[] = [
    { x: 200, y: 400, width: 100 },
    { x: 400, y: 300, width: 100 },
    { x: 600, y: 200, width: 100 },
];

const GameXmas = ({ onBack }: GameXmasProps) => {
    const [player, setPlayer] = useState<PlayerState>({
        x: 400,
        y: GROUND_Y,
        velocityY: 0,
        isJumping: false,
        jumpStartTime: null
    });

    const [keys, setKeys] = useState<Set<string>>(new Set());

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys(prev => new Set(prev).add(e.key));
            
            // Start jump when space is pressed and player is on ground
            if (e.code === 'Space' && !player.isJumping) {
                setPlayer(prev => ({
                    ...prev,
                    velocityY: INITIAL_JUMP_VELOCITY,
                    isJumping: true,
                    jumpStartTime: Date.now()
                }));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys(prev => {
                const newKeys = new Set(prev);
                newKeys.delete(e.key);
                return newKeys;
            });

            // Cut jump short when space is released
            if (e.code === 'Space' && player.isJumping && player.velocityY < 0) {
                setPlayer(prev => ({
                    ...prev,
                    velocityY: prev.velocityY * 0.5
                }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [player.isJumping, player.velocityY]);

    // Check platform collisions
    const checkPlatformCollisions = (x: number, y: number, velocityY: number): { newY: number, newVelocityY: number, isJumping: boolean } => {
        if (velocityY <= 0) return { newY: y, newVelocityY: velocityY, isJumping: true };

        for (const platform of PLATFORMS) {
            const playerBottom = y + 25;
            const platformTop = platform.y;
            
            if (velocityY > 0 && // Moving down
                playerBottom >= platformTop && 
                playerBottom <= platformTop + 10 && // Small tolerance for collision
                x + 25 > platform.x && 
                x - 25 < platform.x + platform.width) {
                return {
                    newY: platform.y - 25,
                    newVelocityY: 0,
                    isJumping: false
                };
            }
        }

        return { newY: y, newVelocityY: velocityY, isJumping: true };
    };

    // Game update loop
    const updateGame = useCallback((deltaTime: number) => {
        setPlayer(prev => {
            // Horizontal movement
            const newX = prev.x + (
                (keys.has('ArrowRight') ? 1 : 0) - 
                (keys.has('ArrowLeft') ? 1 : 0)
            ) * PLAYER_SPEED * deltaTime;

            // Vertical movement with gravity
            let newY = prev.y;
            let newVelocityY = prev.velocityY;
            let isJumping = prev.isJumping;

            if (prev.isJumping) {
                // Apply variable jump height
                if (keys.has(' ') && prev.jumpStartTime && 
                    Date.now() - prev.jumpStartTime < MAX_JUMP_DURATION && 
                    prev.velocityY < 0) {
                    newVelocityY = INITIAL_JUMP_VELOCITY;
                } else {
                    newVelocityY += GRAVITY * deltaTime;
                }
                
                newY += newVelocityY * deltaTime;

                // Check platform collisions
                const collision = checkPlatformCollisions(newX, newY, newVelocityY);
                newY = collision.newY;
                newVelocityY = collision.newVelocityY;
                isJumping = collision.isJumping;

                // Ground collision
                if (newY >= GROUND_Y) {
                    newY = GROUND_Y;
                    newVelocityY = 0;
                    isJumping = false;
                }
            }

            // Keep player within bounds
            return {
                ...prev,
                x: Math.max(0, Math.min(800, newX)),
                y: newY,
                velocityY: newVelocityY,
                isJumping,
                jumpStartTime: isJumping ? prev.jumpStartTime : null
            };
        });
    }, [keys]);

    useGameLoop(updateGame);

    return (
        <GameEngine onBack={onBack}>
            <Container>
                <Graphics
                    draw={g => {
                        g.clear();
                        // Draw ground line
                        g.lineStyle(2, 0x00ff00);
                        g.moveTo(0, GROUND_Y + 25);
                        g.lineTo(800, GROUND_Y + 25);
                        
                        // Draw platforms
                        g.beginFill(0x00ff00);
                        PLATFORMS.forEach(platform => {
                            g.drawRect(platform.x, platform.y, platform.width, 10);
                        });
                        g.endFill();
                        
                        // Draw player
                        g.beginFill(0xff0000);
                        g.drawRect(player.x - 25, player.y - 25, 50, 50);
                        g.endFill();
                    }}
                />
            </Container>
        </GameEngine>
    );
};

export default GameXmas;