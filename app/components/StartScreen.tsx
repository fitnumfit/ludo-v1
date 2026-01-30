// app/components/StartScreen.tsx
import React, { useState } from 'react';
import { PlayerColor } from '../utils/constants';

type StartScreenProps = {
    onStart: (count: number, names: Record<PlayerColor, string>) => void;
    onBack?: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onBack }) => {
    const [step, setStep] = useState<'COUNT' | 'NAMES'>('COUNT');
    const [count, setCount] = useState<number>(2);
    const [names, setNames] = useState<Record<string, string>>({
        red: 'Player 1',
        green: 'Player 1',
        yellow: 'Player 2',
        blue: 'Player 2'
    });

    // Handle names state initialization based on count
    const selectCount = (c: number) => {
        setCount(c);
        // Reset names defaults based on count
        if (c === 2) {
            setNames({ red: 'Player 1', yellow: 'Player 2', green: '', blue: '' });
        } else if (c === 3) {
            setNames({ red: 'Player 1', green: 'Player 2', yellow: 'Player 3', blue: '' });
        } else {
            setNames({ red: 'Player 1', green: 'Player 2', yellow: 'Player 3', blue: 'Player 4' });
        }
        setStep('NAMES');
    };

    const handleNameChange = (color: string, val: string) => {
        setNames(prev => ({ ...prev, [color]: val }));
    };

    const handleStart = () => {
        onStart(count, names as Record<PlayerColor, string>);
    };

    const renderCountButton = (num: number, label: string) => (
        <button
            onClick={() => selectCount(num)}
            className="w-full max-w-xs mb-4 group relative"
        >
            {/* Glossy Button Style matching image */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-black rounded-xl skew-x-[-10deg] border border-gray-600 shadow-lg transform group-hover:scale-105 transition-all"></div>
            <div className="relative z-10 py-4 px-8 flex items-center justify-center gap-3">
                <span className={`text-4xl font-black ${num === 2 ? 'text-yellow-400' : num === 3 ? 'text-green-400' : 'text-blue-400'
                    } drop-shadow-md`}>{num}</span>
                <span className="text-2xl font-bold text-white uppercase tracking-wider">Players</span>

                {/* Icons/Avatars visual */}
                <div className="flex -space-x-2 ml-2">
                    {Array.from({ length: num }).map((_, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border border-black ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-yellow-400' : i === 2 ? 'bg-green-500' : 'bg-blue-500'
                            }`}></div>
                    ))}
                </div>
            </div>
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 font-sans animate-fade-in">

            {/* Logo Section (Simplified for this screen as Home has big logo) */}
            <div className="mb-8 text-center relative">
                <h2 className="text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 drop-shadow-sm">
                    SETUP GAME
                </h2>
            </div>

            {step === 'COUNT' ? (
                <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
                    {renderCountButton(2, "2 PLAYERS")}
                    {renderCountButton(3, "3 PLAYERS")}
                    {renderCountButton(4, "4 PLAYERS")}

                    {onBack && (
                        <button
                            onClick={onBack}
                            className="mt-8 text-gray-400 hover:text-white uppercase tracking-widest text-sm font-bold"
                        >
                            Back to Home
                        </button>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 p-8 rounded-2xl shadow-2xl backdrop-blur-sm animate-in zoom-in duration-300">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center uppercase tracking-widest border-b border-gray-700 pb-2">
                        Enter Names
                    </h3>

                    <div className="space-y-4 mb-8">
                        {/* 2 Player: Red vs Yellow */}
                        {count === 2 && (
                            <>
                                <InputRow color="red" label="RED" value={names.red} onChange={(v) => handleNameChange('red', v)} />
                                <InputRow color="yellow" label="YELLOW" value={names.yellow} onChange={(v) => handleNameChange('yellow', v)} />
                            </>
                        )}

                        {/* 3 Player: Red, Green, Yellow */}
                        {count === 3 && (
                            <>
                                <InputRow color="red" label="RED" value={names.red} onChange={(v) => handleNameChange('red', v)} />
                                <InputRow color="green" label="GREEN" value={names.green} onChange={(v) => handleNameChange('green', v)} />
                                <InputRow color="yellow" label="YELLOW" value={names.yellow} onChange={(v) => handleNameChange('yellow', v)} />
                            </>
                        )}

                        {/* 4 Player: Red, Green, Yellow, Blue */}
                        {count === 4 && (
                            <>
                                <InputRow color="red" label="RED" value={names.red} onChange={(v) => handleNameChange('red', v)} />
                                <InputRow color="green" label="GREEN" value={names.green} onChange={(v) => handleNameChange('green', v)} />
                                <InputRow color="yellow" label="YELLOW" value={names.yellow} onChange={(v) => handleNameChange('yellow', v)} />
                                <InputRow color="blue" label="BLUE" value={names.blue} onChange={(v) => handleNameChange('blue', v)} />
                            </>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setStep('COUNT')}
                            className="flex-1 py-3 rounded-lg font-bold text-gray-400 hover:bg-gray-800 transition-colors uppercase border border-gray-600"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleStart}
                            className="flex-[2] py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform uppercase tracking-wider"
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for inputs
const InputRow = ({ color, label, value, onChange }: { color: string, label: string, value: string, onChange: (v: string) => void }) => {
    // Map color to styling
    const getDotColor = () => {
        switch (color) {
            case 'red': return 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]';
            case 'green': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
            case 'yellow': return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]';
            case 'blue': return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
        }
    };

    const getTextColor = () => {
        switch (color) {
            case 'red': return 'text-red-500';
            case 'green': return 'text-green-500';
            case 'yellow': return 'text-yellow-400';
            case 'blue': return 'text-blue-500';
        }
    };

    return (
        <div className="flex items-center gap-4 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
            <div className={`w-4 h-4 rounded-full ${getDotColor()}`}></div>
            <label className={`font-black uppercase w-20 ${getTextColor()}`}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent text-white font-bold outline-none placeholder-gray-600"
                placeholder="Name"
            />
        </div>
    );
};

export default StartScreen;
