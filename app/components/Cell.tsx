import React from 'react';
import { PlayerColor, BOARD_SIZE, HOME_PATHS, BASE_POS, SAFE_POSITIONS } from '../utils/constants';
import { getCoords } from '../utils/gameLogic';

type CellProps = {
    index: number;
    players: PlayerColor[];
    positions: Record<string, number>;
    turnColor: PlayerColor;
    dice: number | null;
    onMove: () => void;
};

const Cell: React.FC<CellProps> = ({ index, players, positions, turnColor, dice, onMove }) => {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);

    const getCellColor = () => {
        // Base Areas
        if (x < 6 && y < 6) return 'bg-green-100 border-green-200';
        if (x > 8 && y < 6) return 'bg-yellow-100 border-yellow-200';
        if (x < 6 && y > 8) return 'bg-red-100 border-red-200';
        if (x > 8 && y > 8) return 'bg-blue-100 border-blue-200';

        // Center
        if (x >= 6 && x <= 8 && y >= 6 && y <= 8) return 'bg-indigo-50';

        // Home Paths
        if (HOME_PATHS['red'].some(c => c.x === x && c.y === y)) return 'bg-red-200';
        if (HOME_PATHS['green'].some(c => c.x === x && c.y === y)) return 'bg-green-200';
        if (HOME_PATHS['yellow'].some(c => c.x === x && c.y === y)) return 'bg-yellow-200';
        if (HOME_PATHS['blue'].some(c => c.x === x && c.y === y)) return 'bg-blue-200';

        return 'bg-white';
    };

    // Check Safe Spots (Stars)
    const isSafe = SAFE_POSITIONS.some(s => s.x === x && s.y === y);
    // Hardcoded start positions check for visual distinction (arrows/icons) if needed
    // For now, we just rely on SAFE_POSITIONS to show Star.
    // Ideally starts should have an arrow, but stars are fine.
    // Let's filter out starts if we want only stars on non-starts.
    const isStart = (x === 1 && y === 6) || (x === 8 && y === 1) || (x === 13 && y === 8) || (x === 6 && y === 13);
    const showStar = isSafe && !isStart;

    // Check tokens
    const tokensHere = players.filter(p => {
        const pos = positions[p];
        if (pos === 57) return false; // Finished

        if (pos === -1) {
            return BASE_POS[p].x === x && BASE_POS[p].y === y;
        }

        const c = getCoords(p, pos);
        return c.x === x && c.y === y;
    });

    return (
        <div className={`relative w-full h-full border border-gray-900/10 flex items-center justify-center ${getCellColor()}`}>

            {/* Safe Star Visual */}
            {showStar && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none text-gray-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/4 h-3/4">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
            )}

            {/* Tokens */}
            {tokensHere.map((p, i) => {
                const isTurn = turnColor === p;
                const isBaseParams = positions[p] === -1;

                // Stacking logic
                const offset = tokensHere.length > 1 && !isBaseParams ? i * 3 : 0;

                return (
                    <div key={p}
                        className={`absolute rounded-full border-2 border-white shadow-md cursor-pointer transition-transform transform
                            ${isBaseParams ? 'w-3/4 h-3/4 border-dashed opacity-90' : 'w-4/5 h-4/5 z-10'}
                            ${p === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600' : p === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' : p === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' : 'bg-gradient-to-br from-blue-500 to-blue-600'}
                            ${isTurn && dice !== null ? 'animate-bounce ring-2 ring-white' : ''}
                            ${isTurn && dice !== null ? 'hover:scale-110' : ''}
                        `}
                        style={{ transform: `translate(${offset}px, ${offset}px)` }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isTurn) onMove();
                        }}
                    >
                        {/* 3D highlight */}
                        <div className="absolute top-1 left-1 w-1/3 h-1/3 bg-white/40 rounded-full blur-[1px]"></div>
                    </div>
                );
            })}

            {/* Center Text */}
            {x === 7 && y === 7 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="font-black text-xs md:text-sm">WIN</span>
                </div>
            )}
        </div>
    );
};

export default React.memo(Cell);
