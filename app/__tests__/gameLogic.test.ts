
// app/__tests__/gameLogic.test.ts
import { describe, it, expect } from 'vitest';
import { getCoords, COMMON_PATH, getActivePlayers } from '../utils/gameLogic';
import { BASE_POS, HOME_PATHS, WIN_POSITION } from '../utils/constants';

describe('Ludo Game Logic', () => {

    it('generates a common path of correct length', () => {
        // 52 steps in main circuit
        expect(COMMON_PATH.length).toBe(52);
    });

    it('returns correct base positions', () => {
        expect(getCoords('red', -1)).toEqual(BASE_POS.red);
        expect(getCoords('blue', -1)).toEqual(BASE_POS.blue);
    });

    it('calculates correct start position on path', () => {
        // Red start is at index 0 of its path (offset 0)
        // Global path index 0 is (1,6)
        expect(getCoords('red', 0)).toEqual(COMMON_PATH[0]);

        // Green start (offset 13)
        expect(getCoords('green', 0)).toEqual(COMMON_PATH[13]);
    });

    it('handles home stretch correctly', () => {
        // Pos 51 = Last step before home (index 51 for red)
        // Pos 52 = First step in home stretch
        const redFirstHome = getCoords('red', 51); // 0-50... wait logic says pos > 50 is home stretch?
        // Logic: if pos > 50

        // Let's check code:
        // if (pos > 50) { homeIdx = pos - 51; ... }

        const redHome1 = getCoords('red', 51); // 51-51 = 0 index of home path
        expect(redHome1).toEqual(HOME_PATHS.red[0]);

        const redHomeLast = getCoords('red', 56); // 56-51 = 5 index
        expect(redHomeLast).toEqual(HOME_PATHS.red[5]);
    });

    it('returns center for win position', () => {
        const winPos = getCoords('red', WIN_POSITION); // 57
        // Code says: if homeIdx < length ... else target {7,7}
        // 57 - 51 = 6. Home path length is 6 (0-5). So 6 is target.
        expect(winPos).toEqual({ x: 7, y: 7 });
    });

    it('returns correct active players', () => {
        expect(getActivePlayers(2)).toEqual(['red', 'yellow']);
        expect(getActivePlayers(3)).toEqual(['red', 'green', 'yellow']);
        expect(getActivePlayers(4)).toEqual(['red', 'green', 'yellow', 'blue']);
    });
});
