'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import posService from '../services/posService';
import { Calculator, ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';

export const PosPage: React.FC = () => {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [clientName, setClientName] = useState('');
  const [paymentType, setPaymentType] = useState('efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    posService.getCatalog().then(setCatalog);
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('El carrito está vacío');
    setIsSubmitting(true);

    try {
      await posService.processSale({
        client_name: clientName || 'Cliente General',
        payment_type: paymentType,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
      });
      alert('¡Venta registrada con éxito!');
      setCart([]);
      setClientName('');
    } catch (err) {
      console.error('Error processing sale:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-black text-white flex items-center space-x-3">
          <Calculator className="w-7 h-7 text-sky-500" />
          <span>Caja POS / Punto de Venta</span>
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {catalog.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-sky-500 cursor-pointer transition-all"
            >
              <h3 className="font-bold text-sm text-white line-clamp-1">{p.name}</h3>
              <p className="text-xs text-emerald-400 font-bold mt-1">${Number(p.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-lg text-white mb-4 flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-sky-500" />
            <span>Resumen de Venta</span>
          </h2>

          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-xs text-slate-300">
                <span>{item.product.name} (x{item.quantity})</span>
                <span className="font-bold text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <input
              type="text"
              placeholder="Nombre del Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
            />
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta de Crédito / Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400">Total a Pagar:</span>
            <span className="text-2xl font-black text-emerald-400">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white font-bold text-sm shadow-lg shadow-emerald-600/30"
          >
            {isSubmitting ? 'Procesando...' : 'Completar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosPage;
