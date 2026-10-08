import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceListing, Governorate, ServiceRequest } from '../types';
import { MACHINERY_DETAILS, GOVERNORATES, DISTRICTS_BY_GOVERNORATE } from '../data';
import { 
  ArrowRight, Star, MapPin, Phone, ShieldCheck, CheckCircle, Truck, 
  Clock, FileText, Share2, Award, Zap, ChevronLeft, ChevronDown, Sparkles, Building2, User,
  X, Calendar, Calculator, CheckCircle2
} from 'lucide-react';

interface MachineryDetailPageProps {
  listing: ServiceListing;
  allListings: ServiceListing[];
  onBack: () => void;
  onSelectListing: (listing: ServiceListing) => void;
  onOpenProviderProfile: (ownerName: string) => void;
  onCallInitiate: (phone: string) => void;
  onNavigateToBooking: (listing: ServiceListing) => void;
  onAddRequest?: (newRequest: Omit<ServiceRequest, 'id' | 'date' | 'status'>) => void;
}

export default function MachineryDetailPage({
  listing,
  allListings,
  onBack,
  onSelectListing,
  onOpenProviderProfile,
  onCallInitiate,
  onNavigateToBooking,
  onAddRequest
}: MachineryDetailPageProps) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isGuaranteeExpanded, setIsGuaranteeExpanded] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState<Governorate>(listing.governorate);
  const [district, setDistrict] = useState(listing.district);
  const [durationOrDistance, setDurationOrDistance] = useState<number>(4);
  const [reqDate, setReqDate] = useState('2026-07-25');
  const [reqTime, setReqTime] = useState('08:00');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const mech = MACHINERY_DETAILS[listing.type];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setBookingError('يرجى كتابة الاسم ورقم الهاتف لإكمال الحجز الإلكتروني.');
      return;
    }
    setBookingError('');

    const newReqData = {
      serviceId: listing.id,
      serviceTitle: listing.title,
      machineryType: listing.type,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      requestType: listing.pricingType,
      durationOrDistance,
      totalPrice: listing.price * durationOrDistance,
      governorate,
      district: district || listing.district,
    };

    if (onAddRequest) {
      onAddRequest(newReqData);
    }
    setBookingSuccess(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setBookingSuccess(false);
    setBookingError('');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-IQ') + ' د.ع';
  };

  // Find suggested/similar machinery from the same type or governorate
  const suggestedListings = allListings.filter(
    (item) => item.id !== listing.id && item.status === 'active' && (
      item.type === listing.type || item.governorate === listing.governorate
    )
  );

  const displaySuggestions = suggestedListings.length > 0
    ? suggestedListings.slice(0, 4)
    : allListings.filter((item) => item.id !== listing.id && item.status === 'active').slice(0, 4);

  const activeImage = listing.images[selectedImgIdx] || listing.images[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-4 sm:space-y-5 pb-28 sm:pb-32 font-sans text-slate-900 max-w-5xl mx-auto"
      dir="rtl"
    >
      {/* Top Header Navigation Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBack}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs text-xs"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>عودة</span>
          </button>
          <span className="text-slate-300 font-sans">/</span>
          <span className="text-slate-500 text-xs truncate max-w-[140px] sm:max-w-xs font-bold">
            {listing.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer text-xs font-bold flex items-center gap-1"
            title="مشاركة رابط الآلية"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline text-[11px]">{copied ? 'تم النسخ!' : 'مشاركة'}</span>
          </button>
        </div>
      </div>

      {/* Main Bento UI Container */}
      <div className="grid grid-cols-12 gap-3.5 sm:gap-4">

        {/* Bento Tile 1: Gallery & Main Image (col-span-12 lg:col-span-7) */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-3 sm:p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="relative h-64 sm:h-80 w-full bg-slate-900 rounded-2xl overflow-hidden group">
            <img
              src={activeImage}
              alt={listing.title}
              className="h-full w-full object-cover group-hover:scale-102 transition duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Category Tag Overlay */}
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-400 text-[11px] font-black border border-white/10 shadow-sm flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-amber-400" />
              <span>{mech?.name || listing.type}</span>
            </div>

            {/* Availability Badge */}
            <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>جاهزة للعمل فوراً</span>
            </div>

            {/* Price Badge Overlay */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-lg">
              <span className="text-base sm:text-lg font-black text-amber-600 block font-mono leading-none">
                {formatPrice(listing.price)}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5 font-bold">
                {listing.pricingType === 'hourly' ? 'لكل ساعة تشغيلية' : 'لكل نقلة / مشوار'}
              </span>
            </div>
          </div>

          {/* Thumbnails row (if multiple images) */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative h-14 w-18 sm:h-16 sm:w-22 rounded-xl overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                    selectedImgIdx === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`صورة ${idx + 1}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bento Tile 2: Hero Info, Title & Actions Panel (col-span-12 lg:col-span-5) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Title & ID */}
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {listing.title}
            </h1>
            <div className="text-[10px] font-mono text-slate-400 font-bold">
              معرف الآلية: #{listing.id}
            </div>
          </div>

          {/* Provider / Owner Bento Box */}
          <div className="bg-slate-50 border border-slate-200/90 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-10 w-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-xs">
                {listing.ownerName.charAt(0)}
              </div>
              <div className="min-w-0 text-right space-y-0.5">
                <button
                  type="button"
                  onClick={() => onOpenProviderProfile(listing.ownerName)}
                  className="text-xs sm:text-sm font-black text-slate-900 hover:text-amber-600 transition truncate block text-right cursor-pointer"
                >
                  {listing.ownerName}
                </button>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-bold flex-wrap">
                  <span className="flex items-center gap-0.5">
                    <span>مالك موثق</span>
                    <CheckCircle className="h-3 w-3 text-emerald-600 inline" />
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-0.5 text-amber-700 font-black">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{listing.rating.toFixed(1)} ({listing.reviewsCount} تقييم)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Call & Booking Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onCallInitiate(listing.phone)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>اتصال</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer text-center shadow-xs whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
              <span>حجز الكتروني</span>
            </button>
          </div>
        </div>

        {/* Bento Tile 3: Location & Coverage Tile (col-span-6) */}
        <div className="col-span-6 bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-[10px] text-amber-800 font-extrabold uppercase bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
              <MapPin className="h-3 w-3 text-amber-600" />
              <span>النطاق والموقع</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] sm:text-xs text-slate-500 font-bold">الموقع الرئيسي:</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {listing.governorate} — {listing.district}
              </span>
            </div>

            {listing.pricingType === 'road' && listing.destinationGovernorate ? (
              <div className="text-[11px] font-black text-amber-800 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                <span>مسار النقل المتاح: من {listing.governorate} ⟵ إلى {listing.destinationGovernorate}</span>
              </div>
            ) : listing.coverageGovernorates && listing.coverageGovernorates.length > 0 ? (
              <div className="text-[10px] font-bold text-slate-700 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <span>المحافظات المغطاة: {listing.coverageGovernorates.join('، ')}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bento Tile 4: Pricing & Rate Specs Tile (col-span-6) */}
        <div className="col-span-6 bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-[10px] text-slate-700 font-extrabold uppercase bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-600" />
              <span>نظام الاحتساب</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] sm:text-xs text-slate-500 font-bold">سعر الخدمة الأساسي:</div>
            <div className="text-sm sm:text-base font-black text-amber-600 font-mono">
              {formatPrice(listing.price)} <span className="text-[10px] sm:text-xs text-slate-600 font-sans font-bold">({listing.pricingType === 'hourly' ? 'بالساعة' : 'بالنقلة'})</span>
            </div>
          </div>
        </div>

        {/* Bento Tile 5: Full Description & Specifications (col-span-12) */}
        <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <span>المواصفات:</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
            {listing.description}
          </p>

          {/* Platform Quality Guarantee Box */}
          <div className="bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white border border-emerald-200 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <button
              type="button"
              onClick={() => setIsGuaranteeExpanded(!isGuaranteeExpanded)}
              className="w-full p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-emerald-100/40 transition text-right"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>ضمان منصة رافد الرسمية</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-emerald-600 transition-transform duration-200 ${isGuaranteeExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isGuaranteeExpanded && (
              <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 pt-0.5 space-y-1.5 border-t border-emerald-200/60">
                <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-black pt-1">
                  <span>✓ آلية مفحوصة</span>
                  <span>•</span>
                  <span>✓ دعم 24/7</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-950/80 font-bold leading-normal">
                  توفير آلية بديلة فورية عند الأعطال ودعم مستمر لضمان استمرار العمل دون انقطاع.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bento Tile 7: Suggested Machinery Cards Grid (col-span-12) */}
        <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-600" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900">آليات مقترحة من نفس الفئة والموقع</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">خيارات متوفرة حالياً</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {displaySuggestions.map((sug) => {
              const sugMech = MACHINERY_DETAILS[sug.type];
              return (
                <div
                  key={sug.id}
                  onClick={() => onSelectListing(sug)}
                  className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-2.5 flex flex-col justify-between gap-2 cursor-pointer group transition duration-200 shadow-2xs hover:shadow-md"
                >
                  <div className="relative h-28 w-full bg-slate-200 rounded-xl overflow-hidden">
                    <img
                      src={sug.images[0]}
                      alt={sug.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-slate-950/80 backdrop-blur-xs text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-white/10">
                      {sugMech?.name || sug.type}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition truncate">
                      {sug.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate font-bold">المالك: {sug.ownerName}</span>
                      <span className="font-mono font-black text-amber-600 whitespace-nowrap">{formatPrice(sug.price)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Online Booking Popup Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col text-right"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Calendar className="h-4 w-4" />
                    <span>طلب حجز إلكتروني سريع</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black truncate max-w-[280px] sm:max-w-xs">
                    {listing.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                {bookingSuccess ? (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        تم تسجيل حجزك الإلكتروني بنجاح!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-xs mx-auto leading-relaxed">
                        تم إرسال تفاصيل الطلب إلى المالك <span className="text-slate-900 font-black">{listing.ownerName}</span>. سيتم التواصل معك على الرقم <span className="text-amber-600 font-mono font-black">{customerPhone}</span> فوراً لتأكيد انطلاق الآلية.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-right">
                      <div className="flex justify-between text-xs text-slate-600 font-bold">
                        <span>الآلية المحجوزة:</span>
                        <span className="text-slate-900 font-black">{listing.title}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 font-bold">
                        <span>المدة المحسوبة:</span>
                        <span className="text-slate-900 font-black">{durationOrDistance} {listing.pricingType === 'hourly' ? 'ساعات' : 'نقلات'}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 font-bold pt-1 border-t border-slate-200">
                        <span>إجمالي التكلفة التقديرية:</span>
                        <span className="text-amber-600 font-mono font-black">{formatPrice(listing.price * durationOrDistance)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => onCallInitiate(listing.phone)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                      >
                        <Phone className="h-4 w-4" />
                        <span>اتصال مباشر بالمالك ({listing.phone})</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleCloseModal();
                            onNavigateToBooking(listing);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                        >
                          متابعة طلباتي
                        </button>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                        >
                          إغلاق النافذة
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    {/* Error Banner */}
                    {bookingError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
                        {bookingError}
                      </div>
                    )}

                    {/* Quick Specs summary */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 font-bold block text-[10px]">المالك: {listing.ownerName}</span>
                        <span className="font-black text-slate-900">{listing.governorate} — {listing.district}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-slate-500 font-bold block text-[10px]">السعر الأساسي:</span>
                        <span className="font-mono font-black text-amber-600">{formatPrice(listing.price)} / {listing.pricingType === 'hourly' ? 'ساعة' : 'نقلة'}</span>
                      </div>
                    </div>

                    {/* Customer Info Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اسم صاحب الطلب / الكفيل <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="مثال: أحمد جاسم العبيدي"
                          className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          رقم الهاتف للتواصل والتأكيد <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0770XXXXXXX"
                          className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold text-left"
                          dir="ltr"
                        />
                      </div>

                      {/* Location selectors */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            المحافظة
                          </label>
                          <select
                            value={governorate}
                            onChange={(e) => {
                              const gov = e.target.value as Governorate;
                              setGovernorate(gov);
                              setDistrict(DISTRICTS_BY_GOVERNORATE[gov]?.[0] || '');
                            }}
                            className="w-full px-2.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold bg-white"
                          >
                            {GOVERNORATES.map((gov) => (
                              <option key={gov} value={gov}>{gov}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            القضاء / الناحية
                          </label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-2.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold bg-white"
                          >
                            {(DISTRICTS_BY_GOVERNORATE[governorate] || []).map((dist) => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Duration / Quantity selector */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          عدد {listing.pricingType === 'hourly' ? 'الساعات المطلوبة' : 'النقلات المطلوبة'}
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 justify-between">
                          <button
                            type="button"
                            onClick={() => setDurationOrDistance(Math.max(1, durationOrDistance - 1))}
                            className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-900 font-black text-lg flex items-center justify-center hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                          >
                            -
                          </button>
                          <span className="font-mono font-black text-base text-slate-900">
                            {durationOrDistance} {listing.pricingType === 'hourly' ? 'ساعات' : 'نقلات'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDurationOrDistance(durationOrDistance + 1)}
                            className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-900 font-black text-lg flex items-center justify-center hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            تاريخ العمل
                          </label>
                          <input
                            type="date"
                            value={reqDate}
                            onChange={(e) => setReqDate(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            وقت الانطلاق
                          </label>
                          <input
                            type="time"
                            value={reqTime}
                            onChange={(e) => setReqTime(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Total Price Calculation Box */}
                    <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-1">
                      <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
                        <span>إجمالي التكلفة التقديرية:</span>
                        <span className="text-[10px] text-slate-400">({durationOrDistance} × {formatPrice(listing.price)})</span>
                      </div>
                      <div className="text-xl font-black font-mono text-amber-400 text-left">
                        {formatPrice(listing.price * durationOrDistance)}
                      </div>
                    </div>

                    {/* Confirm Booking CTA */}
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>تأكيد الحجز الإلكتروني</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

