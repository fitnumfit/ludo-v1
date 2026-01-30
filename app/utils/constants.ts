
// app/utils/constants.ts

export const BOARD_SIZE = 15;

export type Coord = { x: number; y: number };
export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export const PLAYER_COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

// Base Positions (Where tokens sit before entering)
export const BASE_POS: Record<PlayerColor, Coord> = {
    red: { x: 2, y: 12 },
    green: { x: 2, y: 2 },
    yellow: { x: 12, y: 2 },
    blue: { x: 12, y: 12 },
};

// Offsets on the COMMON_PATH
export const PATH_OFFSETS: Record<PlayerColor, number> = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39,
};

// Home Paths (Private)
export const HOME_PATHS: Record<PlayerColor, Coord[]> = {
    red: [{ x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }],
    green: [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }],
    yellow: [{ x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }],
    blue: [{ x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }],
};

export const WIN_POSITION = 57;
