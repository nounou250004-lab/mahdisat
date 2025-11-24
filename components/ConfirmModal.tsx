
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDanger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700 transform transition-all animate-in zoom-in-95">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
            <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                <AlertTriangle size={32} className={isDanger ? 'text-red-500' : 'text-orange-500'} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 mb-6">{message}</p>
            
            <div className="flex gap-3 w-full">
                <button
                    onClick={onClose}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    إلغاء
                </button>
                <button
                    onClick={() => { onConfirm(); onClose(); }}
                    className={`flex-1 font-semibold py-3 rounded-xl transition-colors ${
                        isDanger 
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20'
                    }`}
                >
                    نعم، حذف
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
