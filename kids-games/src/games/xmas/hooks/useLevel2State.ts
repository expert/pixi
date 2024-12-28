import { useState } from 'react';
import { ShootingSystem } from '../../core/systems/ShootingSystem';
import { SnowmanSystem } from '../../core/systems/SnowmanSystem';
import { PlayerState, Projectile, Snowman, Platform  } from '../types';
import { SwipeState } from '../../core/controllers/SwipeController';

export const useLevel2State = (initialState: {
    projectiles: Projectile[];
    snowmen: Snowman[];
    score: number;
    goalScore: number;
    isLevelComplete?: boolean;
}) => {
    const [state, setState] = useState({
        ...initialState,
        isLevelComplete: false
    });

    const handleShot = (player: PlayerState, swipeState: SwipeState) => {
        if (swipeState.isActive && swipeState.endPoint) {
            const newProjectile = ShootingSystem.startShot(player, swipeState);
            if (newProjectile) {
                setState(prev => ({
                    ...prev,
                    projectiles: [...prev.projectiles, newProjectile]
                }));
            }
        }
    };

    const updateLevel2 = (deltaTime: number, platforms: Platform[], levelScroll: number) => {
        setState(prevState => {
            // Update projectiles
            const activeProjectiles = ShootingSystem.checkPlatformHits(prevState.projectiles, platforms, levelScroll)
                .filter(p => p.active)
                .map(p => ShootingSystem.updateProjectile(p, platforms, deltaTime));

            // Update snowmen
            let updatedSnowmen = SnowmanSystem.updateSnowmen(prevState.snowmen, deltaTime);
            if (updatedSnowmen.length < 3 && SnowmanSystem.shouldGenerateNewSnowman()) {
                updatedSnowmen = [...updatedSnowmen, SnowmanSystem.generateSnowman()];
            }

            // Check hits
            const { hits, remainingSnowmen } = ShootingSystem.checkSnowmanHits(activeProjectiles, updatedSnowmen);
            const newScore = prevState.score + hits;

            return {
                projectiles: activeProjectiles,
                snowmen: remainingSnowmen,
                score: newScore,
                goalScore: prevState.goalScore,
                isLevelComplete: newScore >= prevState.goalScore
            };
        });
    };

    return [state, updateLevel2, handleShot] as const;
};