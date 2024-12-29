import { Container, Graphics, Sprite, Text } from '@pixi/react';
import { Platform, PlayerState, Snowball, House, AppSize, LevelConfig } from '../types';
import { Level1Scene } from './levels/Level1Scene';
import { Level2Scene } from './levels/Level2Scene';
import { Level3Scene } from './levels/Level3Scene';
import { Level4Scene } from './levels/Level4Scene';
import { CommonUI } from './CommonUI';
import { Platforms } from './Platforms';
import { Player } from './Player';
import { SwipeState } from '../../core/controllers/SwipeController';
import { WinConfetti } from './WinConfetti';

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
    currentLevelConfig: LevelConfig;
    projectiles: any[];
    snowmen: any[];
    gifts: any[];
    houses?: House[];
    size: AppSize;
}

export const GameScene = ({ platforms, player, swipeState, levelScroll, snowballs, score, timeElapsed, goalScore, isLevelComplete, onNextLevel, currentLevel, currentLevelConfig, projectiles, snowmen, gifts, houses, size }: GameSceneProps) => {
    return (
        <Container>
            {/* Common elements */}
            <Sprite image={currentLevelConfig?.backgroundImage || "/images/Christmas Santa Claus Icon.png"}
                x={0}
                y={0}
                anchor={0.0}
                width={size.width}  
                height={size.height} 
                alpha={0.5}
            /> 
            <Platforms platforms={platforms} levelScroll={levelScroll} />
            <Player player={player} />
            <CommonUI 
                score={score}
                timeElapsed={timeElapsed}
                goalScore={goalScore}
                isLevelComplete={isLevelComplete}
                size={size}
            />

            {/* Win UI */}
            {isLevelComplete && (
                <Container>
                    <Graphics
                        draw={g => {
                            g.clear();
                            g.beginFill(0x000000, 0.7);
                            g.drawRect(0, 0, size.width, size.height);
                            g.endFill();
                        }}
                    />
                    <WinConfetti size={size} />
                    <Text 
                        text="Bravo Stefan!"
                        anchor={0.5}
                        x={size.width / 2}
                        y={size.height / 2 - 50}
                        //@ts-ignore
                        style={{ 
                            fill: 0xFFFFFF,
                            fontSize: 48,
                            fontWeight: 'bold'
                        }}
                    />
                    <Text 
                        text="Mai multe aventuri!"
                        anchor={0.5}
                        x={size.width / 2}
                        y={size.height / 2 + 50}
                        //@ts-ignore
                        style={{ 
                            fill: 0xFFFFFF,
                            fontSize: 24
                        }}
                        interactive={true}
                        buttonMode={true}
                        pointerdown={onNextLevel}
                    />
                </Container>
            )}

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

            {/* Level-specific scenes */}
            {currentLevel === 'LEVEL_1' && (
                <Level1Scene snowballs={snowballs} levelScroll={levelScroll} size={size} />
            )}
            {currentLevel === 'LEVEL_2' && (
                <Level2Scene projectiles={projectiles} snowmen={snowmen} size={size}/>
            )}
            {currentLevel === 'LEVEL_3' && (
                <Level3Scene gifts={gifts} size={size}/>
            )}
            {currentLevel === 'LEVEL_4' && (
                //@ts-expect-error Fix this
                <Level4Scene gifts={gifts} houses={houses} size={size}  />
            )}
        </Container>
    );
}; 