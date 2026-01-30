
// app/components/StartScreen.tsx
import React, { useState } from 'react';
import { PlayerColor } from '../utils/constants';

type StartScreenProps = {
    onStart: (count: number, names: Record<PlayerColor, string>) => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    const [count, setCount] = useState<number>(2);
    const [names, setNames] = useState<Record<string, string>>({
        red: 'Player 1',
        green: 'Player 2',
        yellow: 'Player 3',
        blue: 'Player 4'
    });

    const handleNameChange = (color: string, val: string) => {
        setNames(prev => ({ ...prev, [color]: val }));
    };

    const handleStart = () => {
        // Filter names based on active colors for clean pass functionality
        // But simplified we pass all, logic filters later
        onStart(count, names as Record<PlayerColor, string>);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-600 mb-2">
                        LUDO KING
                    </h1>
                    <p className="text-slate-500 font-medium">Select players & enter names</p>
                </div>

                {/* Player Count Selection */}
                <div className="flex justify-center gap-4 mb-8">
                    {[2, 3, 4].map(num => (
                        <button
                            key={num}
                            onClick={() => setCount(num)}
                            className={`w-16 h-16 rounded-2xl font-black text-xl transition-all
                                ${count === num
                                    ? 'bg-indigo-600 text-white shadow-lg scale-110'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                            `}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Name Inputs */}
                <div className="space-y-3 mb-8">
                    {/* Always Red (Player 1) */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-sm flex-shrink-0"></div>
                        <input
                            type="text"
                            value={names.red}
                            onChange={(e) => handleNameChange('red', e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            placeholder="Player 1 Name"
                        />
                    </div>

                    {/* Green (Next for 3/4 players) */}
                    {(count >= 3) && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-sm flex-shrink-0"></div>
                            <input
                                type="text"
                                value={names.green}
                                onChange={(e) => handleNameChange('green', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                placeholder="Player 2 Name"
                            />
                        </div>
                    )}

                    {/* Yellow (Always 2nd for 2 player mode, 3rd for others) */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shadow-sm flex-shrink-0"></div>
                        <input
                            type="text"
                            value={names.yellow}
                            onChange={(e) => handleNameChange('yellow', e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                            placeholder={count === 2 ? "Player 2 Name" : "Player 3 Name"}
                        />
                    </div>

                    {/* Blue (4th) */}
                    {count === 4 && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-sm flex-shrink-0"></div>
                            <input
                                type="text"
                                value={names.blue}
                                onChange={(e) => handleNameChange('blue', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Player 4 Name"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleStart}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Start Game 🎲
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
