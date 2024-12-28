import { Graphics } from "@pixi/react";

import { Container } from "@pixi/react";

interface Level2SceneProps {
    projectiles: Projectile[];
    snowmen: Snowman[];
}

export const Level2Scene = ({ projectiles, snowmen }: Level2SceneProps) => {
    return (
        <Container>
            <Graphics
                draw={g => {
                    g.clear();
                    g.beginFill(0xFFFFFF);
                    projectiles.forEach(p => {
                        g.drawCircle(p.x, p.y, 10);
                    });
                    snowmen.forEach(s => {
                        if (!s.hit) {
                            g.drawCircle(s.x, s.y, 20);
                            g.drawCircle(s.x, s.y - 30, 15);
                        }
                    });
                    g.endFill();
                }}
            />
        </Container>
    );
}; 