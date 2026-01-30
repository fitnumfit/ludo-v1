
// app/components/Dice.tsx
import React, { useEffect, useState } from 'react';

type DiceProps = {
    value: number | null;
    onClick: () => void;
    disabled: boolean;
};

const Dice: React.FC<DiceProps> = ({ value, onClick, disabled }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (value) {
            // Map value to rotation
            // 1: front (0,0)
            // 2: right (0, -90)
            // 3: back (0, -180)
            // 4: left (0, 90)
            // 5: top (-90, 0)
            // 6: bottom (90, 0)

            // Add random full spins (360) for animation effect?
            // CSS transition handles the smooth roll if we just set target.
            // To make it look like rolling, we can add multiples of 360.

            let x = 0, y = 0;
            // Base rotations for faces
            switch (value) {
                case 1: x = 0; y = 0; break;
                case 2: x = 0; y = -90; break;
                case 3: x = 0; y = -180; break;
                case 4: x = 0; y = 90; break;
                case 5: x = -90; y = 0; break;
                case 6: x = 90; y = 0; break;
            }

            // Randomized spin: add random 1-3 full rotations
            const spinX = (Math.floor(Math.random() * 2) + 1) * 360;
            const spinY = (Math.floor(Math.random() * 2) + 1) * 360;

            setRotation({ x: x + spinX, y: y + spinY });
        }
    }, [value]);

    const renderDots = (count: number) => {
        // Return array of positions for grid
        // 1: Center
        // 2: TL, BR
        // 3: TL, C, BR
        // 4: TL, TR, BL, BR
        // 5: TL, TR, C, BL, BR
        // 6: TL, TR, ML, MR, BL, BR
        const dots = [];
        const positions = {
            1: [5],
            2: [1, 9],
            3: [1, 5, 9],
            4: [1, 3, 7, 9],
            5: [1, 3, 5, 7, 9],
            6: [1, 3, 4, 6, 7, 9]
        };

        const active = positions[count as keyof typeof positions];

        return (
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1 gap-0.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                    <div key={i} className="flex justify-center items-center">
                        {active.includes(i) && <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-black rounded-full shadow-inner"></div>}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="dice-container w-16 h-16 md:w-20 md:h-20" onClick={!disabled ? onClick : undefined}>
            <div
                className={`dice-cube ${!disabled ? 'cursor-pointer hover:scale-105' : 'opacity-80 cursor-not-allowed'}`}
                style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
                <div className="dice-face face-1" style={{ transform: 'rotateY(0deg) translateZ(32px)' }}>{renderDots(1)}</div>
                <div className="dice-face face-2" style={{ transform: 'rotateY(90deg) translateZ(32px)' }}>{renderDots(2)}</div>
                <div className="dice-face face-3" style={{ transform: 'rotateY(180deg) translateZ(32px)' }}>{renderDots(3)}</div>
                <div className="dice-face face-4" style={{ transform: 'rotateY(-90deg) translateZ(32px)' }}>{renderDots(4)}</div>
                <div className="dice-face face-5" style={{ transform: 'rotateX(90deg) translateZ(32px)' }}>{renderDots(5)}</div>
                <div className="dice-face face-6" style={{ transform: 'rotateX(-90deg) translateZ(32px)' }}>{renderDots(6)}</div>
            </div>
        </div>
    );
};

export default Dice;
