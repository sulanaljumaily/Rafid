import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceListing, Governorate, MachineryType, PromoBanner, ServiceRequest, TabType } from '../types';
import { GOVERNORATES, DISTRICTS_BY_GOVERNORATE, MACHINERY_DETAILS } from '../data';
import { 
  Search, Map, List, Star, Phone, MapPin, X, Info, Filter, 
  ArrowLeftRight, Hourglass, Bell, ShoppingBag, ShieldCheck, 
  Hammer, Activity, CheckCircle, Truck, Wrench, Heart, Info as InfoIcon 
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

interface OverviewSectionProps {
  listings: ServiceListing[];
  banners: PromoBanner[];
  requests: ServiceRequest[];
  onSelectListing: (listing: ServiceListing) => void;
  onInitiateRequest: (listing: ServiceListing) => void;
  onOpenProviderProfile?: (ownerName: string) => void;
  setActiveTab?: (tab: TabType) => void;
}

export default function OverviewSection({
  listings,
  banners,
  requests,
  onSelectListing,
  onInitiateRequest,
  onOpenProviderProfile,
  setActiveTab
}: OverviewSectionProps) {
  // View states
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingRequestsCount = requests.filter(r => r.status === 'pending' || r.status === 'approved' || r.status === 'ongoing').length;

  // Search and general filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedGov, setSelectedGov] = useState<Governorate | ''>('');
  const [selectedType, setSelectedType] = useState<MachineryType | ''>('');

  // Nested (machinery-specific) filters
  const [shovelBucket, setShovelBucket] = useState<string>('');
  const [excavatorTrack, setExcavatorTrack] = useState<string>('');
  const [craneCapacity, setCraneCapacity] = useState<string>('');
  const [trailerCargo, setTrailerCargo] = useState<string>('');
  const [workTypeFilter, setWorkTypeFilter] = useState<'hourly' | 'road' | ''>('');

  // Banner slider state
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Auto scroll banners
  useEffect(() => {
    const activeBns = banners.filter(b => b.active);
    if (activeBns.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % activeBns.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  // Handle nested filter resets when machinery type changes
  useEffect(() => {
    setShovelBucket('');
    setExcavatorTrack('');
    setCraneCapacity('');
    setTrailerCargo('');
  }, [selectedType]);

  // Filter listings based on everything
  const filteredListings = listings.filter((listing) => {
    if (listing.status !== 'active') return false;

    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGov = !selectedGov || listing.governorate === selectedGov;
    const matchesType = !selectedType || listing.type === selectedType;
    const matchesWorkType = !workTypeFilter || listing.pricingType === workTypeFilter;

    let matchesNested = true;
    if (selectedType === 'shovel' && shovelBucket) {
      matchesNested = listing.description.includes(shovelBucket) || listing.title.includes(shovelBucket);
    } else if (selectedType === 'excavator' && excavatorTrack) {
      matchesNested = listing.description.includes(excavatorTrack) || listing.title.includes(excavatorTrack);
    } else if (selectedType === 'crane' && craneCapacity) {
      matchesNested = listing.description.includes(craneCapacity) || listing.title.includes(craneCapacity);
    } else if (selectedType === 'trailer' && trailerCargo) {
      matchesNested = listing.description.includes(trailerCargo) || listing.title.includes(trailerCargo);
    }

    return matchesSearch && matchesGov && matchesType && matchesWorkType && matchesNested;
  });

  const activeBanners = banners.filter((b) => b.active);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-IQ') + ' د.ع';
  };

  // Quick select category from bento
  const handleSelectCategory = (type: MachineryType) => {
    setSelectedType(type);
    setIsSearchExpanded(true);
    
    // Scroll smoothly to results/filter section
    const resultsElement = document.getElementById('search-filters-anchor');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32 font-sans text-slate-900" id="overview-section-container" dir="rtl">
      
      {/* 1. Header Area with Premium Welcome & Notification Widget */}
      <div className="relative z-50 flex flex-row items-center justify-between gap-2 bg-white/70 backdrop-blur-md px-3.5 py-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
        <div className="text-right flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-amber-600 leading-none">
              رافد
            </h1>
            <p className="text-[9px] sm:text-[11px] font-bold text-slate-500 mt-0.5 whitespace-nowrap">
              للبناء والآليات الثقيلة
            </p>
          </div>
        </div>

        {/* Floating Notification Icon Button */}
        <div className="relative z-50 flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-amber-500/5 rounded-xl sm:rounded-2xl transition cursor-pointer relative shadow-xs flex items-center justify-center group"
            title="الإشعارات"
            aria-label="الإشعارات"
          >
            <Bell className="h-4.5 w-4.5 text-amber-600 group-hover:scale-110 transition-transform" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-600 text-[9px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-[100] space-y-3 text-right"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-950">آخر تحديثات الحجوزات</h4>
                  <span className="text-[8px] text-amber-700 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">مباشر الآن</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-2 pr-0.5">
                  {requests.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-4">لا توجد طلبات أو إشعارات نشطة حالياً.</p>
                  ) : (
                    requests.slice(0, 4).map((req) => {
                      const statusMap: Record<string, string> = {
                        pending: 'معلق بانتظار العروض ⏳',
                        approved: 'تمت الموافقة ويتم الجدولة 🗓️',
                        ongoing: 'جاري العمل والتشغيل الآن 🚜',
                        completed: 'تم العمل بنجاح 🏁',
                        cancelled: 'تم إلغاء الطلب ❌'
                      };
                      return (
                        <div key={req.id} className="p-2 bg-slate-50 rounded-xl border border-slate-150 space-y-1 text-xs">
                          <div className="flex justify-between text-[8px]">
                            <span className="text-amber-700 font-bold">
                              {MACHINERY_DETAILS[req.machineryType]?.name || req.machineryType}
                            </span>
                            <span className="text-slate-400 font-bold">{req.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-700">الطلب #{req.id.split('-').pop()} - للعميل {req.customerName}</p>
                          <span className="text-[9px] text-emerald-700 font-bold block mt-0.5 bg-emerald-500/5 px-1.5 py-0.5 rounded-md border border-emerald-500/10 w-fit">
                            {statusMap[req.status] || req.status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Bento UI Dashboard Grid */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        
        {/* Bento Tile 1: Promo Slider Banner (Slick glassmorphism / Spans 8 cols on desktop) */}
        <div className="col-span-12 md:col-span-8 bg-white border border-slate-150 rounded-3xl h-[220px] md:h-[240px] overflow-hidden shadow-sm relative group flex flex-col justify-end">
          {activeBanners.length > 0 ? (
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBannerIdx}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-cover bg-center flex flex-col justify-end p-6"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95) 30%, rgba(15, 23, 42, 0.4) 75%, rgba(15, 23, 42, 0.1) 100%), url(${activeBanners[currentBannerIdx].image})`,
                    referrerPolicy: 'no-referrer'
                  } as React.CSSProperties}
                >
                  <div className="space-y-1.5 z-10 text-right">
                    <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full w-fit block tracking-wider uppercase">
                      عروض وبانرات رافد الترويجية
                    </span>
                    <h2 className="text-base md:text-xl font-black text-white leading-tight">
                      {activeBanners[currentBannerIdx].title}
                    </h2>
                    <p className="text-xs text-slate-300 max-w-lg line-clamp-2 leading-relaxed">
                      {activeBanners[currentBannerIdx].subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider indicators */}
              <div className="absolute bottom-6 left-6 flex gap-1 z-20">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentBannerIdx === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex flex-col justify-end text-white">
              <h2 className="text-base font-bold">أهلاً بك في رافد للآليات</h2>
              <p className="text-xs text-slate-300">منصة رقمية لربط المقاولين بملاّك الآليات الثقيلة في العراق.</p>
            </div>
          )}
        </div>

        {/* Bento Tile 2: Platform Live Stats Card (Spans 6 cols on mobile, 4 cols on desktop) */}
        <div className="col-span-6 md:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 text-white border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[170px] md:h-[240px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between gap-1">
            <span className="text-[8px] sm:text-[9px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded-md truncate">مؤشرات فورية</span>
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 animate-pulse flex-shrink-0" />
          </div>

          <div className="space-y-0.5 my-2">
            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold">الآليات المتاحة للعمل</span>
            <span className="text-lg sm:text-3xl font-black text-white font-mono block">
              {listings.filter(l => l.status === 'active').length} <span className="text-[10px] sm:text-sm font-sans font-bold text-slate-400">آلية جاهزة</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 border-t border-slate-800/80 pt-2 text-right">
            <div>
              <span className="text-[8px] sm:text-[9px] text-slate-400 block font-semibold">حجوزات نشطة</span>
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">{requests.length} طلب</span>
            </div>
            <div>
              <span className="text-[8px] sm:text-[9px] text-slate-400 block font-semibold">المحافظات</span>
              <span className="text-xs sm:text-sm font-black text-white font-mono">18 محافظة</span>
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Premium Materials Store Ad (Spans 6 cols on mobile, 12 cols on desktop) */}
        <div 
          onClick={() => setActiveTab && setActiveTab('store')}
          className="col-span-6 md:col-span-12 bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600 rounded-3xl p-3.5 sm:p-5 shadow-sm relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-all min-h-[170px] md:min-h-0"
        >
          {/* Visual gradient overlay */}
          <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 z-10 h-full md:h-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-2.5">
              <div className="flex items-center justify-between md:justify-start gap-2">
                <div className="h-8 w-8 sm:h-11 sm:w-11 bg-white/20 text-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase bg-white/30 px-1.5 sm:px-2 py-0.5 rounded-md md:hidden">المتجر</span>
              </div>
              
              <div className="space-y-0.5">
                <div className="hidden md:flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-slate-950">تجهيز المواد الإنشائية الثقيلة</h4>
                  <span className="text-[9px] font-black uppercase bg-white/30 px-2 py-0.5 rounded-md">المتجر الإنشائي</span>
                </div>
                <h4 className="text-xs font-black text-slate-950 md:hidden">تجهيز المواد الإنشائية</h4>
                <p className="text-[9px] sm:text-[11px] text-slate-900/80 leading-snug font-sans font-medium line-clamp-2 md:line-clamp-none">
                  اطلب السمنت، الرمل، الحصى والجص مباشرة لتصلك لموقعك فوراً.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-slate-950 bg-white/30 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl group-hover:translate-x-[-4px] transition-transform whitespace-nowrap z-10 self-start md:self-auto mt-auto md:mt-0">
              <span>اطلب الآن ←</span>
            </div>
          </div>
        </div>

        {/* Bento Tile 4: Small Horizontal Category Cards (Placed directly under Materials Store Card) */}
        <div className="col-span-12 bg-white border border-slate-150 rounded-3xl p-3.5 sm:p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3" dir="rtl">
            {/* Category 1: Shovel */}
            <button
              type="button"
              onClick={() => handleSelectCategory('shovel')}
              className="bg-slate-50 hover:bg-amber-500/10 border border-slate-200 hover:border-amber-500/50 p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-xs"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
                <Hammer className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-900 block leading-tight">الشفلات</span>
            </button>

            {/* Category 2: Excavator */}
            <button
              type="button"
              onClick={() => handleSelectCategory('excavator')}
              className="bg-slate-50 hover:bg-amber-500/10 border border-slate-200 hover:border-amber-500/50 p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-xs"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
                <Wrench className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-900 block leading-tight">الحفارات</span>
            </button>

            {/* Category 3: Crane */}
            <button
              type="button"
              onClick={() => handleSelectCategory('crane')}
              className="bg-slate-50 hover:bg-amber-500/10 border border-slate-200 hover:border-amber-500/50 p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-xs"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
                <Activity className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-900 block leading-tight">الرافعات</span>
            </button>

            {/* Category 4: Trailer */}
            <button
              type="button"
              onClick={() => handleSelectCategory('trailer')}
              className="bg-slate-50 hover:bg-amber-500/10 border border-slate-200 hover:border-amber-500/50 p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-xs"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1">
                <Truck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-900 block leading-tight">آليات النقل</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Search and Dynamic Interactive Filters Section */}
      <div id="search-filters-anchor" className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative overflow-hidden pt-5">
        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative space-y-4">
          {/* Search Input Container */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1 px-3 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/5 transition-all">
            <Search className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchExpanded(true);
              }}
              onFocus={() => setIsSearchExpanded(true)}
              className="w-full bg-transparent border-none text-slate-900 text-[11px] sm:text-xs font-bold placeholder:text-[10px] sm:placeholder:text-xs placeholder-slate-400 py-1.5 sm:py-2 text-right focus:outline-none"
              dir="rtl"
            />
            {isSearchExpanded ? (
              <button
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchQuery('');
                  setSelectedGov('');
                  setSelectedType('');
                  setWorkTypeFilter('');
                }}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-800 transition text-[9px] sm:text-[10px] flex items-center gap-0.5 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>إعادة تعيين</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="bg-amber-500/10 rounded-lg text-amber-700 border border-amber-500/20 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <Filter className="h-3 w-3" />
                <span>خيارات تصفية متقدمة</span>
              </button>
            )}
          </div>

          {/* Expanded Filter Panel */}
          <AnimatePresence>
            {isSearchExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-4 pt-3 border-t border-slate-100"
              >
                {/* Governorate & Machinery Main Selectors */}
                <div className="grid grid-cols-2 gap-2" dir="rtl">
                  {/* Governorate Filter */}
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] sm:text-[11px] font-bold text-slate-500">المحافظة</label>
                    <select
                      value={selectedGov}
                      onChange={(e) => setSelectedGov(e.target.value as Governorate | '')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] sm:text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 font-sans font-bold"
                    >
                      <option value="">كل المحافظات</option>
                      {GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Machinery Type Filter */}
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] sm:text-[11px] font-bold text-slate-500">الفئات</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as MachineryType | '')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] sm:text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 font-sans font-bold"
                    >
                      <option value="">كل الفئات</option>
                      {Object.entries(MACHINERY_DETAILS).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Work & Pricing Type Switcher */}
                <div className="space-y-1 text-right" dir="rtl">
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-500">نوع التكلفة</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setWorkTypeFilter('')}
                      className={`py-1.5 sm:py-2 rounded-lg border text-[10px] sm:text-[11px] font-sans font-bold transition ${
                        workTypeFilter === ''
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-850 hover:bg-slate-100'
                      }`}
                    >
                      عرض الكل
                    </button>
                    <button
                      onClick={() => setWorkTypeFilter('hourly')}
                      className={`py-1.5 sm:py-2 rounded-lg border text-[10px] sm:text-[11px] font-sans font-bold transition flex items-center justify-center gap-1 ${
                        workTypeFilter === 'hourly'
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-850 hover:bg-slate-100'
                      }`}
                    >
                      <Hourglass className="h-3 w-3" />
                      <span>أجور بالساعة</span>
                    </button>
                    <button
                      onClick={() => setWorkTypeFilter('road')}
                      className={`py-1.5 sm:py-2 rounded-lg border text-[10px] sm:text-[11px] font-sans font-bold transition flex items-center justify-center gap-1 ${
                        workTypeFilter === 'road'
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-850 hover:bg-slate-100'
                      }`}
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                      <span>بالنقلة / المشوار</span>
                    </button>
                  </div>
                </div>

                {/* Shovel Specific Nested Filters */}
                {selectedType === 'shovel' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-right animate-fadeIn" dir="rtl">
                    <span className="text-[10px] text-amber-800 font-bold block mb-2">فلاتر قياس الحوض للشفل:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['950', '966', 'حوض كبير', 'حوض صغير'].map((cap) => (
                        <button
                          key={cap}
                          onClick={() => setShovelBucket(shovelBucket === cap ? '' : cap)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                            shovelBucket === cap
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Excavator Specific Filters */}
                {selectedType === 'excavator' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-right animate-fadeIn" dir="rtl">
                    <span className="text-[10px] text-amber-800 font-bold block mb-2">المواصفات التقنية للحفارة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['مجنزرة', 'إطارات', 'شاكوش/دكاك', 'ذراع طويل'].map((track) => (
                        <button
                          key={track}
                          onClick={() => setExcavatorTrack(excavatorTrack === track ? '' : track)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                            excavatorTrack === track
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {track}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crane Specific Filters */}
                {selectedType === 'crane' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-right animate-fadeIn" dir="rtl">
                    <span className="text-[10px] text-amber-800 font-bold block mb-2">حمولة الرافعة القصوى:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['25 طن', '50 طن', '100 طن'].map((cap) => (
                        <button
                          key={cap}
                          onClick={() => setCraneCapacity(craneCapacity === cap ? '' : cap)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                            craneCapacity === cap
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trailer Specific Filters */}
                {selectedType === 'trailer' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-right animate-fadeIn" dir="rtl">
                    <span className="text-[10px] text-amber-800 font-bold block mb-2">المواد المسموح بنقلها:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['حصى ورمل', 'أنقاض وأتربة', 'أنابيب', 'حديد وسمنت'].map((cargo) => (
                        <button
                          key={cargo}
                          onClick={() => setTrailerCargo(trailerCargo === cargo ? '' : cargo)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                            trailerCargo === cargo
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cargo}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Machinery Listings Result Cards Grid */}
      <div className="space-y-4">
        {/* Toggle list/map switcher */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
            <button
              onClick={() => setViewMode('map')}
              className={`py-1 px-2 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Map className="h-3 w-3" />
              <span>عرض على الخريطة</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`py-1 px-2 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="h-3 w-3" />
              <span>عرض البطاقات</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-500" dir="rtl">
            تطابق البحث: <span className="text-amber-600 font-bold">{filteredListings.length} آلية نشطة</span>
          </span>
        </div>

        {/* Dynamic Display Mode */}
        {viewMode === 'map' ? (
          <div className="min-h-[440px] md:h-[480px] w-full rounded-3xl border border-slate-200 overflow-hidden relative shadow-sm">
            <InteractiveMap
              listings={filteredListings}
              selectedGovernorate={selectedGov}
              onGovernorateSelect={(gov) => setSelectedGov(gov)}
              onListingSelect={(listing) => onSelectListing(listing)}
            />
            {/* Small floating filter cards on map */}
            <div className="absolute bottom-6 right-4 left-4 z-10" dir="rtl">
              {selectedGov && (
                <div className="bg-white/95 backdrop-blur p-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between text-right">
                  <div>
                    <span className="text-[9px] text-amber-600 font-bold block">موقع العمل النشط حالياً</span>
                    <span className="text-xs font-black text-slate-950">{selectedGov}</span>
                  </div>
                  <button
                    onClick={() => setSelectedGov('')}
                    className="p-1 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-650 text-[10px] hover:bg-slate-200"
                  >
                    عرض كل العراق
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Phone Card list designed beautifully */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
            {filteredListings.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
                <InfoIcon className="h-10 w-10 text-amber-500 mx-auto" />
                <h4 className="text-xs font-black text-slate-900">لم نجد أي آليات مطابقة للبحث</h4>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  يرجى تصفية البحث من جديد أو تغيير المحافظة المفضلة لتظهر المزيد من عروض التأجير.
                </p>
              </div>
            ) : (
              filteredListings.map((listing) => {
                const mech = MACHINERY_DETAILS[listing.type];

                return (
                  <div
                    key={listing.id}
                    id={`listing-card-${listing.id}`}
                    onClick={() => onSelectListing(listing)}
                    className="group bg-white border border-slate-150 rounded-3xl overflow-hidden hover:border-amber-500 hover:shadow-md transition-all duration-300 cursor-pointer shadow-xs flex flex-col justify-between"
                  >
                    {/* Image Header with beautiful badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 right-3 bg-slate-950/90 text-white backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 shadow-lg">
                        <span className="text-xs font-extrabold text-amber-400">
                          {formatPrice(listing.price)}
                        </span>
                        <span className="text-[8px] text-slate-300 block text-center">
                          {listing.pricingType === 'hourly' ? 'بالساعة' : 'بالنقلة / المشوار'}
                        </span>
                      </div>

                      {/* Machinery Category Badge */}
                      <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black shadow-md flex items-center gap-1">
                        <span>{mech?.name}</span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-black text-amber-600 flex items-center gap-0.5 border border-slate-200">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{listing.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Description Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5 text-right">
                        <h3 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors leading-snug">
                          {listing.title}
                        </h3>
                        
                        {listing.pricingType === 'road' && listing.destinationGovernorate ? (
                          <div className="flex items-center gap-1 text-[10px] text-amber-800 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-md w-fit">
                            <ArrowLeftRight className="h-3 w-3 text-amber-600" />
                            <span>مسار النقل: {listing.governorate} ⟵ {listing.destinationGovernorate}</span>
                          </div>
                        ) : listing.coverageGovernorates && listing.coverageGovernorates.length > 0 ? (
                          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                            <MapPin className="h-3 w-3 text-slate-500" />
                            <span>تغطية: {listing.coverageGovernorates.slice(0, 3).join('، ')}{listing.coverageGovernorates.length > 3 ? ` (+${listing.coverageGovernorates.length - 3})` : ''}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{listing.governorate} - {listing.district}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Card Footer actions */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenProviderProfile) onOpenProviderProfile(listing.ownerName);
                          }}
                          className="text-right group/owner hover:opacity-80 transition cursor-pointer"
                        >
                          <span className="text-[8px] text-amber-700 font-extrabold flex items-center gap-0.5 leading-none">
                            <span>مزود الخدمة والمالك الموثق</span>
                            <ShieldCheck className="h-2.5 w-2.5 text-emerald-500 inline" />
                          </span>
                          <span className="text-[10px] font-black text-slate-800 block mt-0.5 group-hover/owner:text-amber-600 group-hover/owner:underline">
                            {listing.ownerName}
                          </span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInitiateRequest(listing);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-transform group-hover:scale-102"
                        >
                          اطلب الآن
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
