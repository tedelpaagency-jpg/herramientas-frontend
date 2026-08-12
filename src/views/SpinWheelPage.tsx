'use client';

import React, { useEffect, useState } from 'react';
import { SpinWheel, SpinResult } from '../types';
import spinWheelService from '../services/spinWheelService';
import { Gift, RotateCw, Trophy } from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const SpinWheelPage: React.FC = () => {
  const [wheels, setWheels] = useState<SpinWheel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);

  useEffect(() => {
    spinWheelService.getSpinWheels().then(setWheels).finally(() => setIsLoading(false));
  }, []);

  const handleSpin = async (wheelId: number) => {
    setIsSpinning(true);
    setSpinResult(null);

    try {
      // Simulate spinning delay for user experience
      setTimeout(async () => {
        const result = await spinWheelService.spin(wheelId);
        setSpinResult(result);
        setIsSpinning(false);
      }, 2000);
    } catch (err) {
      console.error('Error spinning wheel:', err);
      setIsSpinning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-on-surface flex items-center space-x-3">
            <Gift className="w-7 h-7 text-secondary" />
            <span>Ruletas de Premios SANTUN</span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">Gamificación conectada a `/v1/spin-wheels/{'{id}'}/spin`</p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wheels.map((w) => (
            <div key={w.id} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col items-center text-center">
              <div className={`w-32 h-32 rounded-full border-4 border-emerald-500/40 bg-slate-800 flex items-center justify-center relative shadow-2xl ${isSpinning ? 'animate-spin' : ''}`}>
                <Gift className="w-12 h-12 text-emerald-400" />
              </div>

              <h3 className="font-bold text-xl text-white mt-6">{w.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{w.rewards?.length || 0} Premios configurados</p>

              <button
                onClick={() => handleSpin(w.id)}
                disabled={isSpinning}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'Girando Ruleta...' : 'Girar Ruleta Ahora'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {spinResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-emerald-500/50 w-full max-w-sm p-8 text-center shadow-2xl">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black text-white">¡Premio Ganado!</h2>
            <p className="text-emerald-400 font-bold text-lg mt-2">{spinResult.reward?.title}</p>
            <p className="text-xs text-slate-400 mt-1">{spinResult.message}</p>
            <button
              onClick={() => setSpinResult(null)}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheelPage;
