import { Product, Supplier, Customer } from './types';

export const CURRENCY = "د.ج";

// Helper for consistent placeholder images
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";

export const PRODUCTS: Product[] = [
  { id: '1', name: "برجر لحم", price: 500, costPrice: 350, icon: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", category: "Meals", stock: 50 },
  { id: '2', name: "بيتزا", price: 800, costPrice: 500, icon: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80", category: "Meals", stock: 20 },
  { id: '3', name: "بطاطس", price: 200, costPrice: 80, icon: "https://images.unsplash.com/photo-1541592103007-ceb5d59dd3ad?w=500&q=80", category: "Sides", stock: 100 },
  { id: '4', name: "مشروب غازي", price: 150, costPrice: 100, icon: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80", category: "Drinks", stock: 200 },
  { id: '5', name: "قهوة", price: 250, costPrice: 50, icon: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80", category: "Drinks", stock: 150 },
  { id: '6', name: "دونات", price: 300, costPrice: 150, icon: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80", category: "Dessert", stock: 40 },
  { id: '7', name: "آيس كريم", price: 200, costPrice: 100, icon: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80", category: "Dessert", stock: 60 },
  { id: '8', name: "سلطة", price: 350, costPrice: 200, icon: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80", category: "Healthy", stock: 15 },
  { id: '9', name: "هوت دوج", price: 400, costPrice: 250, icon: "https://images.unsplash.com/photo-1612392062122-839e5023e803?w=500&q=80", category: "Meals", stock: 35 },
  { id: '10', name: "عصير برتقال", price: 250, costPrice: 120, icon: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80", category: "Drinks", stock: 80 },
  { id: '11', name: "بان كيك", price: 300, costPrice: 100, icon: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80", category: "Dessert", stock: 25 },
  { id: '12', name: "تاكو", price: 450, costPrice: 300, icon: "https://images.unsplash.com/photo-1565299585323-38d68c8e1297?w=500&q=80", category: "Meals", stock: 30 },
];

export const SUPPLIERS: Supplier[] = [
  { id: '1', name: "شركة الأغذية الطازجة", phone: "0550-12-34-56", category: "لحوم وخضار", notes: "توصيل يومي صباحاً" },
  { id: '2', name: "مشروبات الجزائر", phone: "0770-98-76-54", category: "مشروبات", notes: "خصم عند طلب 100 صندوق" },
  { id: '3', name: "مخبز المدينة", phone: "0661-22-33-44", category: "مخبوزات", notes: "عطلة يوم الجمعة" },
];

export const CUSTOMERS: Customer[] = [
  { id: '1', name: "أحمد بن محمد", phone: "0555-11-22-33", totalSpent: 15000, visits: 12, lastVisit: "2023-10-05", debt: 2000 },
  { id: '2', name: "سارة العلي", phone: "0666-44-55-66", totalSpent: 5400, visits: 4, lastVisit: "2023-10-12", debt: 0 },
  { id: '3', name: "كريم يونس", phone: "0777-88-99-00", totalSpent: 800, visits: 1, lastVisit: "2023-10-14", debt: 0 },
];