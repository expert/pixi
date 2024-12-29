type Vector2D = {
  x: number;
  y: number;
};

export type SwipeDirection = 'UP' | 'UP_LEFT' | 'UP_RIGHT' | 'DOWN' | 'NONE';

export interface SwipeState {
  isActive: boolean;
  startPoint: Vector2D | null;
  endPoint: Vector2D | null;
  direction: SwipeDirection;
  magnitude: number;
}

export const createSwipeState = (): SwipeState => ({
  isActive: false,
  startPoint: null,
  endPoint: null,
  direction: 'NONE',
  magnitude: 0
});

export const calculateSwipeDirection = (start: Vector2D, end: Vector2D): SwipeDirection => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Determine direction based on angle
  if (angle < -60 && angle > -120) return 'UP';
  if (angle < -120 && angle > -180) return 'UP_LEFT';
  if (angle < 180 && angle > 120) return 'UP_LEFT';
  if (angle < 120 && angle > 60) return 'DOWN';
  if (angle < 60 && angle > 0) return 'UP_RIGHT';
  if (angle < 0 && angle > -60) return 'UP_RIGHT';
  
  return 'NONE';
}

export const calculateSwipeMagnitude = (start: Vector2D, end: Vector2D): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
} 