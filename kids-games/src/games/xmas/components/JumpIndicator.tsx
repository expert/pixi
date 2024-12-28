import { Graphics } from '@pixi/react';
import { JUMP_CONFIGS } from '../constants';
import { SwipeDirection } from '../../core/controllers/SwipeController';

interface JumpIndicatorProps {
  isVisible: boolean;
  direction: SwipeDirection;
  x: number;
  y: number;
}

export const JumpIndicator = ({ isVisible, direction, x, y }: JumpIndicatorProps) => {
  if (!isVisible) return null;

  const config = JUMP_CONFIGS[direction];
  
  return (
    <Graphics
      draw={g => {
        g.clear();
        g.beginFill(config.indicator.color, 0.6);
        g.moveTo(0, -20);
        g.lineTo(10, 0);
        g.lineTo(-10, 0);
        g.closePath();
        g.endFill();
      }}
      x={x}
      y={y}
      rotation={config.indicator.rotation * (Math.PI / 180)}
    />
  );
}; 