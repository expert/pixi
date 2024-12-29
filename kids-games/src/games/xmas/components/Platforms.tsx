import { Container, Graphics, Sprite } from '@pixi/react';
import { Platform } from '../types';

interface PlatformsProps {
    platforms: Platform[];
    levelScroll: number;
}

export const Platforms = ({ platforms, levelScroll }: PlatformsProps) => {
    return (
        <Container x={levelScroll}>
            <Graphics
                draw={g => {
                    g.clear();
                    g.beginFill(0x00FF00);
                    platforms.forEach(platform => {
                        g.drawRect(platform.x, platform.y, platform.width, 10);
                    });
                    g.endFill();
                }}
            />
            { platforms.map(platform => (
                <Sprite 
                    image="/images/Santa_Claus_Sled_PNG.png"
                    x={platform.x + platform.width / 2}
                    y={platform.y}
                    anchor={0.5}
                    width={platform.width}  // Match PLAYER_HEIGHT
                    height={70} // Keep aspect ratio square
                />
            ))}
        </Container>
    );
}; 