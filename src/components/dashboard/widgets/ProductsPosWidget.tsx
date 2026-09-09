'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, ShoppingCart, ArrowRight, ChevronRight } from 'lucide-react';

interface ProductsPosWidgetProps {
  total?: number;
  recentProducts?: any[];
}

export const ProductsPosWidget: React.FC<ProductsPosWidgetProps> = ({
  total = 0,
  recentProducts = [],
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Productos & Punto de Venta
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {total} artículos en catálogo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pos"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Terminal POS</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            <span>Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {recentProducts.length > 0 ? (
        <div className="space-y-2">
          {recentProducts.map((prod) => (
            <Link
              key={prod.id}
              href="/products"
              className="py-2.5 px-3 -mx-3 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {prod.name}
                </p>
                <p className="text-xs text-slate-400">
                  {prod.price ? `$${Number(prod.price).toLocaleString()}` : 'Precio libre'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No hay productos agregados todavía.
        </div>
      )}
    </div>
  );
};

export default ProductsPosWidget;
