import { Container, Graphics, Sprite } from '@pixi/react';
import { PlayerState } from '../types';

interface PlayerProps {
    player: PlayerState;
}

export const Player = ({ player }: PlayerProps) => {
    return (
        <Container>
          <Graphics
            draw={g => {
                g.clear();
                g.beginFill(0xFF0000);
                g.drawCircle(player.x, player.y, 25);
                g.endFill();
            }}
          />
          <Sprite 
              image="/images/Santa_Claus_PNG.png"
              x={player.x}
              y={player.y}
              anchor={0.5}
              width={50}  // Match PLAYER_HEIGHT
              height={70} // Keep aspect ratio square
          />
      </Container>
    );
}; 