import React from 'react';
import { Store, Package, Users, Truck, TrendingUp } from 'lucide-react';

export type ViewType = 'pos' | 'inventory' | 'suppliers' | 'customers' | 'financials';

interface NavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'pos', label: 'نقاط البيع', icon: Store },
    { id: 'financials', label: 'الأرباح', icon: TrendingUp },
    { id: 'inventory', label: 'المخزن', icon: Package },
    { id: 'customers', label: 'الزبائن', icon: Users },
    { id: 'suppliers', label: 'الموردين', icon: Truck },
  ];

  return (
    <nav className="w-24 bg-slate-900 border-l border-slate-800 flex flex-col items-center py-6 shrink-0 z-50 h-full">
      <div className="mb-8 p-2 bg-indigo-600 rounded-xl">
        <Store className="text-white" size={28} />
      </div>
      
      <div className="flex flex-col w-full gap-4 px-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-slate-800 text-indigo-400 shadow-lg border border-slate-700' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <item.icon 
                size={24} 
                className={`mb-1 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : ''}`} 
              />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            shop 2 mahdisat
        </p>
      </div>
    </nav>
  );
};