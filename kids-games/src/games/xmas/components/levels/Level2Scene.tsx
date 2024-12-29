import { Graphics } from "@pixi/react";

import { Container } from "@pixi/react";
import { AppSize, Projectile } from "../../types";
import { Snowman } from "../../types";

interface Level2SceneProps {
    projectiles: Projectile[];
    snowmen: Snowman[];
    size: AppSize;
}

export const Level2Scene = ({ projectiles, snowmen, size }: Level2SceneProps) => {
    console.log('Level2Scene props:', { projectiles, snowmen, size });
    
    return (
        <Container>
            <Graphics
                draw={g => {
                    g.clear();
                    g.beginFill(0xFFFFFF);
                    
                    projectiles.forEach(p => {
                        if (p.active) {
                            g.drawCircle(p.x, p.y, 10);
                        }
                    });
                    
                    snowmen.forEach(s => {
                        // if (!s.hit) {
                            g.drawCircle(s.x, s.y, 20);
                            g.drawCircle(s.x, s.y - 30, 15);
                        // }
                    });
                    g.endFill();
                }}
            />
        </Container>
    );
}; 