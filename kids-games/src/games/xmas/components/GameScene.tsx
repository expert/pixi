import { Container, Graphics } from '@pixi/react';
import { Platform, PlayerState, SwipeState } from '../types';
import { GROUND_Y } from '../constants';

interface GameSceneProps {
    platforms: Platform[];
    player: PlayerState;
    swipeState: SwipeState;
}

export const GameScene = ({ platforms, player, swipeState }: GameSceneProps) => {
    return (
        <Container>
            <Graphics
                draw={g => {
                    g.clear();
                    // Draw ground line
                    g.lineStyle(2, 0x00ff00);
                    g.moveTo(0, GROUND_Y + 25);
                    g.lineTo(800, GROUND_Y + 25);
                    
                    // Draw platforms
                    g.beginFill(0x00ffff);
                    platforms.forEach(platform => {
                        g.drawRect(platform.x, platform.y, platform.width, 10);
                    });
                    g.endFill();
                    
                    // Draw player
                    g.beginFill(0xff0000);
                    g.drawRect(player.x - 25, player.y - 25, 50, 50);
                    g.endFill();

                    // Draw swipe indicator when active
                    if (swipeState.isActive && swipeState.startPoint) {
                        g.lineStyle(2, 0xFFFFFF, 0.5);
                        g.moveTo(swipeState.startPoint.x, swipeState.startPoint.y);
                        if (swipeState.endPoint) {
                            g.lineTo(swipeState.endPoint.x, swipeState.endPoint.y);
                        }
                    }
                }}
            />
        </Container>
    );
}; 