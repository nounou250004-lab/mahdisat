import { Product, Supplier, Customer } from './types';

export const CURRENCY = "د.ج";

export const PRODUCTS: Product[] = [
  { id: '1', name: "برجر لحم", price: 500, costPrice: 350, icon: "🍔", category: "Meals", stock: 50 },
  { id: '2', name: "بيتزا", price: 800, costPrice: 500, icon: "🍕", category: "Meals", stock: 20 },
  { id: '3', name: "بطاطس", price: 200, costPrice: 80, icon: "🍟", category: "Sides", stock: 100 },
  { id: '4', name: "مشروب غازي", price: 150, costPrice: 100, icon: "🥤", category: "Drinks", stock: 200 },
  { id: '5', name: "قهوة", price: 250, costPrice: 50, icon: "☕", category: "Drinks", stock: 150 },
  { id: '6', name: "دونات", price: 300, costPrice: 150, icon: "🍩", category: "Dessert", stock: 40 },
  { id: '7', name: "آيس كريم", price: 200, costPrice: 100, icon: "🍦", category: "Dessert", stock: 60 },
  { id: '8', name: "سلطة", price: 350, costPrice: 200, icon: "🥗", category: "Healthy", stock: 15 },
  { id: '9', name: "هوت دوج", price: 400, costPrice: 250, icon: "🌭", category: "Meals", stock: 35 },
  { id: '10', name: "عصير برتقال", price: 250, costPrice: 120, icon: "🍊", category: "Drinks", stock: 80 },
  { id: '11', name: "بان كيك", price: 300, costPrice: 100, icon: "🥞", category: "Dessert", stock: 25 },
  { id: '12', name: "تاكو", price: 450, costPrice: 300, icon: "🌮", category: "Meals", stock: 30 },
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