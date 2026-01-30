
// app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlayerColor, BOARD_SIZE, WIN_POSITION } from './utils/constants';
import { getActivePlayers, getCoords } from './utils/gameLogic';
import { useAudio } from './hooks/useAudio';
import StartScreen from './components/StartScreen';
import PlayerCard from './components/PlayerCard';
import Dice from './components/Dice';
import Cell from './components/Cell';

export default function LudoGame() {
  const [gameState, setGameState] = useState<'SELECT' | 'PLAYING' | 'GAME_OVER'>('SELECT');
  const [players, setPlayers] = useState<PlayerColor[]>([]);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const [turnIndex, setTurnIndex] = useState<number>(0);

  // Positions: -1 = Base, 0-50 = Path, 51-56 = Home Streak, 57 = Win
  const [positions, setPositions] = useState<Record<string, number>>({
    red: -1, green: -1, yellow: -1, blue: -1
  });

  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  const { playRollSound, playMoveSound, playKillSound, playWinSound, initAudio } = useAudio();

  const handleStartGame = (count: number, names: Record<PlayerColor, string>) => {
    initAudio();
    const active = getActivePlayers(count);
    setPlayers(active);
    setPlayerNames(names);
    setTurnIndex(0);
    setPositions({ red: -1, green: -1, yellow: -1, blue: -1 });
    setGameState('PLAYING');
    setDice(null);
    setWinner(null);
  };

  const nextTurn = useCallback(() => {
    setDice(null);
    setTurnIndex((prev) => (prev + 1) % players.length);
  }, [players.length]);

  // Turn switching logic
  useEffect(() => {
    if (dice === null || gameState !== 'PLAYING') return;

    const currentPlayer = players[turnIndex];
    const currentPos = positions[currentPlayer];

    // Check if move is possible
    let canMove = false;

    if (currentPos === -1) {
      if (dice === 6) canMove = true;
    } else {
      if (currentPos + dice <= WIN_POSITION) canMove = true;
    }

    if (!canMove) {
      // Delay and switch
      const timer = setTimeout(() => {
        nextTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dice, turnIndex, positions, gameState, players, nextTurn]);

  const handleRoll = () => {
    if (dice !== null || gameState !== 'PLAYING') return;
    playRollSound();

    // Simple animation delay could be added here
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
  };

  const handleMove = () => {
    if (dice === null || gameState !== 'PLAYING') return;

    const currentPlayer = players[turnIndex];
    const currentPos = positions[currentPlayer];

    if (currentPos === -1 && dice !== 6) return;

    let newPos = currentPos;
    if (currentPos === -1) newPos = 0;
    else newPos = currentPos + dice;

    if (newPos > WIN_POSITION) return;

    playMoveSound();

    // Check win
    if (newPos === WIN_POSITION) {
      playWinSound();
      setWinner(currentPlayer);
      setGameState('GAME_OVER');
      setPositions(prev => ({ ...prev, [currentPlayer]: newPos }));
      setDice(null);
      return;
    }

    // Check Collision & Blocking
    const newCoords = getCoords(currentPlayer, newPos);
    let newPositions = { ...positions, [currentPlayer]: newPos };
    let collided = false;

    // Quick safe check logic (redefined here for scope)
    const isSafeSpot = (c: { x: number, y: number }) => {
      const safes = [
        { x: 1, y: 6 }, { x: 8, y: 1 }, { x: 13, y: 8 }, { x: 6, y: 13 }, // Starts
        { x: 2, y: 8 }, { x: 6, y: 2 }, { x: 12, y: 6 }, { x: 8, y: 12 }  // Stars
      ];
      return safes.some(s => s.x === c.x && s.y === c.y);
    };

    const isSafe = isSafeSpot(newCoords);

    // Check against other active players
    for (const p of players) {
      if (p === currentPlayer) continue;
      const pPos = positions[p];
      if (pPos === -1 || pPos === WIN_POSITION) continue;

      const pCoords = getCoords(p, pPos);
      if (pCoords.x === newCoords.x && pCoords.y === newCoords.y) {

        // Safe Spot Rule: No cutting on safe spots
        if (!isSafe) {
          // Collision!
          newPositions[p] = -1;
          playKillSound();
          collided = true;
        }
      }
    }

    setPositions(newPositions);

    // Rule: Extra turn if 6 OR if Collided (Cut)
    // If consecutiveSixes is < 3 (already checked)
    const extraTurn = (dice === 6) || collided;

    if (extraTurn) {
      setDice(null); // Roll again
      // Note: consecutiveSixes state updates in handleRoll, so it persists for next roll
    } else {
      nextTurn();
    }
  };

  const currentPlayerColor = players[turnIndex];

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-2 font-sans select-none overflow-hidden">

      {gameState === 'SELECT' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {gameState === 'GAME_OVER' && winner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center transform animate-bounce">
            <h2 className="text-6xl font-black mb-6" style={{ color: winner }}>
              {playerNames[winner].toUpperCase()} WINS!
            </h2>
            <div className="text-8xl mb-6">👑</div>
            <button
              onClick={() => setGameState('SELECT')}
              className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold text-xl hover:bg-slate-700 hover:scale-105 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-center max-w-7xl w-full h-full justify-center">

        {/* Top/Left Player Info */}
        <div className="flex lg:flex-col gap-4 w-full lg:w-48 justify-center min-w-[200px]">
          {players.map((p) => (
            <PlayerCard
              key={p}
              color={p}
              name={playerNames[p]}
              position={positions[p]}
              isTurn={gameState === 'PLAYING' && players[turnIndex] === p}
              onEditName={() => {
                const newName = prompt(`Enter new name for ${p.toUpperCase()}:`, playerNames[p]);
                if (newName && newName.trim()) {
                  setPlayerNames(prev => ({ ...prev, [p]: newName.trim() }));
                }
              }}
            />
          ))}
        </div>

        {/* Board Container */}
        <div className="relative flex-shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg">
          {/* Board Grid */}
          <div className="aspect-square w-[90vw] max-w-[500px] lg:max-w-[600px] bg-white border-4 border-black grid grid-cols-15 grid-rows-15 relative">
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => (
              <Cell
                key={i}
                index={i}
                players={players}
                positions={positions}
                turnColor={currentPlayerColor}
                dice={dice}
                onMove={handleMove}
              />
            ))}

            {/* Center Triangles Overlay */}
            {/* Positioned at 6,6 (40% to 60%) */}
            <div className="absolute pointer-events-none z-10" style={{ left: '40%', top: '40%', width: '20%', height: '20%' }}>
              {/* Triangle Clip Paths */}
              <div className="absolute inset-0 bg-yellow-400" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}></div>
              <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}></div>
              <div className="absolute inset-0 bg-red-600" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-blue-600" style={{ clipPath: 'polygon(50% 50%, 0 100%, 100% 100%)' }}></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex lg:flex-col items-center justify-center gap-6 w-full lg:w-48">
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
            <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Turn
            </div>
            <div className={`text-2xl font-black uppercase mb-6 drop-shadow-md
                        ${currentPlayerColor === 'red' ? 'text-red-500' :
                currentPlayerColor === 'green' ? 'text-green-500' :
                  currentPlayerColor === 'yellow' ? 'text-yellow-400' :
                    'text-blue-500'}
                  `}>
              {playerNames[currentPlayerColor]}
            </div>

            <Dice
              value={dice}
              onClick={handleRoll}
              disabled={dice !== null || gameState !== 'PLAYING'}
            />

            <div className="mt-4 text-xs text-gray-500 font-mono">
              {dice ? 'WAITING...' : 'ROLL DICE'}
            </div>
          </div>

          <button
            onClick={() => setGameState('SELECT')}
            className="lg:mt-auto px-6 py-3 rounded-full bg-gray-800 text-gray-400 font-bold hover:bg-gray-700 hover:text-white transition-all border border-gray-700 shadow-lg"
          >
            EXIT
          </button>
        </div>
      </div>

      <style jsx global>{`
        .grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }
        .grid-rows-15 { grid-template-rows: repeat(15, minmax(0, 1fr)); }
      `}</style>
    </main>
  );
}
