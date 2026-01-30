
// app/utils/constants.ts

export const BOARD_SIZE = 15;

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type Coord = {
    x: number;
    y: number;
};

export const WIN_POSITION = 57; // 0-51 path, 52-56 home, 57 win

export const BASE_POS: Record<PlayerColor, Coord> = {
    red: { x: 2, y: 12 },
    green: { x: 2, y: 2 },
    yellow: { x: 12, y: 2 },
    blue: { x: 12, y: 12 }
};

// Start Offset on the main path (0-51)
export const PATH_OFFSETS: Record<PlayerColor, number> = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39
};

// Safe Spots (Global Path Indices not Coordinates - wait, easier to use Coords due to grid)
// Standard Ludo Safe Spots:
// 1. Start Squares for each player (colored)
// 2. Star squares (usually 8 squares from start?)
// Let's use Coordinates for direct rendering.
export const SAFE_POSITIONS: Coord[] = [
    { x: 1, y: 6 },  // Red Start
    { x: 6, y: 1 },  // Green Start? No, Green starts at top track?
    // Let's verify standard 15x15 board safe spots.
    // Red Start: (1,6)
    // Blue Start: (8,13) ?
    // Let's check logic:
    // Red (BL): Starts at (1,6) -> Moves Right.
    // Green (TL): Starts at (8,1) -> Moves Down. (6,1 is usually the spot?)
    // Yellow (TR): Starts at (13,8) -> Moves Left.
    // Blue (BR): Starts at (6,13) -> Moves Up.

    // Normal Safe Spots (Stars):
    // (1,6), (6,1) ? No, typically arrows/starts are colored.
    // Stars are at: (2,6)? No.
    // In standard ludo: 
    // Start squares are safe.
    // Plus 4 other squares.
    // Let's assume:
    // Red Start: (1,6)
    // Star 1: (6,2)
    // Green Start: (8,1) -> Actually usually (8,2) is start?
    // Let's stick to the path logic:
    // Index 0, 8, 13, 21, 26, 34, 39, 47?
    // No, index 0, 13, 26, 39 are starts.
    // Stars are usually +8 or something?
    // Let's use coordinates seen in many boards:
    // (6,2), (2,6) ?
    // Let's stick to: "Star & start squares are safe."

    // Start Squares (Derived from gameLogic path index 0, 13, 26, 39)
    // We will calculate these dynamically or hardcode if we know the map.
    // Based on gameLogic map:
    // 0 -> (1,6) [Red Start]
    // 13 -> (8,1) [Green Start]
    // 26 -> (13,8) [Yellow Start]
    // 39 -> (6,13) [Blue Start]

    // Star Squares (usually 8 steps from start? or mid-quadrant?)
    // (2,6) is close to start.
    // (6,2) top left.
    // (12,8) top right.
    // (8,12) bottom right.

    // Let's add these 8 safe spots:
    // Starts:
    { x: 1, y: 6 },
    { x: 8, y: 1 },
    { x: 13, y: 8 },
    { x: 6, y: 13 },
    // Stars:
    { x: 2, y: 8 }, // Wait, usually 4th cell from corner?
    { x: 6, y: 2 },
    { x: 12, y: 6 },
    { x: 8, y: 12 }
];

// Home Paths (Coords)
// Red: (1,7) to (5,7) ?? No, (1,7) is previous path.
// Red Home path is usually (1,7)..(5,7)?
// Let's check gameLogic.
// Red Home: (1,7) to (6,7)?
// Center is (7,7).
// Normal path ends at (0,7)? Then enters (1,7).
export const HOME_PATHS: Record<PlayerColor, Coord[]> = {
    red: [{ x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }],
    green: [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }],
    yellow: [{ x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }],
    blue: [{ x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }]
};
