import { Graphics } from "@pixi/react";

import { Container } from "@pixi/react";

interface Level1SceneProps {
    snowballs: Snowball[];
    levelScroll: number;
}

export const Level1Scene = ({ snowballs, levelScroll }: Level1SceneProps) => {
    return (
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
    );
}; 