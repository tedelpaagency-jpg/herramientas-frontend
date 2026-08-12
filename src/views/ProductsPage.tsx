'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import productService from '../services/productService';
import { ShoppingBag, Plus, Search, Tag, DollarSign, Package } from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService.getProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-on-surface flex items-center space-x-3">
            <ShoppingBag className="w-7 h-7 text-primary" />
            <span>Productos & Inventario</span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">Gestión de catálogo conectado a `/v1/products`</p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-900 rounded-3xl p-5 border border-slate-800">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-base">{p.name}</h3>
                <span className="text-emerald-400 font-extrabold">${Number(p.price).toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{p.description || 'Sin descripción'}</p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>SKU: {p.sku || `#${p.id}`}</span>
                <span>Stock: <strong className="text-sky-400">{p.stock}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
