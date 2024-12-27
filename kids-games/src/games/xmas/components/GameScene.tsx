import { Container, Graphics } from '@pixi/react';
import { Platform, PlayerState } from '../types';
import { GROUND_Y } from '../constants';

interface GameSceneProps {
    platforms: Platform[];
    player: PlayerState;
}

export const GameScene = ({ platforms, player }: GameSceneProps) => {
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
                }}
            />
        </Container>
    );
}; 