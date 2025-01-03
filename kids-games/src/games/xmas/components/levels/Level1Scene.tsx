import { Graphics, Sprite } from "@pixi/react";

import { Container } from "@pixi/react";
import { Snowball, AppSize } from "../../types";

interface Level1SceneProps {
    snowballs: Snowball[];
    levelScroll: number;
    size: AppSize;
}

export const Level1Scene = ({ snowballs, levelScroll, size }: Level1SceneProps) => {
    return (
      <Container>
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
      </Container>
    );
}; 