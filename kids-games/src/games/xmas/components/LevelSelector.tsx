import { Container, Text, Graphics, Sprite } from '@pixi/react';
import { useCallback } from 'react';
import '@pixi/events';
import { AppSize, LevelConfig } from '../types';

interface LevelSelectorProps {
    onSelectLevel: (level: string) => void;
    onBack: () => void;
    size: AppSize;
}

export const LevelSelector = ({ onSelectLevel, onBack, size}: LevelSelectorProps) => {
    const handleLevelClick = useCallback((level: string) => {
        console.log('Level selected:', level);
        onSelectLevel(level);
    }, [onSelectLevel]);

    return (
        <Container>
            <Text 
                text="La Multi Ani Stefan"
                x={size.width / 2}
                y={170}
                anchor={0.5}
                style={{
                    fill: 0xFFFFFF,
                    fontSize: 35
                }}
            />
            <Sprite 
                image={"/images/Christmas Decoration Santa Claus.png"}
                x={0}
                y={0}
                anchor={0.0}
                width={size.width}  
                height={size.height} 
              />
            
            {['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4'].map((level, index) => (
                <Container 
                    key={level}
                    x={size.width / 2 - 200}
                    y={220 + index * 70}
                    eventMode="static" 
                    cursor="pointer"
                    onpointerdown={() => handleLevelClick(level)}
                >
                    <Graphics
                        draw={g => {
                            g.clear();
                            g.beginFill(0xFFFFFF, 0.5);
                            g.drawRoundedRect(0, 0, size.width - 30, 60, 10);
                            g.endFill();
                        }}
                    />
                    <Text 
                        text={`Level ${index + 1}`}
                        x={200}
                        y={30}
                        anchor={0.5}
                        style={{
                            fill: 0x4444FF,
                            fontSize: 24
                        }}
                    />
                </Container>
            ))}

            <Container 
                y={520}
                x={size.width / 2 - 50}
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