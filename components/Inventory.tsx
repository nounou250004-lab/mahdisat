
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Package, Search, AlertCircle, PlusCircle, MinusCircle, Plus, X, Save, Trash2, Image as ImageIcon, Upload, Filter } from 'lucide-react';
import { CURRENCY } from '../constants';
import { ConfirmModal } from './ConfirmModal';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (id: string, newStock: number) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

// Default Placeholder image for new products if none selected
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";

export const Inventory: React.FC<InventoryProps> = ({ products, onUpdateStock, onAddProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdIcon, setNewProdIcon] = useState(DEFAULT_IMAGE);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map(p => p.category || 'غير مصنف')));
    return ['الكل', ...uniqueCats];
  }, [products]);

  const filteredProducts = products.filter(p => {
    const productCategory = p.category || 'غير مصنف';
    const matchesCategory = selectedCategory === 'الكل' || productCategory === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setNewProdIcon(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = () => {
    if (!newProdName || !newProdPrice || !newProdCost) {
        alert("يرجى ملء الحقول الأساسية (الاسم، السعر، التكلفة)");
        return;
    }

    const newProduct: Product = {
        id: Date.now().toString(),
        name: newProdName,
        price: parseFloat(newProdPrice),
        costPrice: parseFloat(newProdCost),
        stock: parseInt(newProdStock) || 0,
        category: newProdCategory || 'عام',
        icon: newProdIcon
    };

    onAddProduct(newProduct);
    
    // Reset and Close
    setNewProdName('');
    setNewProdPrice('');
    setNewProdCost('');
    setNewProdStock('');
    setNewProdCategory('');
    setNewProdIcon(DEFAULT_IMAGE);
    setIsAddModalOpen(false);
  };

  const confirmDelete = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent event bubbling
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <Package className="text-orange-500" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">إدارة المخزن</h2>
            <p className="text-slate-400">تتبع الكميات، الفئات، وتحديث المخزون</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text"
                placeholder="بحث عن منتج..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-colors shadow-lg shadow-orange-600/20"
            >
                <Plus size={20} />
                <span>إضافة منتج</span>
            </button>
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        <div className="flex items-center gap-2 text-slate-400 ml-2">
            <Filter size={16} />
            <span className="text-sm font-bold">تصفية حسب الفئة:</span>
        </div>
        {categories.map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full text-right min-w-[800px]">
          <thead className="bg-slate-800/50 text-slate-400">
            <tr>
              <th className="p-4 font-medium">المنتج</th>
              <th className="p-4 font-medium">الفئة</th>
              <th className="p-4 font-medium">السعر</th>
              <th className="p-4 font-medium">التكلفة</th>
              <th className="p-4 font-medium">حالة المخزون</th>
              <th className="p-4 font-medium text-center">الكمية الحالية</th>
              <th className="p-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                        src={product.icon} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                        }}
                    />
                    <span className="font-bold text-slate-200">{product.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-800 rounded text-sm text-slate-300 border border-slate-700">
                    {product.category || 'غير مصنف'}
                  </span>
                </td>
                <td className="p-4 text-emerald-400 font-mono">
                  {product.price} {CURRENCY}
                </td>
                 <td className="p-4 text-slate-400 font-mono">
                  {product.costPrice} {CURRENCY}
                </td>
                <td className="p-4">
                  {product.stock <= 10 ? (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full w-fit">
                      <AlertCircle size={16} />
                      <span className="text-sm font-bold">منخفض</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-fit">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm font-bold">متوفر</span>
                    </div>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className={`text-xl font-bold ${product.stock <= 10 ? 'text-red-400' : 'text-white'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 5))}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      title="-5"
                    >
                      <MinusCircle size={20} />
                    </button>
                    <button 
                       onClick={() => onUpdateStock(product.id, product.stock + 5)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"
                      title="+5"
                    >
                      <PlusCircle size={20} />
                    </button>
                    <div className="w-px h-6 bg-slate-700 mx-2" />
                    <button 
                       onClick={(e) => confirmDelete(e, product)}
                      className="p-2 bg-red-500/10 hover:bg-red-500 rounded-lg text-red-500 hover:text-white transition-colors"
                      title="حذف المنتج"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                        لا توجد منتجات في هذه الفئة.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Add Product Modal */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
            <div className="relative bg-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PlusCircle className="text-orange-500" />
                        إضافة منتج جديد
                    </h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                        <label className="block text-slate-400 text-sm mb-2">اسم المنتج</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
                            value={newProdName}
                            onChange={e => setNewProdName(e.target.value)}
                            placeholder="مثال: برجر دجاج"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">سعر البيع</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none"
                            value={newProdPrice}
                            onChange={e => setNewProdPrice(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">سعر التكلفة</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-red-500 focus:outline-none"
                            value={newProdCost}
                            onChange={e => setNewProdCost(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">الكمية الأولية</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
                            value={newProdStock}
                            onChange={e => setNewProdStock(e.target.value)}
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-2">الفئة</label>
                        <input 
                            list="categories-list"
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-600 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none"
                            value={newProdCategory}
                            onChange={e => setNewProdCategory(e.target.value)}
                            placeholder="اختر أو اكتب..."
                        />
                        <datalist id="categories-list">
                            {categories.filter(c => c !== 'الكل').map(c => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>

                     <div className="col-span-2">
                        <label className="block text-slate-400 text-sm mb-2">صورة المنتج</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-600 flex-shrink-0">
                                <img 
                                    src={newProdIcon} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <Upload size={18} />
                                <span>رفع صورة من الجهاز</span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden" 
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button 
                        onClick={() => setIsAddModalOpen(false)}
                        className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-bold"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={handleSaveProduct}
                        className="flex-1 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
                    >
                        <Save size={18} />
                        حفظ المنتج
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => productToDelete && onDeleteProduct(productToDelete.id)}
        title="حذف منتج"
        message={`هل أنت متأكد من حذف المنتج: ${productToDelete?.name}؟`}
        isDanger={true}
      />
    </div>
  );
};
