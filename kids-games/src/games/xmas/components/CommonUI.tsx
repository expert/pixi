import { Container, Text } from "@pixi/react";

interface CommonUIProps {
    score: number;
    timeElapsed: number;
    goalScore: number;
    isLevelComplete: boolean;
    width: number;
    height: number;
}

export const CommonUI = ({ score, timeElapsed, goalScore, isLevelComplete, width, height }: CommonUIProps) => {
    return (
        <Container>
            <Text 
                text={`Score: ${score}/${goalScore}`}
                x={width - 100}
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