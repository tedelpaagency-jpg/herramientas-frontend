'use client';

import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, Lock, Percent } from 'lucide-react';

interface ProfitCalculatorProps {
  baseCost: number;
  salePrice: number;
  currency?: string;
  isReadOnly?: boolean;
  onChangeSalePrice?: (newPrice: number) => void;
  className?: string;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  baseCost = 0,
  salePrice = 0,
  currency = 'USD',
  isReadOnly = false,
  onChangeSalePrice,
  className = '',
}) => {
  const safeBaseCost = Math.max(0, Number(baseCost) || 0);
  const safeSalePrice = Math.max(0, Number(salePrice) || 0);
  const projectedProfit = Math.round((safeSalePrice - safeBaseCost) * 100) / 100;
  const marginPercent = safeSalePrice > 0 
    ? Math.round((projectedProfit / safeSalePrice) * 100) 
    : 0;

  const isProfitable = projectedProfit >= 0;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-slate-900 dark:text-white shadow-sm dark:shadow-xl ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">Calculadora Comercial B2B</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Proyección de rentabilidad en tiempo real</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300 tracking-wider">
          Moneda: {currency}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Costo Base (Solo lectura para Agencia) */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Costo Base</span>
            <span title="Fijado por el Administrador de Marca Blanca">
              <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-200">
            ${safeBaseCost.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Costo fijado por Marca Blanca</p>
        </div>

        {/* Precio de Venta (Editable) */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-purple-300 dark:border-purple-500/30 rounded-xl p-3.5 space-y-1 relative group focus-within:border-purple-500 transition-colors">
          <label className="text-[11px] font-bold text-purple-600 dark:text-purple-300 flex items-center justify-between">
            <span>Precio de Venta</span>
            <DollarSign className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </label>
          {isReadOnly ? (
            <div className="text-lg font-black text-slate-900 dark:text-white">
              ${safeSalePrice.toFixed(2)}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={safeSalePrice === 0 ? '' : safeSalePrice}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (onChangeSalePrice) {
                    onChangeSalePrice(isNaN(val) ? 0 : Math.max(0, val));
                  }
                }}
                placeholder="0.00"
                className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          )}
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Precio propuesto al cliente final</p>
        </div>

        {/* Ganancia Proyectada */}
        <div className={`border rounded-xl p-3.5 space-y-1 transition-all ${
          isProfitable 
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40' 
            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className={isProfitable ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
              Ganancia Proyectada
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900/60 shadow-xs">
              <Percent className="w-2.5 h-2.5" />
              {marginPercent}%
            </span>
          </div>
          <div className={`text-xl font-black tracking-tight ${isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {projectedProfit >= 0 ? '+' : ''}${projectedProfit.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {isProfitable ? 'Margen comercial proyectado' : 'Precio por debajo del costo base'}
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
        <span>
          Aviso legal: La ganancia proyectada es una estimación comercial y no constituye garantía de rentabilidad financiera.
        </span>
      </div>
    </div>
  );
};

export default ProfitCalculator;
