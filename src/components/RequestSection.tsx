import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MachineryType, PricingType, Governorate, ServiceRequest, RequestStatus, AppNotification, UserAccount } from '../types';
import { GOVERNORATES, DISTRICTS_BY_GOVERNORATE, MACHINERY_DETAILS } from '../data';
import { 
  Calendar, Clock, MapPin, Phone, User, CheckCircle2, AlertCircle, Info, 
  Truck, ShieldCheck, Plus, X, ListFilter, ClipboardList, CheckCircle, Bell, 
  XCircle, Award, Star, RefreshCw, ChevronDown, ArrowLeftRight, Navigation, Map
} from 'lucide-react';
import ProviderRatingModal from './ProviderRatingModal';
import InteractiveMap from './InteractiveMap';

interface RequestSectionProps {
  requests: ServiceRequest[];
  notifications: AppNotification[];
  currentUser?: UserAccount;
  onAddRequest: (newRequest: Omit<ServiceRequest, 'id' | 'date' | 'status'>) => void;
  onUpdateRequestStatus: (requestId: string, newStatus: RequestStatus) => void;
  onRateProvider: (data: { listingId: string; rating: number; comment: string; reviewerName: string }) => void;
  onMarkNotificationRead?: (notificationId?: string) => void;
}

const MACHINERY_IMAGES: Record<MachineryType, string> = {
  'shovel': 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=600',
  'excavator': 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600',
  'crane': 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600',
  'trailer': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600',
  'grader': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=600',
  'dumper': 'https://images.unsplash.com/photo-1501516069922-a9982bd6f3bd?auto=format&fit=crop&q=80&w=600',
  'roller': 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600',
  'kia': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=600',
  'flatbed': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600',
  'mixer': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
  'water_tanker': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
  'bobcat': 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=600'
};

const STATUS_CONFIG: Record<RequestStatus, { 
  text: string; 
  color: string; 
  bg: string; 
  borderColor: string; 
  icon: React.ElementType;
}> = {
  'pending': { 
    text: 'بانتظار العروض (قيد الانتظار)', 
    color: 'text-amber-800', 
    bg: 'bg-amber-500/10', 
    borderColor: 'border-amber-500/30',
    icon: Clock 
  },
  'accepted': { 
    text: 'تم قبول الطلب (مقبول ✓)', 
    color: 'text-emerald-800', 
    bg: 'bg-emerald-500/10', 
    borderColor: 'border-emerald-500/30',
    icon: CheckCircle2 
  },
  'approved': { 
    text: 'تم قبول الطلب (مقبول ✓)', 
    color: 'text-emerald-800', 
    bg: 'bg-emerald-500/10', 
    borderColor: 'border-emerald-500/30',
    icon: CheckCircle2 
  },
  'rejected': { 
    text: 'تم رفض الطلب (مرفوض ✕)', 
    color: 'text-rose-800', 
    bg: 'bg-rose-500/10', 
    borderColor: 'border-rose-500/30',
    icon: XCircle 
  },
  'ongoing': { 
    text: 'قيد التنفيذ والعمل 🚚', 
    color: 'text-blue-800', 
    bg: 'bg-blue-500/10', 
    borderColor: 'border-blue-500/30',
    icon: Truck 
  },
  'completed': { 
    text: 'مكتمل بنجاح 🎉', 
    color: 'text-indigo-800', 
    bg: 'bg-indigo-500/10', 
    borderColor: 'border-indigo-500/30',
    icon: Award 
  },
  'cancelled': { 
    text: 'ملغي', 
    color: 'text-slate-600', 
    bg: 'bg-slate-100', 
    borderColor: 'border-slate-200',
    icon: XCircle 
  }
};

export default function RequestSection({
  requests,
  notifications,
  currentUser,
  onAddRequest,
  onUpdateRequestStatus,
  onRateProvider,
  onMarkNotificationRead
}: RequestSectionProps) {
  // Modal State for Booking Form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form input fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [machineryType, setMachineryType] = useState<MachineryType>('shovel');
  const [requestType, setRequestType] = useState<PricingType>('hourly');
  const [durationOrDistance, setDurationOrDistance] = useState<number>(4);
  
  // Origin / Site location
  const [originGov, setOriginGov] = useState<Governorate>('بغداد');
  const [originDistrict, setOriginDistrict] = useState<string>('الكرادة');
  
  // Destination location for transfers
  const [destGov, setDestGov] = useState<Governorate>('البصرة');
  const [destDistrict, setDestDistrict] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Success indicator within Modal
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedRequest, setPlacedRequest] = useState<any>(null);

  // Detail Modal view
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<ServiceRequest | null>(null);

  // Filters for requests list
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<MachineryType | ''>('');
  const [selectedGovFilter, setSelectedGovFilter] = useState<Governorate | ''>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<RequestStatus | ''>('');

  // Notifications drawer state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Provider Rating Modal state
  const [ratingTarget, setRatingTarget] = useState<{
    id: string;
    title: string;
    providerName: string;
  } | null>(null);

  // Status Changer Open Menu per Request
  const [openStatusMenuReqId, setOpenStatusMenuReqId] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto populate customer phone and name when modal opens
  useEffect(() => {
    if (isFormOpen) {
      if (currentUser) {
        if (!customerPhone) setCustomerPhone(currentUser.phone || '07701234567');
        if (!customerName) setCustomerName(currentUser.name || 'مستأجر آليات');
      } else {
        if (!customerPhone) setCustomerPhone('07701234567');
        if (!customerName) setCustomerName('شركة بابل للمقاولات');
      }
    }
  }, [isFormOpen, currentUser]);

  const handleMachineryChange = (type: MachineryType) => {
    setMachineryType(type);
    if (type === 'trailer' || type === 'kia' || type === 'flatbed' || type === 'water_tanker') {
      setRequestType('road');
    } else {
      setRequestType('hourly');
    }
  };

  const getEstimatedPrice = (): number => {
    const details = MACHINERY_DETAILS[machineryType] || MACHINERY_DETAILS['shovel'];
    const baseRate = requestType === 'hourly' ? details.defaultHourly : details.defaultRoad;
    return baseRate * durationOrDistance;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      alert('يرجى ملء اسم العميل ورقم الموبايل لإتمام طلب الحجز.');
      return;
    }

    const estimatedTotal = getEstimatedPrice();
    const mechName = MACHINERY_DETAILS[machineryType]?.name || machineryType;

    const requestPayload = {
      serviceId: `REQ-M-${Math.floor(Math.random() * 10000)}`,
      serviceTitle: requestType === 'road' 
        ? `طلب نقل (${mechName}): من ${originGov} إلى ${destGov}`
        : `طلب تشغيل (${mechName}): ${originGov} - ${originDistrict || 'مركز المحافظة'}`,
      machineryType,
      customerName,
      customerPhone,
      requestType,
      durationOrDistance,
      totalPrice: estimatedTotal,
      governorate: originGov,
      district: originDistrict || 'مركز المحافظة',
      originGovernorate: originGov,
      originDistrict: originDistrict || undefined,
      destinationGovernorate: requestType === 'road' ? destGov : undefined,
      destinationDistrict: requestType === 'road' && destDistrict ? destDistrict : undefined,
      notes
    };

    onAddRequest(requestPayload);
    setPlacedRequest(requestPayload);
    setIsSuccess(true);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-IQ') + ' د.ع';
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesType = !selectedTypeFilter || req.machineryType === selectedTypeFilter;
    const matchesGov = !selectedGovFilter || req.governorate === selectedGovFilter || req.originGovernorate === selectedGovFilter || req.destinationGovernorate === selectedGovFilter;
    const matchesStatus = !selectedStatusFilter || 
      (selectedStatusFilter === 'accepted' ? (req.status === 'accepted' || req.status === 'approved') : req.status === selectedStatusFilter);
    return matchesType && matchesGov && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-28 sm:pb-32 font-sans text-slate-900" id="requests-marketplace-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" dir="rtl">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900">سوق الخدمات والآليات المطلوبة</h1>
          <p className="text-[11px] text-slate-500 font-bold">طلبات المستأجرين للعمل بالساعة أو نقل المواد والآليات بين المحافظات</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            onClick={() => {
              setIsNotificationsOpen(true);
              if (onMarkNotificationRead) onMarkNotificationRead();
            }}
            className="relative bg-white border border-slate-200 hover:border-amber-500 p-2.5 rounded-2xl text-slate-700 hover:text-amber-600 transition shadow-sm cursor-pointer"
            title="الإشعارات والتحديثات"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Post Request CTA */}
          <button
            onClick={() => {
              setIsFormOpen(true);
              setIsSuccess(false);
              setPlacedRequest(null);
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[11px] px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition active:scale-95"
          >
            <Plus className="h-4 w-4 text-slate-950" />
            <span>طلب وحجز آلية جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-sm space-y-2" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value as MachineryType | '')}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="">جميع أنواع الآليات المطلوبة</option>
            {Object.entries(MACHINERY_DETAILS).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>

          <select
            value={selectedGovFilter}
            onChange={(e) => setSelectedGovFilter(e.target.value as Governorate | '')}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="">جميع المحافظات</option>
            {GOVERNORATES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as RequestStatus | '')}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="">جميع حالات الطلب</option>
            <option value="pending">بانتظار العروض</option>
            <option value="accepted">مقبول ومؤكد</option>
            <option value="ongoing">قيد التنفيذ والعمل</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      {/* Main Requested Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
        {filteredRequests.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
            <ClipboardList className="h-10 w-10 text-amber-500 mx-auto" />
            <p className="text-sm font-black text-slate-800">لا توجد طلبات تشغيل مطابقة للتصفية الحالية</p>
            <p className="text-xs text-slate-500">يمكنك إضافة طلب جديد بالضغط على "طلب وحجز آلية جديدة"</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const statusConfig = STATUS_CONFIG[req.status] || STATUS_CONFIG['pending'];
            const StatusIcon = statusConfig.icon;
            const mechInfo = MACHINERY_DETAILS[req.machineryType] || MACHINERY_DETAILS['shovel'];
            const bgImage = MACHINERY_IMAGES[req.machineryType] || MACHINERY_IMAGES['shovel'];

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequestDetail(req)}
                className="bg-white border border-slate-200 hover:border-amber-500/50 rounded-3xl overflow-hidden p-4 flex flex-col justify-between space-y-3.5 cursor-pointer group transition duration-300 shadow-sm hover:shadow-md"
              >
                {/* Header Information inside Card */}
                <div className="flex gap-3">
                  <div className="h-20 w-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 relative">
                    <img
                      src={bgImage}
                      alt={req.serviceTitle}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 right-1 bg-slate-950/80 text-amber-400 text-[8px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                      طلب #{req.id}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusConfig.color} ${statusConfig.bg} ${statusConfig.borderColor}`}>
                        <StatusIcon className="h-3 w-3 flex-shrink-0 stroke-[2.5]" />
                        <span>{statusConfig.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">{req.date}</span>
                    </div>

                    <h3 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-amber-600 transition">
                      مطلب: {mechInfo.name}
                    </h3>

                    <p className="text-[10px] font-bold text-slate-500 line-clamp-1">
                      الطلب مقدم من: <span className="text-slate-800">{req.customerName}</span>
                    </p>
                  </div>
                </div>

                {/* Location / Route breakdown */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 text-xs space-y-2 text-right font-bold">
                  {req.requestType === 'road' || req.destinationGovernorate ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl space-y-1.5 text-right">
                      <div className="flex items-center justify-between text-[11px] text-amber-900">
                        <span className="text-amber-900 font-extrabold text-[10px] flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-amber-600" />
                          مسار النقل المخطط:
                        </span>
                        <span className="bg-amber-500/20 text-amber-950 px-2 py-0.5 rounded-md text-[9px] font-black">
                          حسب الطريق والنقل
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-amber-500/30 text-[11px] font-black">
                        <div className="flex items-center gap-1 text-slate-900">
                          <span className="text-amber-700 text-[10px] font-bold">من:</span>
                          <span>{req.originGovernorate || req.governorate} {req.originDistrict ? `(${req.originDistrict})` : ''}</span>
                        </div>
                        <div className="p-1 bg-amber-500/10 rounded-full text-amber-600">
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex items-center gap-1 text-slate-900">
                          <span className="text-amber-700 text-[10px] font-bold">إلى:</span>
                          <span>{req.destinationGovernorate || 'جميع المحافظات'} {req.destinationDistrict ? `(${req.destinationDistrict})` : ''}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-800">
                      <span className="text-slate-500 text-[10px] flex items-center gap-1 font-extrabold">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        موقع العمل والتشغيل:
                      </span>
                      <span className="flex items-center gap-1 font-black bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        {req.governorate} {req.district ? `- ${req.district}` : ''}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-200/60 pt-1.5 text-[11px]">
                    <span className="text-slate-500 text-[10px]">حجم العمل والتشغيل:</span>
                    <span className="text-slate-800 font-bold">
                      {req.durationOrDistance} {req.requestType === 'hourly' ? 'ساعات عمل' : 'رحلات / نقلات'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-amber-700 font-extrabold text-[10px]">الميزانية المرصودة للخدمة:</span>
                    <span className="text-amber-600 font-black font-mono text-xs">{formatPrice(req.totalPrice)}</span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-amber-600 font-black text-[11px] group-hover:underline">
                    عرض تفاصيل الطلب الخارطة ←
                  </span>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`tel:${req.customerPhone}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 transition"
                    >
                      <Phone className="h-3 w-3 text-amber-600" />
                      <span>اتصال</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Request Details Modal */}
      <AnimatePresence>
        {selectedRequestDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto" dir="rtl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative my-auto w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-right font-sans"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">تفاصيل الخدمة والطلب #{selectedRequestDetail.id}</h2>
                    <span className="text-[10px] text-slate-500 font-bold">تاريخ النشر: {selectedRequestDetail.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRequestDetail(null)}
                  className="p-1.5 hover:bg-slate-200 rounded-xl text-slate-500 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                {/* Status Header */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">حالة الطلب الحالية:</span>
                    <span className="text-xs font-black text-amber-900">
                      {STATUS_CONFIG[selectedRequestDetail.status]?.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onUpdateRequestStatus(selectedRequestDetail.id, 'accepted');
                        setSelectedRequestDetail(prev => prev ? { ...prev, status: 'accepted' } : null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      قبول الطلب ✓
                    </button>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-bold text-slate-800">
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">الآلية المطلوبة:</span>
                    <span>{MACHINERY_DETAILS[selectedRequestDetail.machineryType]?.name}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">صاحب الطلب / الشركة:</span>
                    <span>{selectedRequestDetail.customerName}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">نوع التشغيل:</span>
                    <span>{selectedRequestDetail.requestType === 'hourly' ? 'بالساعة مع سائق' : 'حسب الطريق والنقلات'}</span>
                  </div>

                  {selectedRequestDetail.requestType === 'road' || selectedRequestDetail.destinationGovernorate ? (
                    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 p-3.5 rounded-2xl border border-amber-500/30 space-y-2.5 my-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                          <Truck className="h-4 w-4 text-amber-600" />
                          مسار النقل المخطط من والى:
                        </span>
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          نقل ومقاولات طرق
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                        <div className="bg-white p-2.5 rounded-xl border border-amber-500/20 space-y-1 shadow-2xs">
                          <span className="text-[10px] text-amber-800 font-extrabold block">موقع التحميل (من):</span>
                          <p className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-amber-600" />
                            {selectedRequestDetail.originGovernorate || selectedRequestDetail.governorate}
                            {selectedRequestDetail.originDistrict && <span className="text-slate-500 text-[11px] font-bold">({selectedRequestDetail.originDistrict})</span>}
                          </p>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-amber-500/20 space-y-1 shadow-2xs">
                          <span className="text-[10px] text-amber-800 font-extrabold block">موقع الوصول (إلى):</span>
                          <p className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <Navigation className="h-3.5 w-3.5 text-orange-600" />
                            {selectedRequestDetail.destinationGovernorate || 'جميع المحافظات'}
                            {selectedRequestDetail.destinationDistrict && <span className="text-slate-500 text-[11px] font-bold">({selectedRequestDetail.destinationDistrict})</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 flex items-center gap-1 font-bold">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        موقع العمل والتشغيل الميداني:
                      </span>
                      <span className="text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                        {selectedRequestDetail.governorate} {selectedRequestDetail.district ? `- ${selectedRequestDetail.district}` : ''}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-1 text-sm font-black text-amber-700">
                    <span>الميزانية المرصودة:</span>
                    <span>{formatPrice(selectedRequestDetail.totalPrice)}</span>
                  </div>
                </div>

                {/* Interactive Map Visualizer */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">تتبع الموقع والوجهة على الخريطة:</label>
                  <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200">
                    <InteractiveMap listings={[]} />
                  </div>
                </div>

                {/* Call & Direct Contact */}
                <a
                  href={`tel:${selectedRequestDetail.customerPhone}`}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
                >
                  <Phone className="h-4 w-4" />
                  <span>اتصال مباشر بـ {selectedRequestDetail.customerName} ({selectedRequestDetail.customerPhone})</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications Drawer Popover */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4" dir="rtl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-right font-sans my-auto"
            >
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">مركز الإشعارات وتحديثات الطلبات</h2>
                    <span className="text-[10px] text-slate-400">تحديثات فورية لحالة طلبك من 'بانتظار العروض' إلى 'مقبول'</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Bell className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">لا توجد إشعارات جديدة حالياً</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const statusConfig = STATUS_CONFIG[notif.status] || STATUS_CONFIG['pending'];
                    const NotifIcon = statusConfig.icon;

                    return (
                      <div
                        key={notif.id}
                        className="p-3.5 rounded-2xl border transition space-y-2 bg-slate-50 border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.borderColor}`}>
                              <NotifIcon className="h-4 w-4 stroke-[2.5]" />
                            </div>
                            <div>
                              <h3 className="text-xs font-black text-slate-900">{notif.requestTitle}</h3>
                              <span className="text-[9px] text-slate-500 font-mono">طلب #{notif.requestId}</span>
                            </div>
                          </div>

                          <span className="text-[9px] font-bold text-slate-400 font-sans">{notif.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-bold">إجمالي الإشعارات: {notifications.length}</span>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Provider Rating Modal */}
      {ratingTarget && (
        <ProviderRatingModal
          isOpen={!!ratingTarget}
          onClose={() => setRatingTarget(null)}
          targetId={ratingTarget.id}
          targetTitle={ratingTarget.title}
          providerName={ratingTarget.providerName}
          onSubmitRating={(data) => {
            onRateProvider(data);
          }}
        />
      )}

      {/* Booking Form Popup Centered Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto" dir="rtl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative my-auto w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-right font-sans"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">طلب وحجز آلية جديدة</h2>
                    <p className="text-[10px] text-slate-500 font-bold">احجز شفل، حفارة، تريلة أو كيا لحساب مشروعك</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-xl text-slate-500 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isSuccess && placedRequest ? (
                /* Success screen in Modal */
                <div className="p-6 text-center space-y-4 overflow-y-auto">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900">تم إرسال ونشر طلبك بنجاح!</h3>
                    <p className="text-xs text-slate-500">تم إدراج طلب التشغيل الخاص بك في القائمة، وسيتواصل معك أصحاب الآليات فوراً.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-right text-xs max-w-md mx-auto shadow-sm font-bold">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">نوع الآلية المطلوبة:</span>
                      <span className="text-slate-900">{MACHINERY_DETAILS[placedRequest.machineryType]?.name}</span>
                    </div>

                    {placedRequest.requestType === 'road' ? (
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">مسار النقل:</span>
                        <span className="text-slate-900">{placedRequest.originGovernorate} ⟵ {placedRequest.destinationGovernorate}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">موقع العمل:</span>
                        <span className="text-slate-900">{placedRequest.governorate} - {placedRequest.district}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">حجم التشغيل:</span>
                      <span className="text-slate-900">
                        {placedRequest.durationOrDistance} {placedRequest.requestType === 'hourly' ? 'ساعات' : 'رحلات'}
                      </span>
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">الميزانية المقدرة:</span>
                      <span className="text-amber-600 font-black">{formatPrice(placedRequest.totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-2xl transition cursor-pointer"
                  >
                    العودة لصفحة طلبات التشغيل
                  </button>
                </div>
              ) : (
                /* Multi-step form */
                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Machinery selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">اختر الآلية الثقيلة المطلوبة:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(MACHINERY_DETAILS).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleMachineryChange(key as MachineryType)}
                          className={`p-2 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            machineryType === key
                              ? 'bg-amber-500/10 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[10px] font-black leading-tight">{value.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">اسم صاحب الطلب / الشركة:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: شركة دجلة الإنشائية"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">رقم الهاتف (تلقائي ويمكن تعديله):</label>
                      <input
                        type="tel"
                        required
                        placeholder="077XXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500 focus:bg-white text-left"
                      />
                    </div>
                  </div>

                  {/* Pricing Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">نظام التشغيل وحساب الكلفة:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRequestType('hourly')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                          requestType === 'hourly'
                            ? 'bg-amber-500/10 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-black block">عمل بالساعة</span>
                        <span className="text-[10px] text-slate-500 block font-normal">للعمل في موقع واحد</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRequestType('road')}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                          requestType === 'road'
                            ? 'bg-amber-500/10 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-black block flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-amber-600 inline" />
                          حسب الطريق والنقل
                        </span>
                        <span className="text-[10px] text-slate-500 block font-normal">لنقل المواد بين المدن</span>
                      </button>
                    </div>
                  </div>

                  {/* Locations: Origin & Destination */}
                  {requestType === 'road' ? (
                    <div className="space-y-3 bg-amber-500/5 p-3.5 rounded-2xl border border-amber-500/20">
                      <label className="text-xs font-bold text-slate-900 block">حدد وجهة ومسار النقل (من محافظة إلى أخرى):</label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Origin */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block">من (مكان التحميل والانطلاق):</span>
                          <select
                            value={originGov}
                            onChange={(e) => {
                              const gov = e.target.value as Governorate;
                              setOriginGov(gov);
                              setOriginDistrict('');
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                          >
                            {GOVERNORATES.map(gov => (
                              <option key={gov} value={gov}>{gov}</option>
                            ))}
                          </select>
                          <select
                            value={originDistrict}
                            onChange={(e) => setOriginDistrict(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] text-slate-700 font-bold mt-1"
                          >
                            <option value="">القضاء (اختياري)...</option>
                            {(DISTRICTS_BY_GOVERNORATE[originGov] || []).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        {/* Destination */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block">إلى (مكان التفريغ والوصول):</span>
                          <select
                            value={destGov}
                            onChange={(e) => {
                              const gov = e.target.value as Governorate;
                              setDestGov(gov);
                              setDestDistrict('');
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                          >
                            {GOVERNORATES.map(gov => (
                              <option key={gov} value={gov}>{gov}</option>
                            ))}
                          </select>
                          <select
                            value={destDistrict}
                            onChange={(e) => setDestDistrict(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] text-slate-700 font-bold mt-1"
                          >
                            <option value="">القضاء (اختياري)...</option>
                            {(DISTRICTS_BY_GOVERNORATE[destGov] || []).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">المحافظة (موقع العمل):</label>
                        <select
                          value={originGov}
                          onChange={(e) => {
                            const gov = e.target.value as Governorate;
                            setOriginGov(gov);
                            setOriginDistrict('');
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
                          value={originDistrict}
                          required
                          onChange={(e) => setOriginDistrict(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                        >
                          <option value="">اختر القضاء...</option>
                          {(DISTRICTS_BY_GOVERNORATE[originGov] || []).map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Duration Slider */}
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-amber-900 bg-amber-500/20 px-2 py-0.5 rounded-lg">
                        {durationOrDistance} {requestType === 'hourly' ? 'ساعات تشغيل' : 'نقلات / رحلات'}
                      </span>
                      <label className="text-xs font-bold text-slate-700">
                        {requestType === 'hourly' ? 'عدد ساعات العمل المطلوب حجزها:' : 'عدد الرحلات أو النقلات الكلية:'}
                      </label>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={requestType === 'hourly' ? '48' : '20'}
                      value={durationOrDistance}
                      onChange={(e) => setDurationOrDistance(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Calculator Summary */}
                  <div className="p-3 bg-slate-900 text-white border border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-md">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">الميزانية التقريبية المقدرة:</span>
                      <span className="text-sm font-black text-amber-400 font-mono">{formatPrice(getEstimatedPrice())}</span>
                    </div>

                    <div className="text-left text-[10px] text-emerald-400 font-bold">
                      ✓ شامل الوقود وسائق ذو خبرة
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-3 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer hover:opacity-95"
                  >
                    نشر وتأكيد طلب الخدمة الآن 🚀
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
