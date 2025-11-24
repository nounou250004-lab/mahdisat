
import React, { useState } from 'react';
import { Supplier } from '../types';
import { Truck, Phone, Plus, Trash2, X, Save } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SuppliersProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
}

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAddSupplier, onDeleteSupplier }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleSaveSupplier = () => {
    if (!newName || !newCategory) {
        alert("يرجى إدخال اسم المورد وتصنيفه على الأقل");
        return;
    }

    const newSupplier: Supplier = {
        id: Date.now().toString(),
        name: newName,
        phone: newPhone || 'غير متوفر',
        category: newCategory,
        notes: newNotes
    };

    onAddSupplier(newSupplier);
    
    // Reset & Close
    setNewName('');
    setNewPhone('');
    setNewCategory('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const confirmDelete = (e: React.MouseEvent, supplier: Supplier) => {
    e.stopPropagation(); // Stop click from affecting parent containers
    setSupplierToDelete(supplier);
    setDeleteModalOpen(true);
  };

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Truck className="text-blue-500" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">الموردين</h2>
            <p className="text-slate-400">قائمة الشركاء والموزعين</p>
          </div>
        </div>
        
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} />
          <span>إضافة مورد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all group relative">
            
            <button 
                onClick={(e) => confirmDelete(e, supplier)}
                className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-slate-800/80 rounded-lg text-slate-400 hover:bg-red-500 hover:text-white transition-all z-20 shadow-sm"
                title="حذف المورد"
            >
                <Trash2 size={16} />
            </button>

            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-800 p-3 rounded-full text-blue-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                <Truck size={24} />
              </div>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                {supplier.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{supplier.name}</h3>
            
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Phone size={16} />
              <span className="font-mono dir-ltr">{supplier.phone}</span>
            </div>
            
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/50 h-20 overflow-y-auto">
                <p className="text-sm text-slate-500">
                    {supplier.notes || "لا توجد ملاحظات"}
                </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-sm font-medium transition-colors">
                    اتصال
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
            <div className="relative bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Truck className="text-blue-500" />
                        إضافة مورد جديد
                    </h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">اسم الشركة / المورد</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="مثال: شركة المراعي"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">التصنيف</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            placeholder="مثال: مشروبات، لحوم..."
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">رقم الهاتف</label>
                        <input 
                            type="tel" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none font-mono"
                            value={newPhone}
                            onChange={e => setNewPhone(e.target.value)}
                            placeholder="0550..."
                        />
                    </div>

                     <div>
                        <label className="block text-slate-400 text-sm mb-2">ملاحظات</label>
                        <textarea 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                            value={newNotes}
                            onChange={e => setNewNotes(e.target.value)}
                            placeholder="أوقات التوصيل، الخصومات..."
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setIsAddModalOpen(false)}
                        className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={handleSaveSupplier}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <Save size={18} />
                        حفظ المورد
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => supplierToDelete && onDeleteSupplier(supplierToDelete.id)}
        title="حذف مورد"
        message={`هل أنت متأكد من حذف المورد: ${supplierToDelete?.name}؟`}
        isDanger={true}
      />
    </div>
  );
};
