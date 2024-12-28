import { Container, Graphics } from '@pixi/react';
import { PlayerState } from '../types';

interface PlayerProps {
    player: PlayerState;
}

export const Player = ({ player }: PlayerProps) => {
    console.log('player', player);
    return (
        <Graphics
            draw={g => {
                g.clear();
                g.beginFill(0xFF0000);
                g.drawCircle(player.x, player.y, 25);
                g.endFill();
            }}
        />
    );
}; 