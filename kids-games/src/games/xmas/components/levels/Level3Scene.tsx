import { Container, Graphics } from '@pixi/react';
import { Gift } from '../../types';

interface Level3SceneProps {
    gifts: Gift[];
}

export const Level3Scene = ({ gifts }: Level3SceneProps) => {
    return (
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
    );
}; 