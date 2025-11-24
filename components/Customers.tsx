import React, { useState } from 'react';
import { Customer } from '../types';
import { Users, Phone, Calendar, Star, Plus, Wallet, AlertCircle, X, Check, Save, UserPlus, Trash2 } from 'lucide-react';
import { CURRENCY } from '../constants';

interface CustomersProps {
  customers: Customer[];
  onRepayDebt: (customerId: string, amount: number) => void;
  onAddCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const Customers: React.FC<CustomersProps> = ({ customers, onRepayDebt, onAddCustomer, onDeleteCustomer }) => {
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [repayAmount, setRepayAmount] = useState('');

  // Add Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const openRepayModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setRepayAmount('');
    setRepayModalOpen(true);
  };

  const handleRepaySubmit = () => {
    if (selectedCustomer && repayAmount) {
        const amount = parseFloat(repayAmount);
        if (amount > 0 && amount <= selectedCustomer.debt) {
            onRepayDebt(selectedCustomer.id, amount);
            setRepayModalOpen(false);
        } else {
            alert("المبلغ غير صحيح أو أكبر من الدين الحالي");
        }
    }
  };

  const handleAddSubmit = () => {
    if(!newCustName) {
        alert("يرجى إدخال اسم الزبون");
        return;
    }

    const newCustomer: Customer = {
        id: Date.now().toString(),
        name: newCustName,
        phone: newCustPhone || 'لا يوجد رقم',
        totalSpent: 0,
        visits: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        debt: 0
    };

    onAddCustomer(newCustomer);
    
    // Reset & Close
    setNewCustName('');
    setNewCustPhone('');
    setAddModalOpen(false);
  };

  const confirmDelete = (e: React.MouseEvent, customer: Customer) => {
    e.stopPropagation(); // Stop bubbling
    
    if (customer.debt > 0) {
        if (window.confirm(`تنبيه هام! هذا الزبون مدين بمبلغ ${customer.debt}. هل أنت متأكد من الحذف؟ سيتم فقدان بيانات الدين.`)) {
            onDeleteCustomer(customer.id);
        }
    } else {
        if (window.confirm(`هل أنت متأكد من حذف الزبون: ${customer.name}؟`)) {
            onDeleteCustomer(customer.id);
        }
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500/20 rounded-xl">
            <Users className="text-pink-500" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">الزبائن</h2>
            <p className="text-slate-400">سجل العملاء، الديون، والولاء</p>
          </div>
        </div>
        
        <button 
            onClick={() => setAddModalOpen(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-colors shadow-lg shadow-pink-600/20"
        >
          <Plus size={20} />
          <span>إضافة زبون</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className={`relative bg-slate-900 border ${customer.debt > 0 ? 'border-red-900/50' : 'border-slate-800'} p-6 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all group flex flex-col`}>
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xl font-bold text-pink-500 border border-pink-500/20">
                        {customer.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{customer.name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <Phone size={12} />
                            <span className="font-mono">{customer.phone}</span>
                        </div>
                    </div>
                </div>
                {customer.totalSpent > 5000 && (
                    <div className="bg-yellow-500/20 text-yellow-500 p-1.5 rounded-lg" title="زبون مميز">
                        <Star size={18} fill="currentColor" />
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <span className="text-xs text-slate-500 block mb-1">إجمالي المشتريات</span>
                    <span className="text-emerald-400 font-bold font-mono">{customer.totalSpent} {CURRENCY}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <span className="text-xs text-slate-500 block mb-1">عدد الزيارات</span>
                    <span className="text-white font-bold font-mono">{customer.visits}</span>
                </div>
            </div>

            {/* Debt Section */}
            {customer.debt > 0 ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-red-400 mb-1">
                            <AlertCircle size={14} />
                            <span className="text-xs font-bold">مبلغ الدين (الكريدي)</span>
                        </div>
                        <span className="text-xl font-bold text-red-500 font-mono">{customer.debt} {CURRENCY}</span>
                    </div>
                    <button 
                        onClick={() => openRepayModal(customer)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                        تسديد
                    </button>
                </div>
            ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mb-4 text-center">
                    <span className="text-emerald-500/70 text-sm font-medium">الذمة المالية خالصة ✅</span>
                </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={14} />
                    <span>{customer.lastVisit}</span>
                </div>
                
                <button 
                    onClick={(e) => confirmDelete(e, customer)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    title="حذف الزبون"
                >
                    <Trash2 size={16} />
                    <span>حذف</span>
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Repayment Modal */}
      {repayModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setRepayModalOpen(false)} />
            <div className="relative bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">تسديد دين: {selectedCustomer.name}</h3>
                    <button onClick={() => setRepayModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl mb-6 text-center border border-slate-800">
                    <span className="text-slate-400 text-sm block mb-1">الدين الحالي</span>
                    <span className="text-3xl font-bold text-red-500 font-mono">{selectedCustomer.debt} {CURRENCY}</span>
                </div>

                <div className="mb-6">
                    <label className="block text-slate-300 text-sm mb-2">المبلغ المدفوع</label>
                    <input 
                        type="number" 
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl p-4 text-xl text-white focus:border-emerald-500 focus:outline-none font-mono"
                        placeholder="0.00"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setRepayModalOpen(false)}
                        className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={handleRepaySubmit}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        تأكيد التسديد
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
            <div className="relative bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <UserPlus className="text-pink-500" />
                        إضافة زبون جديد
                    </h3>
                    <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">اسم الزبون</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                            value={newCustName}
                            onChange={e => setNewCustName(e.target.value)}
                            placeholder="الاسم الثلاثي"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">رقم الهاتف</label>
                        <input 
                            type="tel" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none font-mono"
                            value={newCustPhone}
                            onChange={e => setNewCustPhone(e.target.value)}
                            placeholder="0550..."
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setAddModalOpen(false)}
                        className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={handleAddSubmit}
                        className="flex-1 py-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700 font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
                    >
                        <Save size={18} />
                        حفظ الزبون
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};