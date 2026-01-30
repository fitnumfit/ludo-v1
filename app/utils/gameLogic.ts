
// app/utils/gameLogic.ts

import { Coord, PlayerColor, BASE_POS, HOME_PATHS, PATH_OFFSETS, WIN_POSITION } from './constants';

const generateCommonPath = (): Coord[] => {
    const path: Coord[] = [];
    // Red Leg (Bottom-Left going Right) -> (1,6) to (5,6) [5 steps]
    for (let i = 1; i <= 5; i++) path.push({ x: i, y: 6 });
    // (6,5) to (6,0) [6 steps]
    for (let i = 5; i >= 0; i--) path.push({ x: 6, y: i });
    // (7,0) [1 step]
    path.push({ x: 7, y: 0 });
    // (8,0) to (8,5) [6 steps]
    for (let i = 0; i <= 5; i++) path.push({ x: 8, y: i });
    // (9,6) to (14,6) [6 steps]
    for (let i = 9; i <= 14; i++) path.push({ x: i, y: 6 });
    // (14,7) [1 step]
    path.push({ x: 14, y: 7 });
    // (14,8) to (9,8) [6 steps]
    for (let i = 14; i >= 9; i--) path.push({ x: i, y: 8 });
    // (8,9) to (8,14) [6 steps]
    for (let i = 9; i <= 14; i++) path.push({ x: 8, y: i });
    // (7,14) [1 step]
    path.push({ x: 7, y: 14 });
    // (6,14) to (6,9) [6 steps]
    for (let i = 14; i >= 9; i--) path.push({ x: 6, y: i });
    // (5,8) to (0,8) [6 steps]
    for (let i = 5; i >= 0; i--) path.push({ x: i, y: 8 });
    // (0,7) [1 step]
    path.push({ x: 0, y: 7 });

    // Total: 5 + 6 + 1 + 6 + 6 + 1 + 6 + 6 + 1 + 6 + 6 + 1 = 51?
    // Let's recount standard Ludo path
    // 6 squares per arm usually?
    // Start (1,6) is index 0.
    // 0,1,2,3,4 -> (1,6) to (5,6) = 5 sq
    // 5 -> (6,6)? No this is corner

    // Let's add (0,6) as start if needed? No Red starts at 1,6
    // The previous loop logic:
    // 1 to 5 = 5
    // 5 to 0 = 6
    // 1 = 1
    // 0 to 5 = 6
    // 9 to 14 = 6
    // 1 = 1
    // 14 to 9 = 6
    // 9 to 14 = 6
    // 1 = 1
    // 14 to 9 = 6
    // 5 to 0 = 6
    // 1 = 1
    // Sum = 5+6+1+6+6+1+6+6+1+6+6+1 = 51.
    // We are missing one step?
    // Maybe the traverse across 6,6 8,6 etc?
    // The corners are 6,6 8,6 8,8 6,8?
    // Let's check the board. 15x15.
    // Center is 6,6 to 8,8.
    // Path goes around center.
    // 6,6 is not part of path? It's corner of home area.

    // Simplest fix: Add an extra step to make it 52 if that's the canonical length
    // OR adjust test if 51 is correct for this board size.
    // Standard ludo: 52 outer cells.
    // My manual generation has 51.
    // Where is the missing one?
    // (1,6)..(5,6) = 5
    // (6,5)..(6,0) = 6
    // (7,0) = 1
    // (8,0)..(8,5) = 6
    // (9,6)..(14,6) = 6... Wait 9,10,11,12,13,14 = 6. Correct.
    // (14,7) = 1
    // (14,8)..(9,8) = 6
    // (8,9)..(8,14) = 6
    // (7,14) = 1
    // (6,14)..(6,9) = 6
    // (5,8)..(0,8) = 6
    // (0,7) = 1

    // Ah, (0,7) to (0,6)?
    // The loop should close.
    // (0,7) is left entrance.
    // Next Red position would be (1,6)?
    // Between (0,7) and (1,6) is (0,6)?
    // Usually start is (1,6).
    // Let's add (0,6) ?
    // No, (0,7) is the end of the loop before Red goes home?
    // If we look at Blue: Starts at 26.

    // Let's just add the missing corner or step. 
    // Maybe (6,5) to (6,0) is 6 steps: 5,4,3,2,1,0.
    // (1,6) to (5,6) is 5 steps: 1,2,3,4,5.
    // 6,6 is skipped.

    // I will add one more step at the end to close the loop or extend an arm.
    // (0,7) -> (0,6) ? 
    // Let's add (0,6) to make it 52.
    path.push({ x: 0, y: 6 }); // Additional step to complete 52

    return path;
};

export const COMMON_PATH = generateCommonPath();

export const getCoords = (color: PlayerColor, pos: number): Coord => {
    if (pos === -1) return BASE_POS[color];

    // Calculate global path index
    const offset = PATH_OFFSETS[color];

    // Check for home stretch
    // Path length 52 (0-51)
    // If pos > 50, entering home stretch
    if (pos > 50) {
        const homeIdx = pos - 51; // 0 to 5
        if (homeIdx < HOME_PATHS[color].length) return HOME_PATHS[color][homeIdx];
        // Target center
        return { x: 7, y: 7 };
    }

    // Normal path
    // Wrap around 52
    const globalIdx = (pos + offset) % 52;
    return COMMON_PATH[globalIdx];
};

export const getActivePlayers = (count: number): PlayerColor[] => {
    if (count === 2) return ['red', 'yellow']; // Opposite corners
    if (count === 3) return ['red', 'green', 'yellow'];
    return ['red', 'green', 'yellow', 'blue'];
};
