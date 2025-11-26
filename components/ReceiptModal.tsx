import React from 'react';
import { Transaction, Customer } from '../types';
import { CURRENCY } from '../constants';
import { Printer, CheckCircle2, X } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  customer?: Customer; // To show customer name if available
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, transaction, customer }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity no-print" onClick={onClose} />
      
      <div className="relative flex flex-col items-center w-full max-w-sm max-h-[90vh]">
        
        {/* Success Header (Only visible on screen) */}
        <div className="mb-4 text-center no-print animate-in slide-in-from-bottom-4 fade-in">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">تمت العملية بنجاح</h2>
        </div>

        {/* The Receipt (Printable Area) */}
        <div 
            id="printable-receipt" 
            className="bg-white text-black w-full p-6 rounded-none md:rounded-lg shadow-2xl overflow-y-auto font-mono text-sm relative"
        >
            {/* Receipt Header */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h1 className="text-2xl font-black uppercase tracking-wider mb-1">Shop 2 Mahdisat</h1>
                <p className="text-gray-500 text-xs">رقم الفاتورة: #{transaction.id.slice(-6)}</p>
                <p className="text-gray-500 text-xs dir-ltr">
                    {new Date(transaction.date).toLocaleDateString('en-GB')} - {new Date(transaction.date).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                </p>
            </div>

            {/* Customer Info */}
            {(customer || transaction.paymentMethod === 'credit') && (
                <div className="mb-4 text-xs">
                    <p className="font-bold">الزبون: <span className="font-normal">{customer?.name || 'زبون غير مسجل'}</span></p>
                    <p className="font-bold">نوع الدفع: <span className="font-normal">{transaction.paymentMethod === 'cash' ? 'نقد' : 'آجل (دين)'}</span></p>
                </div>
            )}

            {/* Items List */}
            {transaction.items && transaction.items.length > 0 ? (
                <table className="w-full mb-4">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="text-right py-1">المنتج</th>
                            <th className="text-center py-1">الكمية</th>
                            <th className="text-left py-1">السعر</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="py-2">{item.name}</td>
                                <td className="py-2 text-center">x{item.qty}</td>
                                <td className="py-2 text-left font-bold">{item.qty * item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-4 border-b border-gray-200 mb-4">
                    تسديد دين
                </div>
            )}

            {/* Totals */}
            <div className="border-t-2 border-dashed border-black pt-2">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span>{transaction.total} {CURRENCY}</span>
                </div>
                {transaction.paymentMethod === 'credit' && (
                    <p className="text-center text-xs mt-2 font-bold text-gray-600">
                        * تم تسجيل المبلغ كدين على حساب الزبون
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-gray-500">
                <p>شكراً لزيارتكم!</p>
                <p>يرجى الاحتفاظ بالفاتورة للمراجعة</p>
            </div>
        </div>

        {/* Action Buttons (No Print) */}
        <div className="flex gap-3 w-full mt-4 no-print">
            <button
                onClick={handlePrint}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
                <Printer size={20} />
                طباعة الفاتورة
            </button>
            <button
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
                <X size={20} />
                إغلاق
            </button>
        </div>

      </div>
    </div>
  );
};