import { Container, Graphics } from '@pixi/react';
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
        </Container>
    );
}; 