import { PlatformConfig, LevelConfig } from "./types";

export const PLAYER_SPEED = 200;
export const PLAYER_HEIGHT = 50;
export const PLAYER_RADIUS = 25;

export const INITIAL_JUMP_VELOCITY = -500; // Increased from -400 for higher jumps
export const MAX_JUMP_DURATION = 300;      // Reduced from 400 for more responsive control
export const GRAVITY = 1200;               // Increased from 900 for snappier falls

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

// export const DEFAULT_PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
//     LEVEL_1: {
//         count: 20,
//         direction: 'horizontal',
//         scrollSpeed: -30, // Negative value means moving left
//         levelWidth: 1000,  // 5000 pixels wide level
//         platformSpecs: {
//             minWidth: 100,
//             maxWidth: 300,
//             minGap: -350,
//             maxGap: -100,
//             minHeight: 10,
//             maxHeight: 300
//         },
//         snowballs: {
//             frequency: 0.3,    // 30% chance per platform
//             minSize: 20,
//             maxSize: 30,
//             minHeight: 50,     // Minimum height above platform
//             maxHeight: 100     // Maximum height above platform
//         }
//     }
// }; 

export const DEFAULT_LEVEL_CONFIGS: Record<string, LevelConfig> = {
    LEVEL_1: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -10,
        levelWidth: 10,
        platformSpecs: {
            minWidth: 100,
            maxWidth: 300,
            minGap: -10,
            maxGap: 100,
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
    },
    LEVEL_2: {
        count: 20,
        direction: 'horizontal',
        scrollSpeed: -200, // Faster scroll
        levelWidth: 6000,
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
   