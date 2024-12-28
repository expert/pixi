import { Container, Graphics, Text } from '@pixi/react';
import { Platform, PlayerState, SwipeState, Snowball, House } from '../types';
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
    onNextLevel: () => void;
    currentLevel: string;
    projectiles: any[];
    snowmen: any[];
    gifts: any[];
    houses?: House[];
    width: number;
    height: number;
}

export const GameScene = ({ platforms, player, swipeState, levelScroll, snowballs, score, timeElapsed, goalScore, isLevelComplete, onNextLevel, currentLevel, projectiles, snowmen, gifts, houses, width, height }: GameSceneProps) => {
    return (
        <Container>
            {/* Static ground line */}
            <Graphics
                draw={g => {
                    g.clear();
                    g.lineStyle(2, 0x00ff00);
                    g.moveTo(0, GROUND_Y + 25);
                    g.lineTo(width, GROUND_Y + 25);
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
                    x={width - 100}
                    y={10}
                    style={{
                        fill: 0xFFFFFF,
                        fontSize: 20
                    }}
                />
                <Text 
                    text={`Time: ${Math.floor(timeElapsed)}s`}
                    x={width - 100}
                    y={40}
                    style={{
                        fill: 0xFFFFFF,
                        fontSize: 20
                    }}
                />
                {isLevelComplete && (
                    <Container>
                        <Text 
                            text="Level Complete!"
                            x={400}
                            y={250}
                            anchor={0.5}
                            style={{
                                fill: 0xFFFF00,
                                fontSize: 40
                            }}
                        />
                        {currentLevel !== 'LEVEL_3' && (
                            <Container 
                                x={350}
                                y={350}
                                interactive={true}
                                cursor="pointer"
                                onclick={onNextLevel}
                            >
                                <Graphics
                                    draw={g => {
                                        g.clear();
                                        g.beginFill(0x44FF44, 0.5);
                                        g.drawRoundedRect(0, 0, 100, 40, 10);
                                        g.endFill();
                                    }}
                                />
                                <Text 
                                    text="Next Level"
                                    x={50}
                                    y={20}
                                    anchor={0.5}
                                    style={{
                                        fill: 0xFFFFFF,
                                        fontSize: 20
                                    }}
                                />
                            </Container>
                        )}
                    </Container>
                )}
            </Container>

            {currentLevel === 'LEVEL_2' && (
                <>
                    {/* Render projectiles */}
                    <Graphics
                        draw={g => {
                            g.clear();
                            g.beginFill(0xFFFFFF);
                            projectiles.forEach(p => {
                                g.drawCircle(p.x, p.y, 10);
                            });
                            g.endFill();
                        }}
                    />
                    
                    {/* Render snowmen */}
                    <Graphics
                        draw={g => {
                            g.clear();
                            g.beginFill(0xFFFFFF);
                            snowmen.forEach(s => {
                                if (!s.hit) {
                                    // Simple snowman shape
                                    g.drawCircle(s.x, s.y, 20);
                                    g.drawCircle(s.x, s.y - 30, 15);
                                }
                            });
                            g.endFill();
                        }}
                    />
                </>
            )}

            {currentLevel === 'LEVEL_3' && (
                <Graphics
                    draw={g => {
                        g.clear();
                        g.beginFill(0xFF0000); // Red color for gifts
                        gifts.forEach(gift => {
                            if (!gift.collected) {
                                // Draw a simple gift box
                                g.drawRect(gift.x - 15, gift.y - 15, 30, 30);
                                // Draw ribbon
                                g.lineStyle(3, 0xFFFF00);
                                g.moveTo(gift.x - 15, gift.y);
                                g.lineTo(gift.x + 15, gift.y);
                                g.moveTo(gift.x, gift.y - 15);
                                g.lineTo(gift.x, gift.y + 15);
                            }
                        });
                        g.endFill();
                    }}
                />
            )}

            {currentLevel === 'LEVEL_4' && houses && (
                <>
                    {/* Houses */}
                    <Graphics
                        draw={g => {
                            g.clear();
                            houses.forEach(house => {
                                // Draw house body
                                g.beginFill(0x8B4513);
                                g.drawRect(house.x, house.y, house.width, house.height);
                                
                                // Draw roof
                                g.beginFill(0x800000);
                                g.moveTo(house.x - 10, house.y);
                                g.lineTo(house.x + house.width + 10, house.y);
                                g.lineTo(house.x + house.width/2, house.y - 40);
                                g.lineTo(house.x - 10, house.y);
                                
                                // Draw door
                                g.beginFill(0x4A3B24);
                                g.drawRect(house.x + house.width/2 - 15, 
                                         house.y + house.height - 40, 
                                         30, 40);
                                
                                // Draw window
                                g.beginFill(house.hasReceivedGift ? 0xFFFF00 : 0x87CEEB);
                                g.drawRect(house.x + 20, house.y + 20, 25, 25);
                                g.drawRect(house.x + house.width - 45, house.y + 20, 25, 25);
                            });
                            g.endFill();
                        }}
                    />

                    {/* Falling Gifts */}
                    <Graphics
                        draw={g => {
                            g.clear();
                            gifts.forEach(gift => {
                                if (!gift.collected && gift.isDelivering) {
                                    // Draw gift box
                                    g.beginFill(0xFF0000);
                                    g.drawRect(gift.x - 15, gift.y - 15, 30, 30);
                                    
                                    // Draw ribbon
                                    g.lineStyle(3, 0xFFFF00);
                                    g.moveTo(gift.x - 15, gift.y);
                                    g.lineTo(gift.x + 15, gift.y);
                                    g.moveTo(gift.x, gift.y - 15);
                                    g.lineTo(gift.x, gift.y + 15);
                                }
                            });
                            g.endFill();
                        }}
                    />
                </>
            )}
        </Container>
    );
}; 