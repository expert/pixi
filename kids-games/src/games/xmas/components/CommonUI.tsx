import { Container, Text } from "@pixi/react";
import { AppSize } from "../types";

interface CommonUIProps {
    score: number;
    timeElapsed: number;
    goalScore: number;
    isLevelComplete: boolean;
    size: AppSize;
}

export const CommonUI = ({ score, timeElapsed, goalScore, isLevelComplete, size }: CommonUIProps) => {
    return (
        <Container>
            <Text 
                text={`Score: ${score}/${goalScore}`}
                x={size.width - 100}
                y={10}
                style={{
                    fill: 0xFFFFFF,
                    fontSize: 20
                }}
            />
            {/* ... other common UI elements */}
        </Container>
    );
}; 