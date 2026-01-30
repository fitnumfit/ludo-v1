
// app/components/PlayerCard.tsx
import React from 'react';
import { PlayerColor } from '../utils/constants';

type PlayerCardProps = {
    color: PlayerColor;
    name: string;
    position: number;
    isTurn: boolean;
    onEditName: () => void;
};

const PlayerCard: React.FC<PlayerCardProps> = ({ color, name, position, isTurn, onEditName }) => {
    const getStyles = () => {
        switch (color) {
            case 'red': return 'bg-red-100 border-red-500 text-red-700';
            case 'green': return 'bg-green-100 border-green-500 text-green-700';
            case 'yellow': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
            case 'blue': return 'bg-blue-100 border-blue-500 text-blue-700';
        }
    };

    return (
        <div className={`p-3 rounded-xl border-2 transition-all duration-300 relative group
            ${getStyles()}
            ${isTurn ? 'scale-105 shadow-lg border-4' : 'opacity-80 border-transparent hover:opacity-100'}
        `}>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 max-w-[80%]">
                    <h3 className="font-bold uppercase text-sm md:text-base truncate">{name}</h3>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEditName(); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded"
                        title="Edit Name"
                    >
                        ✏️
                    </button>
                </div>
                {isTurn && <div className={`w-3 h-3 rounded-full animate-pulse bg-current`}></div>}
            </div>

            <div className="text-xs font-medium opacity-80">
                {position === 57 ? 'FINISHED 🏆' : position === -1 ? 'AT BASE 🏠' : `STEP ${position}`}
            </div>
        </div>
    );
};

export default PlayerCard;
