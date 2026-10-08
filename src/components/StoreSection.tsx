import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreItem } from '../types';
import { 
  ShoppingCart, Plus, Minus, X, Check, ShieldCheck, ShoppingBag, Info, AlertTriangle, Filter,
  Home, LayoutGrid, HelpCircle, ArrowLeft, BadgePercent, Flame, Sparkles, Receipt, Truck, FileText, Phone, Tag, Award, ShieldAlert, Heart, Building2, Wrench, Hammer
} from 'lucide-react';

interface StoreSectionProps {
  storeItems: StoreItem[];
  cart: { item: StoreItem; quantity: number }[];
  onAddToCart: (item: StoreItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateCartQuantity: (itemId: string, qty: number) => void;
  onCheckout: () => void;
}

export default function StoreSection({
  storeItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onCheckout
}: StoreSectionProps) {
  const [subTab, setSubTab] = useState<'home' | 'categories' | 'more'>('home');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'construction' | 'heavy' | 'tools'>('all');
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Bulk pricing state for active product details
  const [bulkQty, setBulkQty] = useState(1);

  // Form info for checkout
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const filteredItems = storeItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const cartTotal = cart.reduce((acc, current) => {
    return acc + (current.item.price * current.quantity);
  }, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !deliveryAddress) {
      alert('الرجاء إدخال كافة المعلومات لإتمام عملية حجز المواد وشحنها.');
      return;
    }

    onCheckout();
    setIsCheckoutSuccess(true);
    setIsCartOpen(false);

    // Reset checkout info
    setClientName('');
    setClientPhone('');
    setDeliveryAddress('');
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'construction': return 'مواد إنشائية أساسية';
      case 'heavy': return 'كرفانات ومعدات ثقيلة';
      case 'tools': return 'أدوات ومستلزمات';
      default: return 'الكل';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-IQ') + ' د.ع';
  };

  // Helper to render product cards
  const renderProductCard = (item: StoreItem) => {
    const discountPercentage = item.originalPrice 
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
      : 0;

    return (
      <div
        key={item.id}
        onClick={() => {
          setBulkQty(1); // reset bulk calculator
          setSelectedProduct(item);
        }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between relative group"
      >
        {/* Badges Overlay */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {item.isOffer && (
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 px-2.5 py-0.5 rounded-lg text-[9px] font-black shadow-sm flex items-center gap-1">
              <Flame className="h-2.5 w-2.5 animate-pulse" />
              <span>عرض خاص</span>
            </span>
          )}
          {item.isNew && (
            <span className="bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-lg text-[9px] font-black shadow-sm flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              <span>وصل حديثاً</span>
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-lg text-[9px] font-black shadow-sm">
              خصم {discountPercentage}%-
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative h-40 bg-slate-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white">
            {getCategoryLabel(item.category)}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-1 text-right">
            <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition line-clamp-1 leading-snug">
              {item.name}
            </h4>
            <span className="text-[10px] text-slate-400 block">الوحدة: {item.unit}</span>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed h-8">
              {item.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-right">
              {item.originalPrice && item.originalPrice > item.price ? (
                <>
                  <span className="text-[9px] text-slate-400 line-through block font-mono">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-xs font-black text-orange-600 block font-mono">
                    {formatPrice(item.price)}
                  </span>
                </>
              ) : (
                <span className="text-xs font-black text-amber-600 block font-mono">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (item.available) {
                  onAddToCart(item);
                  alert(`تمت إضافة [${item.name}] إلى سلة التسوق.`);
                }
              }}
              disabled={!item.available}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>إضافة للسلة</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32 font-sans text-slate-900" id="store-section-container">
      
      {/* 1. TOP NAVIGATION BAR inside the Store section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between shadow-sm" dir="rtl">
        <div className="flex gap-1.5">
          <button
            onClick={() => setSubTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'home'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>الرئيسية</span>
          </button>
          
          <button
            onClick={() => setSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>التصنيفات</span>
          </button>

          <button
            onClick={() => setSubTab('more')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'more'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>قسم المزيد</span>
          </button>
        </div>

        {/* Cart Quick trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-700 flex items-center gap-1.5 shadow-sm cursor-pointer transition"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-xs font-black hidden xs:inline">سلة المواد</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 bg-orange-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-pulse">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {isCheckoutSuccess ? (
        /* Checkout Success Dialog */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-xl"
          dir="rtl"
        >
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-600">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900">تم إرسال طلب الشراء بنجاح!</h2>
            <p className="text-xs text-slate-500">سيقوم كادر المبيعات واللوجستيات بمطابقة طلبك وتحديد كلفة الشحن المناسبة لعنوانك.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto shadow-sm">
            سيتم الاتصال بك خلال <span className="text-amber-600 font-bold">15 دقيقة</span> لتنسيق تفريغ شحنة المواد الإنشائية ونقلها بأمان عبر شاحناتنا الكبيرة.
          </div>

          <button
            onClick={() => setIsCheckoutSuccess(false)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer"
          >
            العودة للمتجر
          </button>
        </motion.div>
      ) : (
        /* Render Selected SubTab View */
        <AnimatePresence mode="wait">
          {subTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              dir="rtl"
            >
              {/* 2. PROMOTIONAL BANNER */}
              <div className="relative bg-gradient-to-r from-slate-900 to-amber-950 rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_60%)] pointer-events-none" />
                <div className="text-right space-y-3 max-w-lg z-10">
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase inline-block">
                    🔥 أضخم أسطول آليات ومواد في العراق
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    مواد إنشائية ممتازة مجهزة بضغطة زر واحدة
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    اطلب السمنت المقاوم، حديد التسليح التركي، والرمال الكربلائية بأعلى مطابقة مختبرية وأسعار حقيقية مدعومة وتوصيل مباشر لموقع العمل.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-bold">
                      <Truck className="h-3.5 w-3.5 text-amber-500" />
                      <span>تجهيز وسفلتة لكافة المحافظات</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-bold">
                      <Award className="h-3.5 w-3.5 text-emerald-500" />
                      <span>فحص المركز الوطني للمختبرات</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative w-full md:w-56 h-36 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-700 shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600" 
                    alt="Promotional Banner Machinery"
                    className="h-full w-full object-cover opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>
              </div>

              {/* 3. CATEGORIES QUICK SELECTOR GRID */}
              <div className="bg-white border border-slate-150 rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <LayoutGrid className="h-4.5 w-4.5 text-amber-500" />
                    <span>تصفح المواد حسب التصنيف</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-extrabold">
                    {storeItems.length} مواد متوفرة
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3" dir="rtl">
                  {[
                    { 
                      id: 'construction', 
                      label: 'مواد إنشائية', 
                      subLabel: 'سمنت، حديد، رمل',
                      count: storeItems.filter(i => i.category === 'construction').length, 
                      icon: Building2 
                    },
                    { 
                      id: 'heavy', 
                      label: 'كرفانات وتجهيزات ثقيلة', 
                      subLabel: 'كرفانات، حاويات خزن',
                      count: storeItems.filter(i => i.category === 'heavy').length, 
                      icon: Home 
                    },
                    { 
                      id: 'tools', 
                      label: 'أدوات ومستلزمات', 
                      subLabel: 'معدات نجارة وورش',
                      count: storeItems.filter(i => i.category === 'tools').length, 
                      icon: Wrench 
                    },
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id as any);
                          setSubTab('categories');
                        }}
                        className="bg-slate-50 hover:bg-amber-500/10 border border-slate-200 hover:border-amber-500/50 p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-xs"
                      >
                        <div className="h-8 w-8 sm:h-9 sm:w-9 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1.5">
                          <CatIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-900 block leading-tight">
                          {cat.label}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium mt-0.5">
                          {cat.subLabel} ({cat.count} مواد)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. OFFERS SECTION (قسم العروض) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                    <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                      <Flame className="h-4.5 w-4.5 text-orange-500" />
                      <span>أقوى العروض الحالية</span>
                    </h3>
                  </div>
                  <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md font-bold">شحن فوري مخفض</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {storeItems.filter(item => item.isOffer).map(item => renderProductCard(item))}
                </div>
              </div>

              {/* 5. NEW PRODUCTS SECTION (قسم المنتجات الحديثة) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    <span>المنتجات الحديثة المضافة حديثاً</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">آخر تحديث: اليوم</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {storeItems.filter(item => item.isNew).map(item => renderProductCard(item))}
                </div>
              </div>

              {/* 6. DISCOUNTED PRODUCTS SECTION (قسم المنتجات المخفضة) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                    <BadgePercent className="h-4.5 w-4.5 text-rose-500" />
                    <span>تخفيضات ومواد بأسعار مصفاة</span>
                  </h3>
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-black">وفر أكثر</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {storeItems.filter(item => item.originalPrice && item.originalPrice > item.price).map(item => renderProductCard(item))}
                </div>
              </div>
            </motion.div>
          )}

          {subTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
              dir="rtl"
            >
              {/* Category selector row */}
              <div className="bg-white border border-slate-150 rounded-3xl p-3.5 sm:p-4 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3" dir="rtl">
                  {[
                    { id: 'all', label: 'جميع المواد', icon: LayoutGrid, count: storeItems.length },
                    { id: 'construction', label: 'مواد إنشائية', icon: Building2, count: storeItems.filter(i => i.category === 'construction').length },
                    { id: 'heavy', label: 'كرفانات وتجهيزات', icon: Home, count: storeItems.filter(i => i.category === 'heavy').length },
                    { id: 'tools', label: 'أدوات ومستلزمات', icon: Wrench, count: storeItems.filter(i => i.category === 'tools').length }
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-xs ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-black'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-500/10 hover:border-amber-500/50'
                        }`}
                      >
                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 mb-1.5 ${
                          isSelected ? 'bg-slate-950/15 text-slate-950' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          <CatIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold block leading-tight">
                          {cat.label}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] block font-medium mt-0.5 ${
                          isSelected ? 'text-slate-900/80' : 'text-slate-400'
                        }`}>
                          ({cat.count} مواد)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtered Grid */}
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center space-y-2 border border-slate-200 text-right">
                  <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="text-xs font-black text-slate-850">لا يوجد منتجات في هذا القسم حالياً</h4>
                  <p className="text-[10px] text-slate-500">جرب البحث في قسم آخر أو تصفح كافة المواد الإنشائية.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map(item => renderProductCard(item))}
                </div>
              )}
            </motion.div>
          )}

          {subTab === 'more' && (
            <motion.div
              key="more"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
              dir="rtl"
            >
              <div className="text-right">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">مركز معلومات مبيعات رافد</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">سياسات الضمان، التوصيل والدعم والشفافية اللوجستية</h3>
              </div>

              {/* Information Cards suited for an elegant construction e-commerce store */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 1: Return policy */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-amber-500/20 transition">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-right">
                    <h4 className="text-xs font-black text-slate-900">سياسة الإرجاع واستبدال الفائض</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      في رافد، نتفهم تقلبات حاجة العمل. يمكنك إرجاع أو استبدال أي كميات فائضة أو غير مستخدمة من السمنت المعبأ أو حديد التسليح خلال 14 يوماً من التجهيز، شريطة خزنها السليم في موقع العمل وحمايتها من الرطوبة والمياه.
                    </p>
                  </div>
                </div>

                {/* Card 2: Logistics and freight */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-blue-500/20 transition">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-right">
                    <h4 className="text-xs font-black text-slate-900">الشحن اللوجستي والتفريغ بالموقع</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      نملك أسطول توصيل متكامل يتسع لجميع الحمولات (قلابات 5 طن للفروع الضيقة، وتريلات 18-30 طن للمشاريع الكبيرة). يتم تحديد كلفة الشحن بشكل شفاف ورمزي بناءً على مسافة موقعك الجغرافي وقت تأكيد الحجز الهاتفي.
                    </p>
                  </div>
                </div>

                {/* Card 3: Quality guarantee */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-emerald-500/20 transition">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-right">
                    <h4 className="text-xs font-black text-slate-900">مطابقة الفحص المختبري والجودة</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      كافة المواد الإنشائية المتوفرة في المتجر (سمنت، حديد، رمل كربلائي، سبيس خابط) تخضع دورياً لفحص المطابقة والجودة القياسية العراقية الصادرة عن المركز الوطني للمختبرات الإنشائية، ومرفقة بشهادات فحص موثقة.
                    </p>
                  </div>
                </div>

                {/* Card 4: Support & custom quotes */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-orange-500/20 transition">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 border border-orange-100">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-right">
                    <h4 className="text-xs font-black text-slate-900">طلبات الكميات الضخمة والمشاريع</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      إذا كنت صاحب مشروع استثماري كبير، مستشفى، أو مجمع سكني وتحتاج كميات ضخمة خارج نطاق المتجر الاعتيادي، يمكنك الاتصال بقسم المبيعات المباشر للحصول على تسعيرة خاصة جداً وشهادات منشأ وتسهيلات بالدفع والتمويل.
                    </p>
                  </div>
                </div>

              </div>

              {/* Informative trust notice */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-right space-y-1">
                  <h5 className="text-xs font-black text-slate-900">تسوق آمن وموثوق بالكامل</h5>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    نحن في رافد لا نطلب أي دفع مسبق عبر التطبيق. يتم حجز المواد وتثبيت الطلب ومطابقة معلومات الموقع مجاناً، ويتم تسديد المبالغ والوصولات رسمياً عند وصول شاحنات التفريغ وفحص المواد في موقعك الإنشائي.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 7. DETAILED PRODUCT PAGE / MODAL with detailed price information */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-right font-sans"
              dir="rtl"
            >
              {/* Modal Top Banner with Image */}
              <div className="relative h-48 sm:h-56 bg-slate-100 flex-shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Badges Overlay */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  {selectedProduct.isOffer && (
                    <span className="bg-orange-500 text-slate-950 px-2.5 py-1 rounded-xl text-[10px] font-black shadow">
                      عرض خاص
                    </span>
                  )}
                  {selectedProduct.isNew && (
                    <span className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl text-[10px] font-black shadow">
                      جديد
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-full text-slate-700 hover:text-slate-950 transition shadow"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                
                {/* Title and Category */}
                <div className="space-y-1">
                  <span className="text-[10px] bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2.5 py-0.5 rounded-lg font-black inline-block">
                    {getCategoryLabel(selectedProduct.category)}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-snug">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>متوفر للتجهيز الفوري وشحن المحافظات</span>
                  </div>
                </div>

                {/* DETAILED PRICE SECTION (تفاصيل السعر) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">تفاصيل تسعيرة المنتج:</span>
                  
                  <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">السعر المخفض للوحدة</span>
                      <span className="text-xl font-black text-orange-600 font-mono">
                        {formatPrice(selectedProduct.price)}
                      </span>
                    </div>

                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price ? (
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block font-bold">السعر الأصلي السابق</span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          {formatPrice(selectedProduct.originalPrice)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-black block mt-0.5">
                          وفرت {formatPrice(selectedProduct.originalPrice - selectedProduct.price)} !
                        </span>
                      </div>
                    ) : (
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block font-bold">الوحدة الإنشائية</span>
                        <span className="text-xs font-black text-slate-800">
                          {selectedProduct.unit}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* INTERACTIVE BULK PRICING CALCULATOR */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-800">محاكي حساب الأسعار للكميات والطلب الإجمالي:</span>
                      
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setBulkQty(prev => prev + 1)}
                          className="p-1 hover:bg-slate-50 rounded-lg text-slate-600"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={bulkQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setBulkQty(isNaN(val) || val < 1 ? 1 : val);
                          }}
                          className="w-12 text-center text-xs font-black font-sans text-slate-800 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setBulkQty(prev => Math.max(1, prev - 1))}
                          className="p-1 hover:bg-slate-50 rounded-lg text-slate-600"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Calculation breakdown results */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">الكمية المطلوبة:</span>
                        <span className="font-black text-slate-800 font-mono">{bulkQty} {selectedProduct.unit}</span>
                      </div>

                      {/* Extra volume discount logic */}
                      {bulkQty >= 20 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>خصم الكميات الإضافي (حجم كبير):</span>
                          <span>{bulkQty >= 50 ? '5%-' : '3%-'}</span>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-slate-100 pt-2 font-black">
                        <span className="text-slate-800">السعر الإجمالي المخمن:</span>
                        <span className="text-amber-600 font-mono">
                          {formatPrice(
                            selectedProduct.price * bulkQty * (bulkQty >= 50 ? 0.95 : bulkQty >= 20 ? 0.97 : 1)
                          )}
                        </span>
                      </div>

                      {/* Estimated transport advice */}
                      <div className="text-[10px] text-slate-400 border-t border-slate-100/60 pt-2 flex items-center gap-1">
                        <Truck className="h-3 w-3 text-slate-400" />
                        <span>
                          {bulkQty >= 30 ? 'تتطلب تريلة قلاب كبيرة حمولة 30 طن للتوصيل.' :
                           bulkQty >= 10 ? 'تتطلب لوري قلاب متوسط حمولة 10 طن للتوصيل.' :
                           'يمكن توصيلها بقلاب كانتر صغير 5 طن.'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-amber-600 font-bold block">الوصف والتفاصيل:</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Price alert notice */}
                <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-[10px] text-slate-500 flex items-start gap-1.5">
                  <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>تخضع أسعار الحديد والسمنت للبورصة الإنشائية اليومية في العراق. سيثبت فريق التنسيق واللوجستيات السعر النهائي الفعلي وقت الاتصال الهاتفي وقبل انطلاق شاحنة الشحن.</span>
                </div>

              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedProduct.available) {
                      // Add selected amount
                      for(let i = 0; i < bulkQty; i++) {
                        onAddToCart(selectedProduct);
                      }
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }
                  }}
                  disabled={!selectedProduct.available}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:bg-slate-100 disabled:text-slate-400 text-slate-950 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>حجز {bulkQty} {selectedProduct.unit} وإضافة للسلة</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-3 rounded-xl text-xs font-bold"
                >
                  إغلاق
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Drawer Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between text-right shadow-2xl"
              dir="rtl"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-1.5 text-amber-600">
                  <span className="text-sm font-black text-slate-900">سلة المواد المحددة</span>
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>

              {/* Cart List Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">سلة التسوق فارغة حالياً</p>
                    <p className="text-[10px] text-slate-500">اختر مواد البناء أو الكرفانات وأضفها للسلة لتظهر هنا.</p>
                  </div>
                ) : (
                  cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex gap-3 items-center shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-black text-slate-800 line-clamp-1">{item.name}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-amber-600 font-bold font-mono">{formatPrice(item.price * quantity)}</span>
                          
                          {/* Stepper qty */}
                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                            <button
                              onClick={() => onUpdateCartQuantity(item.id, quantity + 1)}
                              className="p-1 text-slate-400 hover:text-slate-800"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold font-sans px-1 text-slate-800">{quantity}</span>
                            <button
                              onClick={() => {
                                  if (quantity > 1) {
                                    onUpdateCartQuantity(item.id, quantity - 1);
                                  } else {
                                    onRemoveFromCart(item.id);
                                  }
                                }}
                              className="p-1 text-slate-400 hover:text-slate-800"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer & Form */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-4 shadow-inner">
                  {/* Totals */}
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                    <span className="text-slate-550 font-bold">قيمة المواد الإجمالية:</span>
                    <span className="text-base font-black text-amber-600 font-sans font-mono">{formatPrice(cartTotal)}</span>
                  </div>

                  {/* Shipment disclaimer */}
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-[10px] text-amber-800 font-bold">
                    * يرجى العلم أن أجور النقل والتفريغ يتم حسابها لاحقاً حسب المسافة وعنوان الشحن وقت الاتصال الهاتفي.
                  </div>

                  {/* Client Info fields for Order Placement */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">الاسم الكامل للمستلم:</label>
                      <input
                        type="text"
                        required
                        placeholder="الاسم الثلاثي..."
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">رقم الهاتف الفعال للمطابقة:</label>
                      <input
                        type="tel"
                        required
                        placeholder="077XXXXXXXX..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 text-left"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">العنوان الكامل وتفاصيل التوصيل:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: بغداد - الكرادة - قرب ساحة التحريات"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer hover:opacity-95"
                    >
                      إرسال وحجز المواد الإنشائية
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
