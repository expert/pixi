import { Container, Graphics } from '@pixi/react';
import { Platform, PlayerState, SwipeState } from '../types';
import { GROUND_Y } from '../constants';

interface GameSceneProps {
    platforms: Platform[];
    player: PlayerState;
    swipeState: SwipeState;
    levelScroll: number;
}

export const GameScene = ({ platforms, player, swipeState, levelScroll }: GameSceneProps) => {
    return (
        <Container>
            {/* Static ground line */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.lineStyle(2, 0x00ff00);
                    g.moveTo(0, GROUND_Y + 25);
                    g.lineTo(800, GROUND_Y + 25);
                }}
            />

            {/* Scrolling platform container */}
            <Container x={levelScroll}>
                <Graphics
                    draw={g => {
                        g.clear();
                        g.beginFill(0x00ffff);
                        platforms.forEach(platform => {
                            g.drawRect(platform.x, platform.y, platform.width, 10);
                        });
                        g.endFill();
                    }}
                />
            </Container>

            {/* Player stays in main container */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.beginFill(0xff0000);
                    g.drawRect(player.x - 25, player.y - 25, 50, 50);
                    g.endFill();
                }}
            />

            {/* Swipe indicator */}
            {swipeState.isActive && swipeState.startPoint && (
                <Graphics
                    draw={g => {
                        g.clear();
                        g.lineStyle(2, 0xFFFFFF, 0.5);
                        g.moveTo(swipeState.startPoint.x, swipeState.startPoint.y);
                        if (swipeState.endPoint) {
                            g.lineTo(swipeState.endPoint.x, swipeState.endPoint.y);
                        }
                    }}
                />
            )}
        </Container>
    );
}; 