
// app/hooks/useAudio.ts

import { useRef } from 'react';

export const useAudio = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextCtor) {
                audioCtxRef.current = new AudioContextCtor();
            }
        }
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const playTone = (freq: number, type: OscillatorType, duration: number) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playRollSound = () => {
        initAudio();
        playTone(600, 'sine', 0.1);
        setTimeout(() => playTone(800, 'sine', 0.1), 100);
    };

    const playMoveSound = () => {
        initAudio();
        playTone(400, 'triangle', 0.1);
    };

    const playKillSound = () => {
        initAudio();
        playTone(300, 'sawtooth', 0.3);
        setTimeout(() => playTone(150, 'sawtooth', 0.3), 150);
    };

    const playWinSound = () => {
        initAudio();
        playTone(523.25, 'square', 0.2); // C5
        setTimeout(() => playTone(659.25, 'square', 0.2), 200); // E5
        setTimeout(() => playTone(783.99, 'square', 0.4), 400); // G5
    }

    return { playRollSound, playMoveSound, playKillSound, playWinSound, initAudio };
};
