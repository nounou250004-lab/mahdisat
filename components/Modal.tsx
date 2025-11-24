import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  total?: number;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-700 transform transition-all animate-[bounce_0.5s_ease-out]">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
            <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 mb-6">{message}</p>
            
            {total !== undefined && (
                <div className="bg-slate-900 rounded-lg px-6 py-3 mb-6 border border-slate-700">
                    <span className="text-emerald-400 font-bold text-xl">{total} د.ج</span>
                </div>
            )}

            <button
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
                حسناً، طلب جديد
            </button>
        </div>
      </div>
    </div>
  );
};