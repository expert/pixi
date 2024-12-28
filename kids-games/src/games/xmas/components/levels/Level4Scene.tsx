import { Container, Graphics } from '@pixi/react';
import { Gift, House } from '../../types';

interface Level4SceneProps {
    gifts: Gift[];
    houses: House[];
}

export const Level4Scene = ({ gifts, houses }: Level4SceneProps) => {
    return (
        <Container>
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
        </Container>
    );
}; 