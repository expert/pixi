import { AppSize } from '../../xmas/types';
import { PLAYER_HEIGHT } from '../../xmas/constants';

export const calculateAvailableHeight = (
    size: AppSize, 
    margin: number = 0
): number => {
    return size.height - PLAYER_HEIGHT - margin;
}; 