// app/components/HomeScreen.tsx
import React from 'react';

type HomeScreenProps = {
    onStart: () => void;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
            {/* Logo/Title */}
            <div className="mb-16 transform hover:scale-105 transition-transform duration-500">
                <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] filter">
                    LUDO
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-[0.5em] mt-2 uppercase text-shadow">
                    Multiplayer
                </h2>
            </div>

            {/* Main Action Button */}
            <button
                onClick={onStart}
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.5)] transform hover:scale-110 transition-all duration-300 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <span className="text-3xl font-black text-white tracking-widest uppercase">
                        Play Now
                    </span>
                    <svg className="w-8 h-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </button>

            {/* Footer */}
            <div className="absolute bottom-8 text-gray-500 text-sm">
                2026 Ludo Multiplayer • Premium Edition
            </div>
        </div>
    );
};

export default HomeScreen;
