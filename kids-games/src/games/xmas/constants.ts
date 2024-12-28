import { PlatformConfig, LevelConfig } from "./types";

export const PLAYER_SPEED = 200;
export const GROUND_Y = 500;

export const INITIAL_JUMP_VELOCITY = -500; // Increased from -400 for higher jumps
export const MAX_JUMP_DURATION = 300;      // Reduced from 400 for more responsive control
export const GRAVITY = 1200;               // Increased from 900 for snappier falls
export const INITIAL_PLATFORMS = [
    { x: 200, y: 400, width: 100 },
    { 
        x: 400, y: 300, width: 100,
        isMoving: true,
        startX: 300,
        endX: 500,
        speed: 100,
        direction: 1
    },
    { 
        x: 600, y: 200, width: 100,
        isMoving: true,
        startX: 500,
        endX: 700,
        speed: 150,
        direction: -1
    },
]; 

export const JUMP_CONFIGS = {
  UP: {
    verticalVelocity: -600,
    horizontalVelocity: 0,
    gravity: 1200,
    airResistance: 0.1,
    indicator: {
      color: 0xFFFFFF,
      rotation: 0
    }
  },
  UP_LEFT: {
    verticalVelocity: -500,
    horizontalVelocity: -300,
    gravity: 1000,
    airResistance: 0.15,
    indicator: {
      color: 0xFFAA00,
      rotation: -45
    }
  },
  UP_RIGHT: {
    verticalVelocity: -500,
    horizontalVelocity: 300,
    gravity: 1000,
    airResistance: 0.15,
    indicator: {
      color: 0xFFAA00,
      rotation: 45
    }
  },
  DOWN: {
    verticalVelocity: 300,
    horizontalVelocity: 0,
    gravity: 1500,
    airResistance: 0.05,
    indicator: {
      color: 0xFF0000,
      rotation: 180
    }
  },
  NONE: {
    verticalVelocity: 0,
    horizontalVelocity: 0,
    gravity: 1200,
    airResistance: 0,
    indicator: {
      color: 0xCCCCCC,
      rotation: 0
    }
  }
}; 

export const DEFAULT_PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
    LEVEL_1: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -150, // Negative value means moving left
        levelWidth: 5000,  // 5000 pixels wide level
        platformSpecs: {
            minWidth: 100,
            maxWidth: 300,
            minGap: 150,
            maxGap: 300,
            minHeight: 10,
            maxHeight: 300
        },
        snowballs: {
            frequency: 0.3,    // 30% chance per platform
            minSize: 20,
            maxSize: 30,
            minHeight: 50,     // Minimum height above platform
            maxHeight: 100     // Maximum height above platform
        }
    }
}; 

export const DEFAULT_LEVEL_CONFIGS: Record<string, LevelConfig> = {
    LEVEL_1: {
        ...DEFAULT_PLATFORM_CONFIGS.LEVEL_1,
        goalScore: 10
    }
}; 
   