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
      className={`group relative flex flex-col items-center justify-start p-4 rounded-2xl border transition-all duration-200 shadow-lg h-64 overflow-hidden ${
        isOutOfStock 
          ? 'bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed grayscale' 
          : 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-750 active:scale-95'
      }`}
    >
      {!isOutOfStock && (
        <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-indigo-600 rounded-full p-2 shadow-lg">
            <Plus size={20} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Stock Badge */}
      <div className={`absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md ${
        isOutOfStock 
            ? 'bg-red-500/80 text-white border-red-500' 
            : product.stock < 10 
                ? 'bg-orange-500/80 text-white border-orange-500' 
                : 'bg-slate-900/60 text-white border-slate-600'
      }`}>
        {isOutOfStock ? 'نفذت الكمية' : `${product.stock} متوفر`}
      </div>
      
      {/* Product Image */}
      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-slate-700">
        <img 
            src={product.icon} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
            }}
        />
      </div>
      
      <div className="w-full text-center mt-auto">
        <h3 className="text-lg font-bold text-slate-100 mb-2 truncate px-2">{product.name}</h3>
        <p className="text-emerald-400 font-bold bg-slate-900/50 px-4 py-1.5 rounded-full text-sm inline-block">
            {product.price} {CURRENCY}
        </p>
      </div>
    </button>
  );
};