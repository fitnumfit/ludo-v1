
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

    // Check Collision
    const newCoords = getCoords(currentPlayer, newPos);
    let newPositions = { ...positions, [currentPlayer]: newPos };
    let collided = false;

    // Check against other active players
    for (const p of players) {
      if (p === currentPlayer) continue;
      const pPos = positions[p];
      if (pPos === -1 || pPos === WIN_POSITION) continue; // Safe

      const pCoords = getCoords(p, pPos);
      if (pCoords.x === newCoords.x && pCoords.y === newCoords.y) {
        // Collision!
        newPositions[p] = -1;
        playKillSound();
        collided = true;
      }
    }

    setPositions(newPositions);

    // Rule: If 6 rolled, roll again?
    // Simplified: If 6, roll again.
    if (dice !== 6) {
      nextTurn();
    } else {
      setDice(null); // Allow rolling again immediately
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
      <div className="flex flex-col lg:flex-row gap-6 items-center max-w-6xl w-full h-full justify-center">

        {/* Top/Left Player Info */}
        <div className="flex lg:flex-col gap-2 w-full lg:w-48 justify-center min-w-[200px]">
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

        {/* Board */}
        <div className="relative flex-shrink-0">
          <div className="aspect-square w-[90vw] max-w-[500px] lg:max-w-[600px] bg-white border-[8px] md:border-[12px] border-slate-800 rounded-xl shadow-2xl grid grid-cols-15 grid-rows-15 overflow-hidden">
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
          </div>
        </div>

        {/* Controls */}
        <div className="flex lg:flex-col items-center justify-center gap-6 w-full lg:w-48">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold bg-white px-4 py-1 rounded-full shadow-sm mb-4">
              Current Turn
            </div>
            <Dice
              value={dice}
              onClick={handleRoll}
              disabled={dice !== null || gameState !== 'PLAYING'}
              colorClass={currentPlayerColor === 'red' ? 'border-red-500 text-red-500' :
                currentPlayerColor === 'green' ? 'border-green-500 text-green-500' :
                  currentPlayerColor === 'yellow' ? 'border-yellow-500 text-yellow-500' :
                    'border-blue-500 text-blue-500'}
            />
            <div className={`mt-4 text-xl font-black uppercase
                        ${currentPlayerColor === 'red' ? 'text-red-500' :
                currentPlayerColor === 'green' ? 'text-green-500' :
                  currentPlayerColor === 'yellow' ? 'text-yellow-500' :
                    'text-blue-500'}
                  `}>
              {playerNames[currentPlayerColor]}
            </div>
          </div>

          <button
            onClick={() => setGameState('SELECT')}
            className="lg:mt-auto px-4 py-2 text-slate-400 font-semibold hover:text-red-500 hover:underline transition-colors"
            title="Exit to Main Menu"
          >
            Exit Game
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
