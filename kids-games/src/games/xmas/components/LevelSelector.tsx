import { Container, Text, Graphics } from '@pixi/react';
import { useCallback } from 'react';
import '@pixi/events';

interface LevelSelectorProps {
    onSelectLevel: (level: string) => void;
    onBack: () => void;
}

export const LevelSelector = ({ onSelectLevel, onBack }: LevelSelectorProps) => {
    const handleLevelClick = useCallback((level: string) => {
        console.log('Level selected:', level);
        onSelectLevel(level);
    }, [onSelectLevel]);

    return (
        <Container>
            <Text 
                text="Select Level"
                x={400}
                y={100}
                anchor={0.5}
                style={{
                    fill: 0xFFFFFF,
                    fontSize: 40
                }}
            />
            
            {['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'].map((level, index) => (
                <Container 
                    key={level}
                    x={200}
                    y={200 + index * 50}
                    eventMode="static" 
                    cursor="pointer"
                    onpointerdown={() => handleLevelClick(level)}
                >
                    <Graphics
                        draw={g => {
                            g.clear();
                            g.beginFill(0x4444FF, 0.5);
                            g.drawRoundedRect(0, 0, 400, 60, 10);
                            g.endFill();
                        }}
                    />
                    <Text 
                        text={`Level ${index + 1}`}
                        x={200}
                        y={30}
                        anchor={0.5}
                        style={{
                            fill: 0xFFFFFF,
                            fontSize: 24
                        }}
                    />
                </Container>
            ))}

            <Container 
                y={500}
                x={350}
                eventMode="static" 
                cursor="pointer"
                onpointerdown={onBack}
            >
                <Graphics
                    draw={g => {
                        g.clear();
                        g.beginFill(0xFF4444, 0.5);
                        g.drawRoundedRect(0, 0, 100, 40, 10);
                        g.endFill();
                    }}
                />
                <Text 
                    text="Back"
                    x={50}
                    y={20}
                    anchor={0.5}
                    style={{
                        fill: 0xFFFFFF,
                        fontSize: 20
                    }}
                />
            </Container>
        </Container>
    );
}; 