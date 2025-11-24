import React, { useMemo } from 'react';
import { Transaction, Customer } from '../types';
import { CURRENCY } from '../constants';
import { TrendingUp, DollarSign, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface FinancialsProps {
  transactions: Transaction[];
  customers: Customer[];
}

export const Financials: React.FC<FinancialsProps> = ({ transactions, customers }) => {
  const stats = useMemo(() => {
    const totalSales = transactions
      .filter(t => t.type === 'sale')
      .reduce((acc, t) => acc + t.total, 0);
      
    const totalProfit = transactions
      .filter(t => t.type === 'sale')
      .reduce((acc, t) => acc + t.profit, 0);

    const totalDebt = customers.reduce((acc, c) => acc + c.debt, 0);

    return { totalSales, totalProfit, totalDebt };
  }, [transactions, customers]);

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-500/20 rounded-xl">
          <TrendingUp className="text-emerald-500" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">الأرباح والتقارير</h2>
          <p className="text-slate-400">ملخص الأداء المالي والديون</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign size={100} />
            </div>
            <p className="text-slate-400 font-medium mb-2">إجمالي المبيعات</p>
            <h3 className="text-3xl font-black text-white">{stats.totalSales.toLocaleString()} {CURRENCY}</h3>
        </div>

        {/* Profit */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={100} className="text-emerald-500" />
            </div>
            <p className="text-slate-400 font-medium mb-2">صافي الأرباح</p>
            <h3 className="text-3xl font-black text-emerald-400">{stats.totalProfit.toLocaleString()} {CURRENCY}</h3>
        </div>

        {/* Debts */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet size={100} className="text-red-500" />
            </div>
            <p className="text-slate-400 font-medium mb-2">ديون عند الزبائن</p>
            <h3 className="text-3xl font-black text-red-400">{stats.totalDebt.toLocaleString()} {CURRENCY}</h3>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <h3 className="text-xl font-bold text-white mb-4 mt-8">آخر العمليات</h3>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-right">
          <thead className="bg-slate-800/50 text-slate-400">
            <tr>
              <th className="p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium">النوع</th>
              <th className="p-4 font-medium">القيمة</th>
              <th className="p-4 font-medium">طريقة الدفع</th>
              <th className="p-4 font-medium">تفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.slice().reverse().map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 text-sm font-mono dir-ltr text-right">
                    {new Date(t.date).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })} - {new Date(t.date).toLocaleDateString('en-GB')}
                </td>
                <td className="p-4">
                    {t.type === 'sale' ? (
                        <span className="flex items-center gap-2 text-emerald-400">
                            <ArrowUpRight size={16} /> بيع
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 text-blue-400">
                            <ArrowDownLeft size={16} /> تسديد دين
                        </span>
                    )}
                </td>
                <td className="p-4 font-bold text-white font-mono">{t.total} {CURRENCY}</td>
                <td className="p-4 text-sm text-slate-400">
                    {t.paymentMethod === 'cash' ? 'نقد' : 'أجل (دين)'}
                </td>
                <td className="p-4 text-sm text-slate-500">
                    {t.type === 'sale' 
                        ? `${t.items?.length || 0} منتجات`
                        : `زبون رقم ${t.customerId}`
                    }
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">لا توجد عمليات مسجلة بعد</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};