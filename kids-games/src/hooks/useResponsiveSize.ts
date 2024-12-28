import { useState, useEffect, useCallback } from 'react';

interface UseResponsiveSizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  paddingX?: number;
  paddingY?: number;
}

export const useResponsiveSize = ({ 
  maxWidth = 1400,
  maxHeight = 800,
  paddingX = 0,
  paddingY = 0
}: UseResponsiveSizeOptions = {}) => {
  const calculateSize = useCallback(() => ({
    width: Math.min(window.innerWidth - paddingX, maxWidth),
    height: Math.min(window.innerHeight - paddingY, maxHeight)
  }), [maxWidth, maxHeight, paddingX, paddingY]);

  const [size, setSize] = useState(calculateSize());

  useEffect(() => {
    const handleResize = () => {
      setSize(calculateSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateSize]);

  return size;
}; 