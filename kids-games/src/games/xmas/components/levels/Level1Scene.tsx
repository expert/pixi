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
        <Sprite image={"/images/Christmas Santa Claus Icon.png"}
          x={0}
          y={0}
          anchor={0.0}
          width={size.width}  
          height={size.height} 
          alpha={0.5}
        /> 
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