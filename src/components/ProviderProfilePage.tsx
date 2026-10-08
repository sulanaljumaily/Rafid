import React from 'react';
import { motion } from 'motion/react';
import { ServiceListing } from '../types';
import { MACHINERY_DETAILS } from '../data';
import { 
  ArrowRight, ShieldCheck, Star, MapPin, Phone, Truck, CheckCircle, 
  ExternalLink, Calendar, Building, Award, Check
} from 'lucide-react';

interface ProviderProfilePageProps {
  ownerName: string;
  listings: ServiceListing[];
  onBack: () => void;
  onSelectListing: (listing: ServiceListing) => void;
  onCallInitiate: (phone: string) => void;
}

export default function ProviderProfilePage({
  ownerName,
  listings,
  onBack,
  onSelectListing,
  onCallInitiate
}: ProviderProfilePageProps) {
  // Find all active listings for this provider
  const providerListings = listings.filter(
    (l) => l.status === 'active' && (
      l.ownerName.trim().toLowerCase() === ownerName.trim().toLowerCase() ||
      l.ownerName.includes(ownerName) ||
      ownerName.includes(l.ownerName)
    )
  );

  // Calculate statistics
  const totalListings = providerListings.length;
  const avgRating = totalListings > 0
    ? (providerListings.reduce((sum, l) => sum + l.rating, 0) / totalListings).toFixed(1)
    : '4.9';
  const totalReviews = providerListings.reduce((sum, l) => sum + l.reviewsCount, 0);

  // Collect unique governorates
  const governorates = Array.from(new Set(providerListings.map((l) => l.governorate)));
  const phone = providerListings[0]?.phone || '07700000000';

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-IQ') + ' د.ع';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 pb-28 sm:pb-32 font-sans text-slate-900"
      dir="rtl"
    >
      {/* Top Header Breadcrumb & Back Navigation Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-2 sm:p-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBack}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer text-[11px]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة للصفحة السابقة</span>
          </button>
          <span className="text-slate-300 font-sans">/</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">بروفايل المورد</span>
        </div>
      </div>

      {/* Provider Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-3.5 sm:p-4 rounded-2xl border border-amber-500/20 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 bg-amber-500 text-slate-950 font-black rounded-2xl flex items-center justify-center text-xl shadow-md ring-2 ring-amber-500/30">
                {ownerName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-slate-900" title="مالك موثق">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-sm sm:text-base font-black text-white">{ownerName}</h1>

              {governorates.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-slate-300">
                  <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <span>مناطق التغطية والعمل: {governorates.join(' ، ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Call to action */}
          <button
            onClick={() => onCallInitiate(phone)}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>اتصل بالمورد الآن</span>
          </button>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5 bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <div className="p-1 border-l border-white/10">
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold block">إجمالي الآليات</span>
            <span className="text-[10px] sm:text-xs font-black text-amber-400 mt-0.5 block leading-tight">{totalListings} معدة</span>
          </div>
          <div className="p-1 border-l border-white/10">
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold block">حالة المالك</span>
            <span className="text-[10px] sm:text-xs font-black text-emerald-400 mt-0.5 block leading-tight">مالك موثق ✓</span>
          </div>
          <div className="p-1">
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold block">التقييم العام</span>
            <span className="text-[10px] sm:text-xs font-black text-amber-300 mt-0.5 block leading-tight">★ {avgRating} ({totalReviews} تقييم)</span>
          </div>
        </div>
      </div>

      {/* List of Machinery Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-amber-600" />
            <h2 className="text-xs sm:text-sm font-black text-slate-900">
              جميع الآليات والمعدات المملوكة لـ ({ownerName})
            </h2>
          </div>
          <span className="text-[10px] text-slate-500 font-bold">العدد: {totalListings}</span>
        </div>

        {providerListings.length === 0 ? (
          <div className="text-center py-8 space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Truck className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-bold">لا توجد آليات معروضة حالياً لهذا المورد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {providerListings.map((listing) => {
              const mech = MACHINERY_DETAILS[listing.type];

              return (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing)}
                  className="bg-white border border-slate-200 hover:border-amber-500 rounded-xl p-2.5 space-y-2 cursor-pointer group transition duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="relative h-32 sm:h-36 w-full bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs text-amber-400 text-[9px] font-black px-2 py-0.5 rounded border border-white/10">
                      {mech?.name || listing.type}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-amber-700 font-black border border-slate-200 shadow-2xs font-mono">
                      {formatPrice(listing.price)} {listing.pricingType === 'hourly' ? '/ ساعة' : '/ نقلة'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition line-clamp-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {listing.governorate} - {listing.district}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-black">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        {listing.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-amber-600 font-black group-hover:underline flex items-center gap-0.5">
                      <span>عرض التفاصيل</span>
                      <ExternalLink className="h-3 w-3 inline" />
                    </span>
                    <span className="text-slate-400 font-mono text-[9px]">#{listing.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
