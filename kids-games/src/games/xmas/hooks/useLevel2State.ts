import { useState } from "react";
import { ShootingSystem } from "../../core/systems/ShootingSystem";
import { SnowmanSystem } from "../../core/systems/SnowmanSystem";
import { PlayerState, Projectile, Snowman, Platform, AppSize } from "../types";
import { SwipeState } from "../../core/controllers/SwipeController";

export const useLevel2State = (initialState: {
  projectiles: Projectile[];
  snowmen: Snowman[];
  score: number;
  goalScore: number;
  isLevelComplete?: boolean;
  size: AppSize;
}) => {
  const [state, setState] = useState({
    ...initialState,
    isLevelComplete: false
  });

  const handleShot = (player: PlayerState, swipeState: SwipeState, size: AppSize) => {
    if (swipeState.isActive && swipeState.endPoint) {
      const newProjectile = ShootingSystem.startShot(player, swipeState, size);
      if (newProjectile) {
        setState((prev) => ({
          ...prev,
          projectiles: [...prev.projectiles, newProjectile]
        }));
      }
    }
  };

  const updateLevel2 = (deltaTime: number, platforms: Platform[], levelScroll: number, size: AppSize) => {
    setState((prevState) => {
      // Update projectiles with platform collision check
      const activeProjectiles = prevState.projectiles
        .filter((p) => p.active)
        .map((p) => {
          const newX = p.x + p.velocityX * deltaTime;
          const newY = p.y + p.velocityY * deltaTime;
          const newVelocityY = p.velocityY + 500 * deltaTime;

          // Check platform collisions
          const hitsPlatform = platforms.some(platform => {
            const platformX = platform.x + levelScroll;
            return newX >= platformX && 
                   newX <= platformX + platform.width &&
                   newY >= platform.y && 
                   newY <= platform.y + 10;
          });

          // Deactivate if hits platform or goes below screen
          const active = !hitsPlatform && newY < size.height;

          return {
            ...p,
            x: newX,
            y: newY,
            velocityY: newVelocityY,
            active
          };
        })
        .filter(p => p.active);

      // Update snowmen
      let updatedSnowmen = SnowmanSystem.updateSnowmen(prevState.snowmen, deltaTime, size);
      console.log('updatedSnowmen', updatedSnowmen)
      // Generate new snowmen if needed
      if (SnowmanSystem.shouldGenerateNewSnowman(updatedSnowmen, prevState.goalScore, prevState.score, size)) {
        const newSnowman = SnowmanSystem.generateSnowman(size);
        console.log('newSnowman', newSnowman);
        updatedSnowmen = [...updatedSnowmen, newSnowman];
      }

      // Check hits
      const { hits, remainingSnowmen } = SnowmanSystem.checkSnowmanHits(activeProjectiles, updatedSnowmen);
      console.log('remainingSnowmen', remainingSnowmen)
      return {
        ...prevState,
        projectiles: activeProjectiles,
        snowmen: remainingSnowmen,
        score: prevState.score + hits,
        isLevelComplete: (prevState.score + hits) >= prevState.goalScore
      };
    });
  };

  return [state, updateLevel2, handleShot] as const;
};
