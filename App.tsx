import React, { useState, useCallback } from 'react';
import { Product, CartItem, Supplier, Customer, PaymentMethod, Transaction } from './types';
import { PRODUCTS, SUPPLIERS, CUSTOMERS } from './constants';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { ReceiptModal } from './components/ReceiptModal';
import { Navigation, ViewType } from './components/Navigation';
import { Inventory } from './components/Inventory';
import { Suppliers } from './components/Suppliers';
import { Customers } from './components/Customers';
import { Financials } from './components/Financials';
import { LayoutGrid, UtensilsCrossed } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [currentView, setCurrentView] = useState<ViewType>('pos');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // Cart Logic
  const handleAddToCart = useCallback((product: Product) => {
    // Check local stock
    const currentProduct = products.find(p => p.id === product.id);
    const cartItem = cart.find(item => item.id === product.id);
    const currentQtyInCart = cartItem ? cartItem.qty : 0;

    if (currentProduct && currentQtyInCart >= currentProduct.stock) {
        alert("عذراً، لا توجد كمية كافية في المخزن");
        return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  }, [cart, products]);

  const handleRemoveOne = useCallback((product: Product) => {
    setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem && existingItem.qty > 1) {
            return prevCart.map((item) => 
                item.id === product.id ? { ...item, qty: item.qty - 1 } : item
            );
        }
        return prevCart.filter((item) => item.id !== product.id);
    });
  }, []);

  const handleClearCart = useCallback(() => {
    if (cart.length > 0 && window.confirm("هل أنت متأكد من مسح السلة؟")) {
        setCart([]);
    }
  }, [cart.length]);

  const handleCheckout = useCallback((method: PaymentMethod, customerId?: string) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const cost = cart.reduce((acc, item) => acc + (item.costPrice * item.qty), 0);
    const profit = total - cost;

    // 1. Update Stock
    const newProducts = products.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
    });
    setProducts(newProducts);

    // 2. Handle Debt if Credit
    if (method === 'credit' && customerId) {
        setCustomers(prev => prev.map(c => 
            c.id === customerId 
                ? { ...c, debt: c.debt + total, totalSpent: c.totalSpent + total, visits: c.visits + 1, lastVisit: new Date().toISOString().split('T')[0] } 
                : c
        ));
    } else if (customerId && method === 'cash') {
        // Track stats for registered customer paying cash
         setCustomers(prev => prev.map(c => 
            c.id === customerId 
                ? { ...c, totalSpent: c.totalSpent + total, visits: c.visits + 1, lastVisit: new Date().toISOString().split('T')[0] } 
                : c
        ));
    }

    // 3. Record Transaction
    const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        total,
        profit,
        type: 'sale',
        paymentMethod: method,
        customerId: customerId,
        items: [...cart]
    };
    setTransactions(prev => [...prev, newTransaction]);

    // Show Receipt
    setLastTransaction(newTransaction);
    setShowReceipt(true);
    
    // Clear Cart (will be done when modal closes or immediately based on UX)
    // Here we clear it immediately to be ready for next order, the modal holds the data in lastTransaction
    setCart([]);
  }, [cart, products]);

  const handleRepayDebt = useCallback((customerId: string, amount: number) => {
    // Update Customer
    setCustomers(prev => prev.map(c => 
        c.id === customerId ? { ...c, debt: Math.max(0, c.debt - amount) } : c
    ));

    // Record Transaction
    const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        total: amount,
        profit: 0, // Repayment is not new profit, but cash flow (simplified here)
        type: 'repayment',
        paymentMethod: 'cash',
        customerId
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    // Show Receipt for Repayment
    setLastTransaction(newTransaction);
    setShowReceipt(true);
  }, []);

  // --- Management Logic (Add/Delete/Update) ---

  // Inventory
  const handleUpdateStock = useCallback((id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  }, []);

  const handleAddProduct = useCallback((newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const handleDeleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Customers
  const handleAddCustomer = useCallback((newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  const handleDeleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  // Suppliers
  const handleAddSupplier = useCallback((newSupplier: Supplier) => {
    setSuppliers(prev => [...prev, newSupplier]);
  }, []);

  const handleDeleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  }, []);


  // --- Render Views ---

  const renderContent = () => {
    switch (currentView) {
      case 'pos':
        return (
          <div className="flex flex-1 h-full overflow-hidden">
            {/* POS Main Content (Products) */}
            <main className="flex-1 flex flex-col h-full relative order-1 md:order-2">
                <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center px-8 justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg">
                            <UtensilsCrossed className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-wide uppercase">Shop 2 Mahdisat</h1>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 text-slate-400 bg-slate-800 py-2 px-4 rounded-full border border-slate-700">
                        <LayoutGrid size={18} />
                        <span className="text-sm font-medium">قائمة الطعام</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAdd={handleAddToCart} 
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Cart Sidebar */}
            <aside className="hidden md:flex w-96 flex-col z-20 h-full order-2 md:order-1 border-l-0 border-r border-slate-800">
                <Cart 
                    cart={cart}
                    customers={customers}
                    onAdd={handleAddToCart}
                    onRemoveOne={handleRemoveOne}
                    onClear={handleClearCart}
                    onCheckout={handleCheckout}
                />
            </aside>
            
            {/* Mobile Cart Sheet */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-1/3 z-30 border-t border-slate-700">
                 <Cart 
                    cart={cart}
                    customers={customers}
                    onAdd={handleAddToCart}
                    onRemoveOne={handleRemoveOne}
                    onClear={handleClearCart}
                    onCheckout={handleCheckout}
                />
            </div>
          </div>
        );
      case 'financials':
          return <Financials transactions={transactions} customers={customers} />;
      case 'inventory':
        return (
            <Inventory 
                products={products} 
                onUpdateStock={handleUpdateStock} 
                onAddProduct={handleAddProduct} 
                onDeleteProduct={handleDeleteProduct}
            />
        );
      case 'suppliers':
        return (
            <Suppliers 
                suppliers={suppliers} 
                onAddSupplier={handleAddSupplier}
                onDeleteSupplier={handleDeleteSupplier}
            />
        );
      case 'customers':
        return (
            <Customers 
                customers={customers} 
                onRepayDebt={handleRepayDebt} 
                onAddCustomer={handleAddCustomer} 
                onDeleteCustomer={handleDeleteCustomer}
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <Navigation activeView={currentView} onViewChange={setCurrentView} />
      {renderContent()}

      {/* Receipt Modal handles printing */}
      <ReceiptModal 
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={lastTransaction}
        customer={customers.find(c => c.id === lastTransaction?.customerId)}
      />
    </div>
  );
};

export default App;