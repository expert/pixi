import { Container, Graphics } from '@pixi/react';
import { Platform, PlayerState, SwipeState, Snowball, House } from '../types';
import { Level1Scene } from './levels/Level1Scene';
import { Level2Scene } from './levels/Level2Scene';
import { Level3Scene } from './levels/Level3Scene';
import { Level4Scene } from './levels/Level4Scene';
import { CommonUI } from './CommonUI';
import { Platforms } from './Platforms';
import { Player } from './Player';

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
            {/* Common elements */}
            <Platforms platforms={platforms} levelScroll={levelScroll} />
            <Player player={player} />
            <CommonUI 
                score={score}
                timeElapsed={timeElapsed}
                goalScore={goalScore}
                isLevelComplete={isLevelComplete}
                width={width}
                height={height}
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

            {/* Level-specific scenes */}
            {currentLevel === 'LEVEL_1' && (
                <Level1Scene snowballs={snowballs} levelScroll={levelScroll} />
            )}
            {currentLevel === 'LEVEL_2' && (
                <Level2Scene projectiles={projectiles} snowmen={snowmen} />
            )}
            {currentLevel === 'LEVEL_3' && (
                <Level3Scene gifts={gifts} />
            )}
            {currentLevel === 'LEVEL_4' && (
                <Level4Scene gifts={gifts} houses={houses} />
            )}
        </Container>
    );
}; 