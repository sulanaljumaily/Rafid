import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceListing, Governorate, MachineryType, PricingType, UserAccount } from '../types';
import { GOVERNORATES, DISTRICTS_BY_GOVERNORATE, MACHINERY_DETAILS } from '../data';
import { 
  MapPin, Phone, Star, Plus, X, ArrowLeft, CheckCircle, ShieldCheck, 
  Search, Truck, Layers, ArrowLeftRight, Check, Compass, Navigation
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

interface ServicesSectionProps {
  listings: ServiceListing[];
  currentUser?: UserAccount;
  onAddListing: (newListing: Omit<ServiceListing, 'id' | 'rating' | 'reviewsCount' | 'status'>) => void;
  onSelectListing: (listing: ServiceListing) => void;
  onOpenProviderProfile?: (ownerName: string) => void;
}

const PRESET_MACHINERY_IMAGES: Record<MachineryType, string[]> = {
  'shovel': [
    'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'
  ],
  'excavator': [
    'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'
  ],
  'crane': [
    'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600'
  ],
  'trailer': [
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600'
  ],
  'grader': [
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=600'
  ],
  'dumper': [
    'https://images.unsplash.com/photo-1501516069922-a9982bd6f3bd?auto=format&fit=crop&q=80&w=600'
  ],
  'roller': [
    'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600'
  ],
  'kia': [
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'
  ],
  'flatbed': [
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600'
  ],
  'mixer': [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'
  ],
  'water_tanker': [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'
  ],
  'bobcat': [
    'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=600'
  ]
};

export default function ServicesSection({
  listings,
  currentUser,
  onAddListing,
  onSelectListing,
  onOpenProviderProfile
}: ServicesSectionProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState<Governorate | ''>('');
  const [selectedType, setSelectedType] = useState<MachineryType | ''>('');
  const [workTypeFilter, setWorkTypeFilter] = useState<'hourly' | 'road' | ''>('');

  // Form states for new listing
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MachineryType>('shovel');
  const [pricingType, setPricingType] = useState<PricingType>('hourly');
  const [price, setPrice] = useState<string>('');
  const [governorate, setGovernorate] = useState<Governorate>('بغداد');
  const [district, setDistrict] = useState('');
  const [coverAllIraq, setCoverAllIraq] = useState(false);
  const [selectedCoverageGovs, setSelectedCoverageGovs] = useState<string[]>(['بغداد']);
  
  // Destination for Road/Transfer work
  const [destinationGov, setDestinationGov] = useState<Governorate>('البصرة');
  const [destinationDist, setDestinationDist] = useState<string>('');

  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [location, setLocation] = useState<{ x: number; y: number }>({ x: 50, y: 48 });
  const [selectedPresetImage, setSelectedPresetImage] = useState<string>('');

  const [notification, setNotification] = useState<string | null>(null);

  // Auto populate user phone and name when modal opens
  useEffect(() => {
    if (isPublishing) {
      if (currentUser) {
        if (!phone) setPhone(currentUser.phone || '07701234567');
        if (!ownerName) setOwnerName(currentUser.name || 'مالك الآلية');
      } else {
        if (!phone) setPhone('07701234567');
        if (!ownerName) setOwnerName('شركة الرافدين للآليات');
      }
    }
  }, [isPublishing, currentUser]);

  // Filter active listings based on active filters
  const activeListings = listings.filter(l => {
    if (l.status !== 'active') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchOwner = l.ownerName.toLowerCase().includes(q);
      const matchDistrict = l.district.toLowerCase().includes(q);
      const matchGov = l.governorate.toLowerCase().includes(q);
      const matchDesc = l.description.toLowerCase().includes(q);
      if (!matchTitle && !matchOwner && !matchDistrict && !matchGov && !matchDesc) {
        return false;
      }
    }

    if (selectedGov && l.governorate !== selectedGov && !l.coverageGovernorates?.includes(selectedGov) && !l.coverageGovernorates?.includes('كل العراق')) {
      return false;
    }

    if (selectedType && l.type !== selectedType) {
      return false;
    }

    if (workTypeFilter && l.pricingType !== workTypeFilter) {
      return false;
    }

    return true;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !district || !phone || !description || !ownerName) {
      alert('الرجاء إكمال جميع البيانات المطلوبة لضمان النشر بنجاح.');
      return;
    }

    if (pricingType === 'hourly' && (!price || Number(price) <= 0)) {
      alert('الرجاء تحديد سعر ساعة العمل بالدينار العراقي.');
      return;
    }

    const finalPrice = price ? Number(price) : 0;
    const imageToUse = selectedPresetImage || (PRESET_MACHINERY_IMAGES[type] ? PRESET_MACHINERY_IMAGES[type][0] : PRESET_MACHINERY_IMAGES['shovel'][0]);

    const coverageList = coverAllIraq ? ['كل العراق'] : selectedCoverageGovs;

    onAddListing({
      title,
      type,
      pricingType,
      price: finalPrice,
      pricingNegotiable: finalPrice === 0,
      governorate,
      district,
      coverageGovernorates: coverageList,
      destinationGovernorate: pricingType === 'road' ? destinationGov : undefined,
      destinationDistrict: pricingType === 'road' && destinationDist ? destinationDist : undefined,
      location: location || { x: 50, y: 48 },
      images: [imageToUse],
      phone,
      description,
      ownerName
    });

    setNotification('تم إرسال ونشر خدمتك بنجاح! تظهر الآن لجميع المستخدمين والمستأجرين.');
    setTimeout(() => setNotification(null), 5000);

    // Reset Form
    setIsPublishing(false);
    setPublishStep(1);
    setTitle('');
    setType('shovel');
    setPricingType('hourly');
    setPrice('');
    setDistrict('');
    setPhone('');
    setDescription('');
    setOwnerName('');
    setLocation({ x: 50, y: 48 });
    setSelectedPresetImage('');
  };

  const getDistrictOptions = (govName: Governorate) => {
    return DISTRICTS_BY_GOVERNORATE[govName] || [];
  };

  const toggleCoverageGov = (gov: Governorate) => {
    if (selectedCoverageGovs.includes(gov)) {
      setSelectedCoverageGovs(prev => prev.filter(g => g !== gov));
    } else {
      setSelectedCoverageGovs(prev => [...prev, gov]);
    }
  };

  const formatPrice = (p: number, isNegotiable?: boolean) => {
    if (p === 0 || isNegotiable) return 'حسب الاتفاق';
    return p.toLocaleString('ar-IQ') + ' د.ع';
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32 font-sans text-slate-900" id="services-section-container">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-2" dir="rtl">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900">الآليات والخدمات المتوفرة</h1>
          <p className="text-[11px] text-slate-500 font-bold">تصفح الآليات المعروضة أو أضف آليتك الخاصة للتأجير</p>
        </div>
        
        {/* Publish CTA Button */}
        <button
          onClick={() => {
            setIsPublishing(true);
            setPublishStep(1);
            if (!phone && currentUser) setPhone(currentUser.phone);
            if (!ownerName && currentUser) setOwnerName(currentUser.name);
            setSelectedPresetImage(PRESET_MACHINERY_IMAGES['shovel'][0]);
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[11px] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition active:scale-95"
        >
          <Plus className="h-4 w-4 text-slate-950" />
          <span>نشر خدمة جديدة</span>
        </button>
      </div>

      {/* Success Banner */}
      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-right text-emerald-700 text-xs font-bold font-sans shadow-sm" dir="rtl">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 animate-bounce" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative overflow-hidden space-y-3" dir="rtl">
        {/* Search Input Container */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
          <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن نوع الآلية، المحافظة، اسم المالك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-900 text-xs font-bold placeholder:text-slate-400 py-1.5 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Governorate Filter */}
          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value as Governorate | '')}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="">جميع المحافظات</option>
            {GOVERNORATES.map(gov => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>

          {/* Machinery Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MachineryType | '')}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="">جميع أنواع الآليات</option>
            {Object.entries(MACHINERY_DETAILS).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>

          {/* Work Type Filter */}
          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value as 'hourly' | 'road' | '')}
            className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
          >
            <option value="">جميع أساليب العمل</option>
            <option value="hourly">ساعة عمل</option>
            <option value="road">حسب الطريق والنقلة</option>
          </select>
        </div>

        {/* View Toggle (List vs Map) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-600">
            النتائج المعروضة: <span className="text-amber-600 font-black">{activeListings.length}</span> آلية جاهزة
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg transition ${viewMode === 'list' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'}`}
            >
              قائمة بطاقات
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg transition ${viewMode === 'map' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'}`}
            >
              خريطة تفاعلية
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Content Rendering */}
      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full h-[450px] md:h-[520px] rounded-3xl border border-slate-200 overflow-hidden relative shadow-sm"
          >
            <InteractiveMap
              listings={activeListings}
              onListingSelect={(listing) => onSelectListing(listing)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            dir="rtl"
          >
            {activeListings.map((listing) => {
              const mech = MACHINERY_DETAILS[listing.type] || { name: listing.type, icon: 'Truck' };

              return (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing)}
                  className="bg-white border border-slate-200 hover:border-amber-500/50 rounded-3xl p-4 flex flex-col justify-between space-y-3 cursor-pointer group transition duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="relative h-32 w-full bg-slate-100 rounded-2xl overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Pricing Tag */}
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-amber-400 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black border border-amber-500/30 shadow-md">
                      {formatPrice(listing.price, listing.pricingNegotiable)} {listing.pricingType === 'hourly' ? '/ ساعة' : '/ نقلة وطريق'}
                    </div>

                    {/* Pricing Type Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg text-[10px] text-slate-800 font-extrabold shadow-sm border border-slate-200 flex items-center gap-1">
                      {listing.pricingType === 'hourly' ? (
                        <><span>عمل بالساعة</span></>
                      ) : (
                        <><Truck className="h-3 w-3 text-amber-600 inline" /><span>حسب الطريق</span></>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-amber-600 transition">
                        {listing.title}
                      </h3>
                    </div>

                    {/* Location & Routing Details */}
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">موقع التواجد الرئيسي:</span>
                        <span className="text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-amber-500 flex-shrink-0" />
                          {listing.governorate} - {listing.district}
                        </span>
                      </div>

                      {/* Route or Coverage */}
                      {listing.pricingType === 'road' && listing.destinationGovernorate ? (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-amber-700">
                          <span className="text-[10px] text-slate-500">مسار النقل المتاح:</span>
                          <span className="font-black flex items-center gap-1 text-[10px]">
                            {listing.governorate}
                            <ArrowLeftRight className="h-3 w-3 text-amber-600 inline" />
                            {listing.destinationGovernorate} {listing.destinationDistrict ? `(${listing.destinationDistrict})` : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-slate-600">
                          <span className="text-[10px] text-slate-500">نطاق الخدمة والتغطية:</span>
                          <span className="text-[10px] text-amber-700 font-extrabold">
                            {listing.coverageGovernorates?.includes('كل العراق') ? '🇮🇶 تغطي جميع المحافظات' : listing.coverageGovernorates?.join('، ') || listing.governorate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Owner & Detail Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-sans">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenProviderProfile) onOpenProviderProfile(listing.ownerName);
                      }}
                      className="text-slate-700 hover:text-amber-600 font-bold transition flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                      <span>{listing.ownerName}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-600 font-black text-[10px]">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{listing.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-amber-600 font-black text-[11px] group-hover:translate-x-[-2px] transition">
                        التفاصيل ←
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Service Centered Modal */}
      <AnimatePresence>
        {isPublishing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative my-auto w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 font-sans">نشر وإعلان خدمة آلية ثقيلة</h2>
                    <p className="text-[10px] text-slate-500 font-bold">أضف آليتك لعرضها على أصحاب المشاريع والعملاء</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPublishing(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-xl text-slate-500 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Steps bar */}
              <div className="px-5 py-2.5 bg-amber-500/5 border-b border-slate-100 flex justify-between items-center text-[11px] font-sans font-bold text-slate-600">
                <span className={publishStep === 1 ? "text-amber-600 font-black flex items-center gap-1" : "text-slate-400"}>
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">1</span>
                  المعلومات والآلية
                </span>
                <span className="text-slate-300">←</span>
                <span className={publishStep === 2 ? "text-amber-600 font-black flex items-center gap-1" : "text-slate-400"}>
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">2</span>
                  الأسعار والنطاق
                </span>
                <span className="text-slate-300">←</span>
                <span className={publishStep === 3 ? "text-amber-600 font-black flex items-center gap-1" : "text-slate-400"}>
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">3</span>
                  الموقع والصور
                </span>
              </div>

              {/* Modal Content Form */}
              <form onSubmit={handlePublishSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-right">
                {/* Step 1: Owner, Title, Machinery Type, Phone */}
                {publishStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">اسم صاحب الآلية / الشركة:</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: الحاج أبو علي التميمي"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">رقم الهاتف للتواصل (تلقائي ويمكن تعديله):</label>
                        <input
                          type="tel"
                          required
                          placeholder="077XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white text-left transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">عنوان الإعلان التجاري:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: شفل كوماتسو موديل 2022 جاهز للعمل بكافة المشاريع"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">اختر نوع الآلية الثقيلة:</label>
                      <select
                        value={type}
                        onChange={(e) => {
                          const selected = e.target.value as MachineryType;
                          setType(selected);
                          if (PRESET_MACHINERY_IMAGES[selected]) {
                            setSelectedPresetImage(PRESET_MACHINERY_IMAGES[selected][0]);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition"
                      >
                        {Object.entries(MACHINERY_DETAILS).map(([key, val]) => (
                          <option key={key} value={key}>{val.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!ownerName || !phone || !title) {
                          alert('الرجاء تعبئة جميع بيانات الخطوة الأولى للمتابعة.');
                          return;
                        }
                        setPublishStep(2);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-2xl font-black text-xs mt-2 transition cursor-pointer"
                    >
                      المتابعة إلى خطوة الأسعار والنطاق ←
                    </button>
                  </div>
                )}

                {/* Step 2: Pricing Model, Dynamic Price, Coverage & Destinations */}
                {publishStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Work Type Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">نوع العمل واحتساب الأجور:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPricingType('hourly')}
                          className={`p-3 rounded-2xl border text-right transition cursor-pointer ${
                            pricingType === 'hourly'
                              ? 'bg-amber-500/10 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs font-black block">عمل بالساعة</span>
                          <span className="text-[10px] text-slate-500 block">مناسب للحفارات، الشوافل، الرافعات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPricingType('road')}
                          className={`p-3 rounded-2xl border text-right transition cursor-pointer ${
                            pricingType === 'road'
                              ? 'bg-amber-500/10 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs font-black block flex items-center gap-1">
                            <Truck className="h-3.5 w-3.5 text-amber-600 inline" />
                            حسب الطريق والنقلة
                          </span>
                          <span className="text-[10px] text-slate-500 block">مناسب للتريلات، الكيا، السطحات واللواري</span>
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Price Field */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {pricingType === 'hourly'
                          ? 'سعر ساعة العمل (بالدينار العراقي): *'
                          : 'سعر النقلة أو كلفة الطريق (بالدينار العراقي) - اختياري حسب الاتفاق:'}
                      </label>
                      <input
                        type="number"
                        required={pricingType === 'hourly'}
                        placeholder={pricingType === 'hourly' ? 'مثال: 60000' : 'يمكن تركه فارغاً أو كتابة السعر إن وجد'}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition"
                      />
                      {pricingType === 'road' && (
                        <p className="text-[10px] text-amber-700 font-bold">
                          💡 إذا تركت الحقل فارغاً، سيظهر للعملاء "السعر حسب الاتفاق والتفاوض".
                        </p>
                      )}
                    </div>

                    {/* Base Location */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">المحافظة المتواجد بها:</label>
                        <select
                          value={governorate}
                          onChange={(e) => {
                            const gov = e.target.value as Governorate;
                            setGovernorate(gov);
                            setDistrict('');
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                        >
                          {GOVERNORATES.map((gov) => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">القضاء:</label>
                        <select
                          value={district}
                          required
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                        >
                          <option value="">اختر القضاء...</option>
                          {getDistrictOptions(governorate).map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Service Route / Coverage Multi-Select */}
                    {pricingType === 'road' ? (
                      <div className="space-y-2 bg-amber-500/5 p-3 rounded-2xl border border-amber-500/20">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Navigation className="h-3.5 w-3.5 text-amber-600 inline" />
                          وجهات ومسارات النقل والوصول المتاحة (من - إلى):
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 block">المحافظة التي ينطلق منها:</span>
                            <div className="bg-white px-2.5 py-1.5 rounded-xl border text-xs font-bold text-slate-800">
                              {governorate} {district ? `(${district})` : ''}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 block">المحافظة المستهدفة للنقل والوصول:</span>
                            <select
                              value={destinationGov}
                              onChange={(e) => {
                                setDestinationGov(e.target.value as Governorate);
                                setDestinationDist('');
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800"
                            >
                              {GOVERNORATES.map(gov => (
                                <option key={gov} value={gov}>{gov}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">تغطية المحافظات المجاورة للعمل:</label>
                          <label className="flex items-center gap-1.5 text-xs text-amber-700 font-bold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={coverAllIraq}
                              onChange={(e) => setCoverAllIraq(e.target.checked)}
                              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                            />
                            <span>🇮🇶 تغطي جميع محافظات العراق</span>
                          </label>
                        </div>

                        {!coverAllIraq && (
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                            {GOVERNORATES.map(gov => {
                              const isSelected = selectedCoverageGovs.includes(gov);
                              return (
                                <button
                                  type="button"
                                  key={gov}
                                  onClick={() => toggleCoverageGov(gov)}
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
                                    isSelected
                                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {gov}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPublishStep(1)}
                        className="w-1/3 bg-slate-100 text-slate-700 py-2.5 rounded-2xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                      >
                        السابق
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!district) {
                            alert('الرجاء اختيار القضاء للمتابعة.');
                            return;
                          }
                          setPublishStep(3);
                        }}
                        className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer"
                      >
                        المتابعة إلى تحديد الموقع والصور ←
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Interactive Location Selector on Map, Photos & Submit */}
                {publishStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">وصف وشروط الخدمة:</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="اكتب تفاصيل كاملة مثل: موديل الالة، توفر الكسارة، خبرة السائق، مواعيد العمل والجاهزية..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition"
                      />
                    </div>

                    {/* Map Pin Selector */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">حدد موقع الآلية الدقيق على الخريطة:</label>
                        <span className="text-[10px] text-emerald-600 font-bold">📍 انقر على أي مكان بالخريطة</span>
                      </div>
                      
                      <div className="h-40 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                        <InteractiveMap
                          listings={[]}
                          interactiveMode="select-location"
                          onLocationSelect={(x, y) => setLocation({ x, y })}
                          tempSelectedLocation={location}
                        />
                      </div>
                    </div>

                    {/* Preset Photos Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">صورة المعاينة المعروضة:</label>
                      <div className="flex gap-2 overflow-x-auto pb-1" dir="rtl">
                        {(PRESET_MACHINERY_IMAGES[type] || PRESET_MACHINERY_IMAGES['shovel']).map((imgUrl, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedPresetImage(imgUrl)}
                            className={`relative h-16 w-24 rounded-xl overflow-hidden border cursor-pointer flex-shrink-0 transition ${
                              selectedPresetImage === imgUrl ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="machinery preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            {selectedPresetImage === imgUrl && (
                              <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-amber-700" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPublishStep(2)}
                        className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                      >
                        السابق
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 py-3 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
                      >
                        أنشئ الإعلان وانشر الخدمة الآن 🚀
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
