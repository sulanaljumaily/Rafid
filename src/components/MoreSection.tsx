import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, HelpCircle, PhoneCall, Globe, Info, Settings, 
  ArrowLeft, Ticket, Send, X, ClipboardList, MapPin, Calendar,
  Phone, Clock, CheckCircle, AlertCircle, RefreshCw, MessageSquare
} from 'lucide-react';
import { SupportTicket, ServiceRequest } from '../types';
import { MACHINERY_DETAILS } from '../data';

interface MoreSectionProps {
  onEnterAdmin: () => void;
  isAdmin: boolean;
  tickets: SupportTicket[];
  onAddTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'date'>) => void;
  requests: ServiceRequest[];
  onUpdateRequests: (requests: ServiceRequest[]) => void;
  onCallInitiate: (phoneNum: string) => void;
}

export default function MoreSection({
  onEnterAdmin,
  isAdmin,
  tickets,
  onAddTicket,
  requests,
  onUpdateRequests,
  onCallInitiate
}: MoreSectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSupportForm, setShowSupportForm] = useState(false);
  
  // Sub tab for my requests section
  const [activeRequestSubTab, setActiveRequestSubTab] = useState<'requested' | 'provided'>('requested');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
  // Ticket Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleUpdateRequestStatus = (requestId: string, newStatus: ServiceRequest['status']) => {
    const updated = requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
    onUpdateRequests(updated);
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const faqs = [
    {
      q: 'كيف يتم احتساب كلفة النقل في التريلات؟',
      a: 'يتم احتساب كلفة النقل بالكامل على أساس المسافة المقطوعة بين موقع التجهيز وموقع التفريغ (حسب الطريق)، وتشمل الأجور الوقود وأتعاب السائق المعتمد بالكامل.'
    },
    {
      q: 'ما هو إجراء الصيانة في حال تعطل الآلية أثناء العمل؟',
      a: 'في حال حدوث خلل فني غير ناتج عن سوء الاستخدام، يلتزم مالك الآلية بإيقاف احتساب الساعات فوراً، وتوفير كادر صيانة موقعي أو استبدال الآلية بأخرى مماثلة لضمان استمرار عملك.'
    },
    {
      q: 'هل توفر المنصة فواتير رسمية وعقود تشغيل؟',
      a: 'نعم، نوفر عقود تشغيل قانونية مصدقة وفواتير معتمدة لجميع الشركات والمؤسسات الحكومية والخاصة المسجلة لدينا في المنصة.'
    },
    {
      q: 'هل السعر المعروض للآليات يشمل كلفة السائق؟',
      a: 'نعم، جميع الأسعار المدرجة في منصة رافد تشمل كلفة السائق والمشغل المعتمد والوقود اللازم للتشغيل اليومي بالكامل دون أي رسوم مخفية.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !subject || !message) {
      alert('يرجى ملء جميع الحقول لإرسال تذكرة الدعم الفني.');
      return;
    }

    onAddTicket({
      senderName: name,
      senderPhone: phone,
      subject,
      message
    });

    setTicketSuccess(true);
    setName('');
    setPhone('');
    setSubject('');
    setMessage('');
    setTimeout(() => {
      setTicketSuccess(false);
      setShowSupportForm(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-32 font-sans text-slate-900" id="more-section-container">
      {/* Page Header */}
      <div className="text-right">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">حسابي والمستندات</span>
        <h1 className="text-2xl font-black text-slate-900 mt-0.5">القائمة والمزيد</h1>
      </div>

      {/* User Profile Bento Tile */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm" dir="rtl">
        <div className="flex items-center gap-4 text-right">
          <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-500/20 font-black">
            ع
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">العميل الافتراضي</h3>
            <span className="text-xs text-slate-500 font-mono font-bold">07723334445</span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-50 px-2.5 py-1 rounded-xl text-emerald-700 font-bold border border-slate-200">
          حساب موثق ✓
        </span>
      </div>

      {/* Bento Layout Grid for Utilities */}
      <div className="grid grid-cols-2 gap-4" dir="rtl">
        {/* Support Ticket Tile */}
        <div 
          onClick={() => setShowSupportForm(true)}
          className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2 cursor-pointer hover:bg-slate-50 transition shadow-sm"
        >
          <div className="h-9 w-9 bg-amber-500/10 text-amber-700 rounded-xl flex items-center justify-center">
            <Ticket className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-black text-slate-800 text-right">الدعم الفني</h4>
          <p className="text-[10px] text-slate-600 leading-tight text-right">ارسل تذكرة دعم فني أو بلاغ شكوى لأي مشكلة فنية.</p>
        </div>

        {/* Call center line */}
        <a 
          href="tel:6655"
          className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2 block cursor-pointer hover:bg-slate-50 transition shadow-sm"
        >
          <div className="h-9 w-9 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
            <PhoneCall className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-black text-slate-800 text-right">الخط الساخن الموحد</h4>
          <p className="text-[10px] text-slate-600 leading-tight text-right">اتصل بنا مجاناً على الرقم الموحد (6655) لخدمة الطوارئ.</p>
        </a>
      </div>

      {/* ADMIN PORTAL GATEWAY TILE (BENTO DESIGN) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden" dir="rtl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="space-y-1 text-right max-w-xs">
            <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              خاص بإدارة التطبيق
            </span>
            <h3 className="text-sm font-black text-slate-850 mt-1.5">بوابة التحكم والشركاء</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              تصفح لوحة التحكم لإدارة المستخدمين، متابعة طلبات الآليات، مراجعة فواتير المتجر، وبلاغات الدعم الفني.
            </p>
          </div>
          
          <button
            onClick={onEnterAdmin}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/15 flex items-center gap-1.5 transition cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isAdmin ? 'الذهاب للإدارة' : 'دخول الإدارة'}</span>
          </button>
        </div>
      </div>

      {/* MY REQUESTS TRACKING SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm" dir="rtl" id="my-requests-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-slate-600">
            <ClipboardList className="h-5 w-5 text-amber-600" />
            <h3 className="text-xs font-black text-slate-800">طلباتي وحجوزاتي الجارية</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 self-start">إجمالي الطلبات في المنصة: {requests.length}</span>
        </div>

        {/* Dynamic Segmented Switcher for Request Types */}
        <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 shadow-xs" dir="rtl">
          <button
            type="button"
            onClick={() => setActiveRequestSubTab('requested')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              activeRequestSubTab === 'requested'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-550 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>الخدمات المطلوبة (طلب آلية)</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${activeRequestSubTab === 'requested' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {requests.filter(req => req.customerPhone === '07723334445').length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRequestSubTab('provided')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              activeRequestSubTab === 'provided'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-550 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>طلبات الخدمات (حجوزات واردة)</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${activeRequestSubTab === 'provided' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {requests.filter(req => req.customerPhone !== '07723334445').length}
            </span>
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {requests.filter(req => activeRequestSubTab === 'requested' ? req.customerPhone === '07723334445' : req.customerPhone !== '07723334445').length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-550">لا توجد لديك أي طلبات مسجلة في هذا القسم حالياً.</p>
            </div>
          ) : (
            requests
              .filter(req => activeRequestSubTab === 'requested' ? req.customerPhone === '07723334445' : req.customerPhone !== '07723334445')
              .map((req) => {
                const statusLabels: Record<string, { text: string; bg: string; textClass: string }> = {
                  pending: { text: 'بانتظار العروض ⏳', bg: 'bg-amber-500/10', textClass: 'text-amber-700' },
                  approved: { text: 'تم القبول / مجدول 🗓️', bg: 'bg-emerald-500/10', textClass: 'text-emerald-700' },
                  ongoing: { text: 'جاري العمل والتشغيل 🚜', bg: 'bg-blue-500/10', textClass: 'text-blue-700' },
                  completed: { text: 'مكتمل بنجاح 🏁', bg: 'bg-slate-100', textClass: 'text-slate-600' },
                  cancelled: { text: 'ملغي ❌', bg: 'bg-rose-500/10', textClass: 'text-rose-700' }
                };
                const label = statusLabels[req.status] || { text: req.status, bg: 'bg-slate-50', textClass: 'text-slate-800' };

                return (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 space-y-2 text-right shadow-xs hover:shadow-md hover:border-amber-500/30 transition duration-200 cursor-pointer group"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 group-hover:text-amber-600 transition">
                        {req.serviceTitle || `طلب آلية: ${MACHINERY_DETAILS[req.machineryType]?.name || req.machineryType}`}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${label.bg} ${label.textClass}`}>
                        {label.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1.5 border-t border-slate-200">
                      <div className="flex items-center gap-1 justify-end">
                        <span>{req.governorate} - {req.district}</span>
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <span>تاريخ: {req.date}</span>
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 bg-white border border-slate-100 p-2 rounded-xl">
                      <div className="flex flex-col text-right">
                        <span>كود الطلب: <span className="font-mono font-bold text-slate-600">{req.id}</span></span>
                        <span className="text-[9px] text-slate-400">مقدم الطلب: <span className="font-bold text-slate-700">{req.customerName}</span></span>
                      </div>
                      <div className="text-left">
                        <span className="text-amber-700 font-bold font-mono">الميزانية: <span className="font-black text-amber-600">{(req.totalPrice || 0).toLocaleString('ar-IQ')} د.ع</span></span>
                        <span className="text-amber-600 block text-[9px] font-bold mt-0.5">عرض التفاصيل والتحكم ←</span>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Accordion FAQ Area */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm" dir="rtl">
        <div className="flex items-center gap-2 mb-2 text-slate-600">
          <HelpCircle className="h-5 w-5 text-amber-600" />
          <h3 className="text-xs font-black text-slate-800">الأسئلة الشائعة حول التشغيل</h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-100 pb-2 last:border-none"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-right py-2 text-xs font-bold text-slate-700 hover:text-slate-950 flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <span className="text-amber-600 text-sm font-mono font-bold">
                  {activeFaq === i ? '−' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-[11px] text-slate-500 leading-relaxed mt-1"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* About Us section */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-right text-xs" dir="rtl">
        <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-700">حول منصة رافد</span>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            تأسست منصة رافد عام 2026 لتكون الذراع الرقمي الموثق لإسناد قطاع البناء والإعمار في العراق وتأمين جميع متطلبات الشركات والمقاولين للآليات الثقيلة والمواد الإنشائية بأسرع كفاءة وأقل كلفة تشغيلية.
          </p>
        </div>
      </div>

      {/* Support Form Modal Overlay */}
      <AnimatePresence>
        {showSupportForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-right"
              dir="rtl"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <button
                  onClick={() => setShowSupportForm(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
                <h3 className="text-xs font-black text-slate-900">إرسال بلاغ أو شكوى دعم فني</h3>
              </div>

              {ticketSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-black text-slate-900">تم إرسال بلاغك بنجاح!</h4>
                  <p className="text-xs text-slate-500">سيقوم فريق الدعم الفني بمراجعة التذكرة والرد عليك هاتفياً.</p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="p-5 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">الاسم:</label>
                      <input
                        type="text"
                        required
                        placeholder="الاسم الكامل"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">رقم الهاتف:</label>
                      <input
                        type="tel"
                        required
                        placeholder="077XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 focus:outline-none text-left"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">موضوع الرسالة:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: استفسار عن دفوعات المتجر"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">نص البلاغ / الشكوى بالتفصيل:</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="اكتب هنا تفاصيل المشكلة أو الاستفسار بدقة..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>إرسال البلاغ للدعم الفني</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED SERVICE REQUEST MODAL (صفحة مخصصة لكل طلب) */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-right font-sans"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">تفاصيل الحجز والطلب</h3>
                    <span className="text-[10px] text-slate-400 block font-mono">رقم الطلب: {selectedRequest.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 hover:bg-slate-200 bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Title and main machine info */}
                <div className="space-y-1.5 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                  <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-black inline-block">
                    {MACHINERY_DETAILS[selectedRequest.machineryType]?.name || selectedRequest.machineryType}
                  </span>
                  <h4 className="text-xs font-black text-slate-900">
                    {selectedRequest.serviceTitle || `طلب تشغيل آلية ${selectedRequest.machineryType}`}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedRequest.governorate} - {selectedRequest.district}</span>
                  </div>
                </div>

                {/* Elegant Interactive Status Pipeline (مؤشر تتبع حالة الطلب) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">حالة تشغيل الطلب الجارية:</span>
                  
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    {selectedRequest.status === 'cancelled' ? (
                      <div className="flex items-center gap-2 text-rose-700 font-bold text-xs justify-center py-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>تم إلغاء هذا الطلب بالكامل ❌</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-1 text-center relative">
                        {/* Horizontal Line connector */}
                        <div className="absolute top-3.5 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 -z-10" />
                        <div 
                          className="absolute top-3.5 right-[12.5%] h-0.5 bg-emerald-500 transition-all duration-500 -z-10" 
                          style={{
                            width: 
                              selectedRequest.status === 'pending' ? '0%' :
                              selectedRequest.status === 'approved' ? '33.33%' :
                              selectedRequest.status === 'ongoing' ? '66.66%' : '100%'
                          }}
                        />

                        {/* Step 1: Pending */}
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition ${
                            selectedRequest.status === 'pending' || selectedRequest.status === 'approved' || selectedRequest.status === 'ongoing' || selectedRequest.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            ⏳
                          </div>
                          <span className="text-[9px] font-black text-slate-600">قيد الانتظار</span>
                        </div>

                        {/* Step 2: Approved */}
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition ${
                            selectedRequest.status === 'approved' || selectedRequest.status === 'ongoing' || selectedRequest.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            🗓️
                          </div>
                          <span className="text-[9px] font-black text-slate-600">تم القبول</span>
                        </div>

                        {/* Step 3: Ongoing */}
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition ${
                            selectedRequest.status === 'ongoing' || selectedRequest.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            🚜
                          </div>
                          <span className="text-[9px] font-black text-slate-600">جاري العمل</span>
                        </div>

                        {/* Step 4: Completed */}
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition ${
                            selectedRequest.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            🏁
                          </div>
                          <span className="text-[9px] font-black text-slate-600">مكتمل</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid details block */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] text-slate-400 block font-bold">طريقة الاحتساب</span>
                    <span className="text-xs font-black text-slate-800">
                      {selectedRequest.requestType === 'hourly' ? 'عمل بالساعة' : 'أجور النقل بالمسافة'}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] text-slate-400 block font-bold">حجم العمل المطلوب</span>
                    <span className="text-xs font-black text-slate-800">
                      {selectedRequest.durationOrDistance} {selectedRequest.requestType === 'hourly' ? 'ساعات تشغيل' : 'نقلات / رحلات'}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] text-slate-400 block font-bold">تاريخ الطلب</span>
                    <span className="text-xs font-black text-slate-800 font-mono">
                      {selectedRequest.date}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <span className="text-[9px] text-slate-400 block font-bold">الميزانية الإجمالية</span>
                    <span className="text-xs font-black text-amber-600 font-mono">
                      {(selectedRequest.totalPrice || 0).toLocaleString('ar-IQ')} د.ع
                    </span>
                  </div>
                </div>

                {/* Requester or Provider Profile section (مقدم الطلب أو مزود الخدمة) */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">معلومات مقدم الطلب والاتصال:</span>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center font-black text-sm">
                        {selectedRequest.customerName[0]}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-800 block">{selectedRequest.customerName}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">{selectedRequest.customerPhone}</span>
                      </div>
                    </div>

                    {/* Direct dialer trigger */}
                    <button
                      type="button"
                      onClick={() => onCallInitiate(selectedRequest.customerPhone)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/10"
                    >
                      <Phone className="h-4 w-4" />
                      <span>اتصل بصاحب الطلب</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer interactive buttons (نلغيه او نوافق عليه) */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                <div className="flex gap-2">
                  {selectedRequest.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'approved')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>الموافقة على الطلب</span>
                    </button>
                  )}

                  {selectedRequest.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'ongoing')}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>بدء التشغيل والعمل الفعلي</span>
                    </button>
                  )}

                  {selectedRequest.status === 'ongoing' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'completed')}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>تأكيد إكمال وتشغيل الآلية</span>
                    </button>
                  )}

                  {selectedRequest.status !== 'cancelled' && selectedRequest.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'cancelled')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      <span>إلغاء الطلب</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-xl text-[10px] font-bold"
                >
                  إغلاق هذه النافذة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Helper icon import wrapper to bypass missing
const CheckCircle2 = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
