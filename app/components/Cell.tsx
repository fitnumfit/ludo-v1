
// app/components/Cell.tsx
import React from 'react';
import { PlayerColor, BOARD_SIZE, HOME_PATHS, BASE_POS, Coord } from '../utils/constants';
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

    // Check tokens
    // We strictly check if any active player is AT this cell
    // Handling Base Positions (-1) special rendering
    const tokensHere = players.filter(p => {
        const pos = positions[p];
        if (pos === 57) return false; // Finished

        if (pos === -1) {
            // Check if this cell is the base visual anchor
            return BASE_POS[p].x === x && BASE_POS[p].y === y;
        }

        const c = getCoords(p, pos);
        return c.x === x && c.y === y;
    });

    return (
        <div className={`relative w-full h-full border border-gray-200 flex items-center justify-center ${getCellColor()}`}>
            {tokensHere.map((p, i) => {
                const isTurn = turnColor === p;
                // If multiple tokens on same spot, offest them slightly? (Not common in simplified 1-token Ludo)
                // But base position is static.

                // Base token styling
                const isBaseParams = positions[p] === -1;

                return (
                    <div key={p}
                        className={`absolute rounded-full border-2 border-white shadow-md cursor-pointer transition-transform transform
                            ${isBaseParams ? 'w-3/4 h-3/4 border-dashed opacity-90' : 'w-4/5 h-4/5 z-10'}
                            ${p === 'red' ? 'bg-red-500' : p === 'green' ? 'bg-green-500' : p === 'yellow' ? 'bg-yellow-400' : 'bg-blue-500'}
                            ${isTurn && dice !== null ? 'animate-bounce ring-2 ring-offset-1 ring-black/20' : ''}
                            ${isTurn && dice !== null ? 'hover:scale-110' : ''}
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isTurn) onMove();
                        }}
                    />
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
