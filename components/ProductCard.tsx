import React from 'react';
import { Product } from '../types';
import { CURRENCY } from '../constants';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 shadow-lg ${
        isOutOfStock 
          ? 'bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed grayscale' 
          : 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-750 active:scale-95'
      }`}
    >
      {!isOutOfStock && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-indigo-600 rounded-full p-1">
            <Plus size={16} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Stock Badge */}
      <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold border ${
        isOutOfStock 
            ? 'bg-red-500/20 text-red-500 border-red-500/30' 
            : product.stock < 10 
                ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' 
                : 'bg-slate-700 text-slate-400 border-slate-600'
      }`}>
        {isOutOfStock ? 'نفذت الكمية' : `${product.stock} متوفر`}
      </div>
      
      <span className="text-6xl mb-4 drop-shadow-md filter transition-transform group-hover:scale-110 duration-200 block">
        {product.icon}
      </span>
      
      <h3 className="text-lg font-bold text-slate-100 mb-1">{product.name}</h3>
      <p className="text-emerald-400 font-bold bg-slate-900/50 px-3 py-1 rounded-full text-sm">
        {product.price} {CURRENCY}
      </p>
    </button>
  );
};