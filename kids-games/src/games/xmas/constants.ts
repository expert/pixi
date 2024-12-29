import { PlatformConfig, LevelConfig } from "./types";

export const PLAYER_SPEED = 200;
export const PLAYER_HEIGHT = 50;
export const PLAYER_RADIUS = 25;

export const INITIAL_JUMP_VELOCITY = -1000;
export const MAX_JUMP_DURATION = 300;
export const GRAVITY = 1100;

export const JUMP_CONFIGS = {
  UP: {
    verticalVelocity: -1100,
    horizontalVelocity: 0,
    gravity: 1200,
    airResistance: 0.08,
    indicator: {
      color: 0xFFFFFF,
      rotation: 0
    }
  },
  UP_LEFT: {
    verticalVelocity: -1100,
    horizontalVelocity: -400,
    gravity: 1000,
    airResistance: 0.1,
    indicator: {
      color: 0xFFAA00,
      rotation: -45
    }
  },
  UP_RIGHT: {
    verticalVelocity: -1100,
    horizontalVelocity: 400,
    gravity: 1000,
    airResistance: 0.1,
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

export const DEFAULT_LEVEL_CONFIGS: Record<string, LevelConfig> = {
    LEVEL_1: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -50,
        levelWidth: 5000,
        pattern: 'STAIR_UP',
        platformSpecs: {
            minWidth: 100,
            maxWidth: 300,
            minGap: 10,
            maxGap: 50,
            minHeight: 10,
            maxHeight: 300
        },
        snowballs: {
            frequency: 0.8,
            minSize: 15,
            maxSize: 30,
            minHeight: 50,
            maxHeight: 400,
            spacing: {
                min: 100,
                max: 200
            }
        },
        goalScore: 10
    },
    LEVEL_2: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -200, // Faster scroll
        levelWidth: 1000,
        pattern: 'MAZE',
        platformSpecs: {
            minWidth: 80,  // Smaller platforms
            maxWidth: 200,
            minGap: 200,   // Bigger gaps
            maxGap: 400,
            minHeight: 50,
            maxHeight: 400
        },
        snowballs: {
            frequency: 0.4,
            minSize: 15,
            maxSize: 25,
            minHeight: 100,
            maxHeight: 200
        },
        goalScore: 15
    },
    LEVEL_3: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -250, // Even faster
        levelWidth: 7000,
        platformSpecs: {
            minWidth: 60,
            maxWidth: 150,
            minGap: 250,
            maxGap: 450,
            minHeight: 100,
            maxHeight: 500
        },
        snowballs: {
            frequency: 0.5,
            minSize: 10,
            maxSize: 20,
            minHeight: 150,
            maxHeight: 300
        },
        goalScore: 20
    },
    LEVEL_4: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -350,
        levelWidth: 5000,
        platformSpecs: {
            minWidth: 100,
            maxWidth: 300,
            minGap: 150,
            maxGap: 300,
            minHeight: 10,
            maxHeight: 300
        },
        snowballs: {
            frequency: 0.3,
            minSize: 20,
            maxSize: 30,
            minHeight: 50,
            maxHeight: 100
        },
        goalScore: 10
    }
}; 
   