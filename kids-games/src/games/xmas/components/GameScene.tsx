import { Container, Graphics, Text } from '@pixi/react';
import { Platform, PlayerState, SwipeState, Snowball } from '../types';
import { GROUND_Y } from '../constants';

interface GameSceneProps {
    platforms: Platform[];
    player: PlayerState;
    swipeState: SwipeState;
    levelScroll: number;
    snowballs: Snowball[];
    score: number;
    timeElapsed: number;
    goalScore: number;
    isLevelComplete: boolean;
}

export const GameScene = ({ platforms, player, swipeState, levelScroll, snowballs, score, timeElapsed, goalScore, isLevelComplete }: GameSceneProps) => {
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

            {/* Snowballs container */}
            <Container x={levelScroll}>
                <Graphics
                    draw={g => {
                        g.clear();
                        snowballs.forEach(snowball => {
                            if (!snowball.collected) {
                                g.beginFill(0xFFFFFF);
                                g.drawCircle(snowball.x, snowball.y, snowball.size / 2);
                                g.endFill();
                            }
                        });
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

            {/* Game UI */}
            <Container>
                <Text 
                    text={`Score: ${score}/${goalScore}`}
                    x={700}
                    y={10}
                    style={{
                        fill: 0xFFFFFF,
                        fontSize: 20
                    }}
                />
                <Text 
                    text={`Time: ${Math.floor(timeElapsed)}s`}
                    x={700}
                    y={40}
                    style={{
                        fill: 0xFFFFFF,
                        fontSize: 20
                    }}
                />
                {isLevelComplete && (
                    <Text 
                        text="Level Complete!"
                        x={400}
                        y={300}
                        anchor={0.5}
                        style={{
                            fill: 0xFFFF00,
                            fontSize: 40
                        }}
                    />
                )}
            </Container>
        </Container>
    );
}; 