import React, { useMemo, useRef, useEffect, useState } from 'react';
import { CartItem, Customer, PaymentMethod } from '../types';
import { CURRENCY } from '../constants';
import { Trash2, ShoppingBag, CreditCard, Minus, Plus, Users, Wallet } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  customers: Customer[];
  onAdd: (item: CartItem) => void;
  onRemoveOne: (item: CartItem) => void;
  onClear: () => void;
  onCheckout: (method: PaymentMethod, customerId?: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cart, customers, onAdd, onRemoveOne, onClear, onCheckout }) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }, [cart]);

  // Auto-scroll
  useEffect(() => {
    if (scrollEndRef.current) {
        scrollEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cart.length]);

  const handleCheckoutClick = () => {
    if (paymentMethod === 'credit' && !selectedCustomerId) {
        alert("الرجاء اختيار زبون لتسجيل الدين");
        return;
    }
    onCheckout(paymentMethod, selectedCustomerId);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900 z-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
                <ShoppingBag className="text-indigo-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">الفاتورة الحالية</h2>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
            <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
            <p className="text-lg">السلة فارغة</p>
          </div>
        ) : (
          cart.map((item) => (
            <div 
                key={item.id} 
                className="group flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-slate-700 rounded-lg p-1 h-12 w-12 flex items-center justify-center">
                    {item.icon}
                </span>
                <div>
                  <h4 className="font-bold text-slate-200">{item.name}</h4>
                  <p className="text-emerald-400 text-sm font-mono">
                    {item.price * item.qty} {CURRENCY}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button 
                    onClick={() => onRemoveOne(item)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                >
                    <Minus size={16} />
                </button>
                <span className="w-6 text-center font-bold text-white text-sm">{item.qty}</span>
                <button 
                    onClick={() => onAdd(item)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                >
                    <Plus size={16} />
                </button>
              </div>
            </div>
          ))
        )}
        <div ref={scrollEndRef} />
      </div>

      {/* Payment Controls */}
      <div className="p-6 bg-slate-800/80 backdrop-blur-md border-t border-slate-700">
        
        {/* Payment Method Toggle */}
        <div className="bg-slate-900 p-1 rounded-xl flex mb-4 border border-slate-700">
            <button 
                onClick={() => setPaymentMethod('cash')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'cash' 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
            >
                <Wallet size={16} />
                نقد
            </button>
            <button 
                onClick={() => setPaymentMethod('credit')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${
                    paymentMethod === 'credit' 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
            >
                <Users size={16} />
                دَين (كريدي)
            </button>
        </div>

        {/* Customer Select for Credit */}
        {paymentMethod === 'credit' && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs text-slate-400 mb-1 block mr-1">اختر الزبون:</label>
                <select 
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-2.5 focus:border-red-500 focus:outline-none"
                >
                    <option value="">-- اختر زبوناً --</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
        )}

        <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-lg">المجموع</span>
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-cyan-400">
                {total.toLocaleString()} {CURRENCY}
            </span>
        </div>

        <div className="space-y-3">
            <button
                onClick={handleCheckoutClick}
                disabled={cart.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] ${
                    cart.length === 0 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : paymentMethod === 'cash'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                }`}
            >
                {paymentMethod === 'cash' ? <CreditCard size={20} /> : <Users size={20} />}
                <span>{paymentMethod === 'cash' ? 'إتمام الدفع' : 'تسجيل الدين'}</span>
            </button>

            <button
                onClick={onClear}
                disabled={cart.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                     cart.length === 0
                     ? 'text-slate-600 cursor-not-allowed'
                     : 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                }`}
            >
                <Trash2 size={18} />
                <span>إلغاء</span>
            </button>
        </div>
      </div>
    </div>
  );
};