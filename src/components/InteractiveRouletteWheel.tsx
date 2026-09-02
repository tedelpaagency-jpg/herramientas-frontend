'use client';

import React, { useState, useEffect } from 'react';
import { Roulette, RouletteReward } from '../services/gamificationService';
import { Sparkles, Trophy, Gift } from 'lucide-react';

interface InteractiveRouletteWheelProps {
  roulette: Roulette;
  isSpinning: boolean;
  winningIndex: number | null;
  onSpin: () => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1', // Indigo
];

export const InteractiveRouletteWheel: React.FC<InteractiveRouletteWheelProps> = ({
  roulette,
  isSpinning,
  winningIndex,
  onSpin,
  disabled = false,
}) => {
  const rewards: RouletteReward[] = roulette.rewards || [];
  const totalItems = rewards.length;
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    if (winningIndex !== null && winningIndex >= 0 && totalItems > 0) {
      const sliceAngle = 360 / totalItems;
      // Index 0 is at top (270 degrees in standard SVG arc).
      // Calculate target angle to align winning slice with top pointer
      const targetSliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
      const finalAngle = 360 - targetSliceCenter;

      // Spin 5 full rotations + final target offset
      const extraSpins = 360 * 6;
      setRotation(extraSpins + finalAngle);
    }
  }, [winningIndex, totalItems]);

  if (totalItems === 0) {
    return (
      <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 text-center max-w-sm mx-auto">
        <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-300">Ruleta sin premios configurados</p>
        <p className="text-xs text-slate-500 mt-1">Un administrador debe asignar premios y probabilidades a esta ruleta.</p>
      </div>
    );
  }

  const sliceAngle = 360 / totalItems;

  // Helper to construct SVG arc path for each wheel segment
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Outer Glow Container */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        {/* Pointer Needle at top */}
        <div className="absolute -top-3 z-30 flex flex-col items-center">
          <div className="w-6 h-7 bg-gradient-to-b from-amber-400 to-amber-600 clip-triangle shadow-lg transform rotate-180 drop-shadow-md"></div>
          <div className="w-4 h-4 bg-amber-400 rounded-full -mt-2 border-2 border-white shadow-md"></div>
        </div>

        {/* Outer Wheel Ring with decorative LED lights */}
        <div className="w-full h-full rounded-full bg-slate-900 border-8 border-amber-500/80 shadow-2xl p-2 relative flex items-center justify-center overflow-hidden">
          {/* SVG Canvas for Wheel Slices */}
          <div
            className="w-full h-full rounded-full overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.25, 1) shadow-inner"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
              {rewards.map((rr, idx) => {
                const startPercent = idx / totalItems;
                const endPercent = (idx + 1) / totalItems;
                const [startX, startY] = getCoordinatesForPercent(startPercent);
                const [endX, endY] = getCoordinatesForPercent(endPercent);
                const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

                const pathData = [
                  `M ${startX} ${startY}`,
                  `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  'L 0 0',
                ].join(' ');

                const sliceColor = rr.color || PRESET_COLORS[idx % PRESET_COLORS.length];
                const angle = idx * sliceAngle + sliceAngle / 2;

                return (
                  <g key={rr.id || idx}>
                    <path d={pathData} fill={sliceColor} stroke="#ffffff" strokeWidth="0.02" />
                    {/* Text Label within Slice */}
                    <g transform={`rotate(${angle}) translate(0.6, 0) rotate(90)`}>
                      <text
                        x="0"
                        y="0"
                        fill="#ffffff"
                        fontSize="0.08"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-sans font-black select-none pointer-events-none drop-shadow-sm"
                      >
                        {(rr.reward?.name || rr.reward?.title || 'Premio').substring(0, 14)}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={onSpin}
              disabled={isSpinning || disabled}
              className="pointer-events-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-4 border-white dark:border-slate-900 shadow-2xl flex flex-col items-center justify-center text-slate-950 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {isSpinning ? (
                <Sparkles className="w-7 h-7 animate-spin text-slate-950" />
              ) : (
                <>
                  <Trophy className="w-5 h-5 text-slate-950 mb-0.5" />
                  <span>¡GIRAR!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRouletteWheel;
