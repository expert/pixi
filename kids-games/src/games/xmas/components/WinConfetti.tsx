import { Container, Graphics } from '@pixi/react';
import { useCallback, useEffect, useState } from 'react';
import { AppSize } from '../types';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: number;
    size: number;
}

interface WinConfettiProps {
    size: AppSize;
}

export const WinConfetti = ({ size }: WinConfettiProps) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    const createParticles = useCallback(() => {
        const newParticles: Particle[] = [];
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF];
        
        for (let i = 0; i < 100; i++) {
            newParticles.push({
                x: Math.random() * size.width,
                y: -10,
                vx: (Math.random() - 0.5) * 5,
                vy: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 2
            });
        }
        return newParticles;
    }, [size]);

    useEffect(() => {
        setParticles(createParticles());
        
        const interval = setInterval(() => {
            setParticles(prev => {
                return prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        vy: p.vy + 0.1
                    }))
                    .filter(p => p.y < size.height);
            });
        }, 16);

        return () => clearInterval(interval);
    }, [size, createParticles]);

    return (
        <Container>
            <Graphics
                draw={g => {
                    g.clear();
                    particles.forEach(p => {
                        g.beginFill(p.color);
                        g.drawCircle(p.x, p.y, p.size);
                        g.endFill();
                    });
                }}
            />
        </Container>
    );
}; 