import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ServiceListing, StoreItem, ServiceRequest, UserAccount, PromoBanner, SupportTicket, Governorate, MachineryType, PricingType
} from '../types';
import { GOVERNORATES, MACHINERY_DETAILS } from '../data';
import {
  ShieldAlert, Users, Hammer, ClipboardList, ShoppingCart, Headset, Image as ImageIcon,
  TrendingUp, Activity, BarChart2, CheckCircle2, AlertTriangle, Play, Check, Trash2, Edit2, Plus, X, ArrowRight
} from 'lucide-react';

interface AdminPortalProps {
  listings: ServiceListing[];
  storeItems: StoreItem[];
  requests: ServiceRequest[];
  users: UserAccount[];
  banners: PromoBanner[];
  tickets: SupportTicket[];
  onUpdateListings: (listings: ServiceListing[]) => void;
  onUpdateStoreItems: (items: StoreItem[]) => void;
  onUpdateRequests: (requests: ServiceRequest[]) => void;
  onUpdateUsers: (users: UserAccount[]) => void;
  onUpdateBanners: (banners: PromoBanner[]) => void;
  onUpdateTickets: (tickets: SupportTicket[]) => void;
  onExitAdmin: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'listings' | 'requests' | 'store' | 'support' | 'banners';

export default function AdminPortal({
  listings,
  storeItems,
  requests,
  users,
  banners,
  tickets,
  onUpdateListings,
  onUpdateStoreItems,
  onUpdateRequests,
  onUpdateUsers,
  onUpdateBanners,
  onUpdateTickets,
  onExitAdmin
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Modal / Add Form States
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);

  // Forms inputs
  // User
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'owner' | 'admin'>('user');
  const [newUserPhone, setNewUserPhone] = useState('');
  // Product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<'construction' | 'heavy'>('construction');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('طن');
  const [newProdDesc, setNewProdDesc] = useState('');
  // Banner
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImg, setNewBannerImg] = useState('');

  // Ticket reply states
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Helper formatting
  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-IQ') + ' د.ع';
  };

  // Add User handler
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserPhone) return;

    const newUser: UserAccount = {
      id: `U-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      phone: newUserPhone,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      listingsCount: 0
    };

    onUpdateUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserPhone('');
    setShowAddUser(false);
  };

  // Add Product handler
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdDesc) return;

    const newProduct: StoreItem = {
      id: `S-${Date.now()}`,
      name: newProdName,
      category: newProdCat,
      price: Number(newProdPrice),
      unit: newProdUnit,
      image: newProdCat === 'construction'
        ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
      description: newProdDesc,
      available: true
    };

    onUpdateStoreItems([newProduct, ...storeItems]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setShowAddProduct(false);
  };

  // Add Banner handler
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerSubtitle) return;

    const newBanner: PromoBanner = {
      id: `B-${Date.now()}`,
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      image: newBannerImg || 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=1000',
      active: true
    };

    onUpdateBanners([newBanner, ...banners]);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImg('');
    setShowAddBanner(false);
  };

  // Support ticket reply handler
  const handleReplyTicket = (ticketId: string) => {
    const text = replyText[ticketId];
    if (!text) return;

    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, reply: text, status: 'resolved' as const };
      }
      return t;
    });

    onUpdateTickets(updated);
    setReplyText(prev => ({ ...prev, [ticketId]: '' }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24" id="admin-portal-root">
      {/* Top Controls Navbar */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <button
          onClick={onExitAdmin}
          className="bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs hover:text-slate-950 hover:bg-slate-50 flex items-center gap-1 cursor-pointer font-sans shadow-sm"
        >
          <ArrowRight className="h-4 w-4" />
          <span>خروج من الإدارة</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-550 font-black">أحمد السامرائي (مسؤول النظام)</span>
          <div className="h-8 w-8 bg-amber-500 text-slate-950 rounded-xl font-bold flex items-center justify-center shadow shadow-amber-500/20">
            أ
          </div>
        </div>
      </div>

      {/* Main Admin Dashboard Structure: Sidebar and Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto" dir="rtl">
        {/* Navigation Sidebar (3 columns) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] text-amber-700 font-bold block mb-2 px-2">لوحة الأقسام والتحكم</span>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>نظرة عامة وإحصائيات</span>
              <BarChart2 className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>إدارة المستخدمين</span>
              <Users className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'listings' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>إدارة آليات ومزودي الخدمات</span>
              <Hammer className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'requests' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>طلبات الآليات والحجوزات</span>
              <ClipboardList className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'store' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>إدارة المتجر الإنشائي</span>
              <ShoppingCart className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'support' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>بلاغات الدعم الفني</span>
              <Headset className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full text-right p-3 rounded-2xl text-xs font-bold font-sans transition flex items-center justify-between cursor-pointer ${
                activeTab === 'banners' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>إعلانات البانر الترويجية</span>
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Section View (9 columns) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Dashboard General Stats Section */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Bento Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-3xl text-right relative overflow-hidden shadow-sm">
                  <div className="absolute top-2 left-2 text-slate-200"><Users className="h-8 w-8" /></div>
                  <span className="text-[10px] text-slate-500 font-bold block">إجمالي المستخدمين</span>
                  <span className="text-xl font-black text-slate-800 block mt-2 font-mono">{users.length}</span>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-3xl text-right relative overflow-hidden shadow-sm">
                  <div className="absolute top-2 left-2 text-slate-200"><Hammer className="h-8 w-8" /></div>
                  <span className="text-[10px] text-slate-500 font-bold block">الآليات النشطة</span>
                  <span className="text-xl font-black text-slate-800 block mt-2 font-mono">
                    {listings.filter(l => l.status === 'active').length}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-3xl text-right relative overflow-hidden shadow-sm">
                  <div className="absolute top-2 left-2 text-slate-200"><ClipboardList className="h-8 w-8" /></div>
                  <span className="text-[10px] text-slate-500 font-bold block">حجوزات الآليات</span>
                  <span className="text-xl font-black text-slate-800 block mt-2 font-mono">{requests.length}</span>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-3xl text-right relative overflow-hidden shadow-sm">
                  <div className="absolute top-2 left-2 text-slate-200"><ShoppingCart className="h-8 w-8" /></div>
                  <span className="text-[10px] text-slate-500 font-bold block">عناصر المتجر</span>
                  <span className="text-xl font-black text-slate-800 block mt-2 font-mono">{storeItems.length}</span>
                </div>
              </div>

              {/* Graphical Analysis Bento Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold font-sans">تحديث فوري للنشاط</span>
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Activity className="h-4 w-4 text-amber-600" />
                    مؤشرات الحجوزات ونقل المواد الثقيلة لعام 2026
                  </h3>
                </div>

                {/* Simulated lightweight vector chart of revenue/requests */}
                <div className="h-48 w-full bg-slate-50 rounded-2xl border border-slate-200 relative flex items-end p-4 pt-10">
                  <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] text-slate-500 font-sans">
                    <span>الذروة التشغيلية: 140 حجز</span>
                    <span>المتوسط: 85 حجز</span>
                  </div>

                  {/* SVG Bar Chart simulation */}
                  <div className="w-full h-full flex justify-between items-end gap-2 px-4">
                    {[35, 55, 45, 70, 85, 110, 140, 95, 120, 130, 115, 125].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div 
                          className="w-full bg-gradient-to-t from-orange-500 to-amber-500 rounded-t-lg transition-all duration-500 hover:from-amber-400 hover:to-orange-400"
                          style={{ height: `${(val / 140) * 80}%` }}
                          title={`شهر ${idx + 1}: ${val} حجز`}
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500">{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Section */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                >
                  <Plus className="h-4 w-4 text-slate-950" />
                  <span>إضافة مستخدم جديد</span>
                </button>
                <h3 className="text-xs font-black text-slate-800">إدارة حسابات المستخدمين والمشغلين</h3>
              </div>

              {/* Users list table */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3">المستعمل / الاسم</th>
                        <th className="p-3">رقم الهاتف</th>
                        <th className="p-3">صلاحية الحساب</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3 text-left">التحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="p-3 flex items-center gap-2">
                            <img src={user.avatar} alt="avatar" className="h-7 w-7 rounded-lg object-cover" />
                            <span className="font-bold text-slate-800">{user.name}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-600">{user.phone}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              user.role === 'admin' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' :
                              user.role === 'owner' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {user.role === 'admin' ? 'مسؤول النظام' : user.role === 'owner' ? 'مالك آلية' : 'عميل'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`h-2 w-2 rounded-full inline-block mr-1 ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}></span>
                            <span className="text-slate-600 ml-1">{user.status === 'active' ? 'نشط' : 'معطل'}</span>
                          </td>
                          <td className="p-3 text-left space-x-1" dir="ltr">
                            <button
                              onClick={() => {
                                const updated = users.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' as const : 'active' as const } : u);
                                onUpdateUsers(updated);
                              }}
                              className="p-1 px-2 rounded bg-white border border-slate-200 text-slate-650 text-[10px] hover:bg-slate-50 cursor-pointer shadow-sm"
                            >
                              {user.status === 'active' ? 'حظر' : 'تفعيل'}
                            </button>
                            <button
                              onClick={() => {
                                const updated = users.filter(u => u.id !== user.id);
                                onUpdateUsers(updated);
                              }}
                              className="p-1 px-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Listings Management Section */}
          {activeTab === 'listings' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-black text-slate-800 text-right">مراجعة وإدارة عروض الآليات الثقيلة</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3 text-right shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                        listing.status === 'active' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                      }`}>
                        {listing.status === 'active' ? 'معتمد ونشط' : 'قيد المراجعة'}
                      </span>
                      <h4 className="text-xs font-black text-slate-800 line-clamp-1 flex-1 mr-2">{listing.title}</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-[10px] font-sans border border-slate-100">
                      <div>
                        <span className="text-slate-500 block font-bold">المحافظة</span>
                        <span className="text-slate-800 font-bold">{listing.governorate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-bold">الكلفة المقدرة</span>
                        <span className="text-amber-700 font-bold">{formatPrice(listing.price)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-bold">النوع</span>
                        <span className="text-slate-800 font-bold">{MACHINERY_DETAILS[listing.type]?.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500">المالك: {listing.ownerName}</span>

                      <div className="flex gap-1">
                        {listing.status !== 'active' && (
                          <button
                            onClick={() => {
                              const updated = listings.map(l => l.id === listing.id ? { ...l, status: 'active' as const } : l);
                              onUpdateListings(updated);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-0.5 cursor-pointer shadow-sm"
                          >
                            <Check className="h-3 w-3" />
                            موافقة ونشر
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const updated = listings.filter(l => l.id !== listing.id);
                            onUpdateListings(updated);
                          }}
                          className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          حذف الإعلان
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Requests Section */}
          {activeTab === 'requests' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-black text-slate-800 text-right">طلبات حجز وتأجير الآليات المتلقاة</h3>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3">رقم الطلب / العميل</th>
                        <th className="p-3">نوع الآلية المطلوب</th>
                        <th className="p-3">تاريخ وموقع العمل</th>
                        <th className="p-3">الكلفة التقديرية</th>
                        <th className="p-3">حالة الطلب الحالية</th>
                        <th className="p-3 text-left">تحديث الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className="font-bold text-slate-800 block">{req.customerName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{req.customerPhone}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-700">{MACHINERY_DETAILS[req.machineryType]?.name}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {req.durationOrDistance} {req.requestType === 'hourly' ? 'ساعات' : 'نقلات'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-800 block">{req.governorate} - {req.district}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">{req.date}</span>
                          </td>
                          <td className="p-3 text-amber-700 font-black">{formatPrice(req.totalPrice)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-700' :
                              req.status === 'ongoing' ? 'bg-blue-500/10 text-blue-700' :
                              req.status === 'approved' ? 'bg-indigo-500/10 text-indigo-700' :
                              req.status === 'cancelled' ? 'bg-slate-100 text-slate-555' :
                              'bg-amber-500/10 text-amber-700'
                            }`}>
                              {req.status === 'completed' ? 'مكتمل ومسدد' :
                               req.status === 'ongoing' ? 'قيد العمل الآن' :
                               req.status === 'approved' ? 'مقبول ومجدول' :
                               req.status === 'cancelled' ? 'ملغي' : 'بانتظار الموافقة'}
                            </span>
                          </td>
                          <td className="p-3 text-left" dir="ltr">
                            <select
                              value={req.status}
                              onChange={(e) => {
                                const stat = e.target.value as any;
                                const updated = requests.map(r => r.id === req.id ? { ...r, status: stat } : r);
                                onUpdateRequests(updated);
                              }}
                              className="bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] text-slate-700 focus:outline-none focus:border-amber-500"
                            >
                              <option value="pending">معلق</option>
                              <option value="approved">موافقة</option>
                              <option value="ongoing">قيد التشغيل</option>
                              <option value="completed">مكتمل</option>
                              <option value="cancelled">ملغي</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Store Management Section */}
          {activeTab === 'store' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                >
                  <Plus className="h-4 w-4 text-slate-950" />
                  <span>إضافة منتج أو مادة جديدة</span>
                </button>
                <h3 className="text-xs font-black text-slate-805">إدارة المتجر والمواد الإنشائية والثقيلة</h3>
              </div>

              {/* Products listing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeItems.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-slate-200 rounded-3xl p-4 flex gap-3 text-right items-center shadow-sm"
                  >
                    <img src={prod.image} alt={prod.name} className="h-12 w-12 rounded-xl object-cover flex-shrink-0 border border-slate-100" />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-black text-slate-800">{prod.name}</h4>
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>سعر الوحدة: <span className="text-amber-700 font-bold">{formatPrice(prod.price)}</span></span>
                        <span>الوحدة: {prod.unit}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          const updated = storeItems.map(s => s.id === prod.id ? { ...s, available: !s.available } : s);
                          onUpdateStoreItems(updated);
                        }}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md text-center transition cursor-pointer ${
                          prod.available ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'
                        }`}
                      >
                        {prod.available ? 'متوفر' : 'غير متوفر'}
                      </button>
                      
                      <button
                        onClick={() => {
                          const updated = storeItems.filter(s => s.id !== prod.id);
                          onUpdateStoreItems(updated);
                        }}
                        className="bg-rose-50 text-rose-600 p-1.5 rounded-md hover:bg-rose-600 hover:text-white transition flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Tickets Section */}
          {activeTab === 'support' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-black text-slate-800 text-right">بلاغات واستفسارات الدعم الفني</h3>

              <div className="space-y-4 text-right">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black ${
                        ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                      }`}>
                        {ticket.status === 'resolved' ? 'محلول' : 'مفتوح بانتظار الرد'}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{ticket.subject}</h4>
                        <span className="text-[10px] text-slate-500 font-sans block">{ticket.senderName} ({ticket.senderPhone})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                      {ticket.message}
                    </p>

                    {/* Replies */}
                    {ticket.reply ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-slate-800">
                        <span className="text-[10px] text-emerald-700 font-bold block mb-1">الرد المعتمد من الإدارة:</span>
                        {ticket.reply}
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <textarea
                          placeholder="اكتب ردك المعتمد كمسؤول نظام هنا..."
                          value={replyText[ticket.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                          rows={2}
                        />
                        <button
                          onClick={() => handleReplyTicket(ticket.id)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          إرسال الرد وتحديث التذكرة
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promotional Banners Management Section */}
          {activeTab === 'banners' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowAddBanner(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                >
                  <Plus className="h-4 w-4 text-slate-950" />
                  <span>إضافة بانر إعلاني جديد</span>
                </button>
                <h3 className="text-xs font-black text-slate-800">إدارة إعلانات وبطاقات البانر الترويجية</h3>
              </div>

              {/* Banners List */}
              <div className="grid grid-cols-1 gap-4">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-white border border-slate-200 rounded-3xl p-4 flex gap-4 text-right items-center overflow-hidden shadow-sm"
                  >
                    <img src={banner.image} alt={banner.title} className="h-16 w-24 rounded-2xl object-cover flex-shrink-0 bg-slate-50 border border-slate-100" referrerPolicy="no-referrer" />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-black text-slate-805 leading-tight">{banner.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{banner.subtitle}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          const updated = banners.map(b => b.id === banner.id ? { ...b, active: !b.active } : b);
                          onUpdateBanners(updated);
                        }}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md transition cursor-pointer ${
                          banner.active ? 'bg-emerald-500/10 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {banner.active ? 'نشط ومعروض' : 'معطل'}
                      </button>

                      <button
                        onClick={() => {
                          const updated = banners.filter(b => b.id !== banner.id);
                          onUpdateBanners(updated);
                        }}
                        className="bg-rose-50 text-rose-600 p-1 rounded-md hover:bg-rose-600 hover:text-white transition flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal Overlay */}
      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-right p-5 space-y-4"
              dir="rtl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <button onClick={() => setShowAddUser(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                  <X className="h-4 w-4" />
                </button>
                <h3 className="text-xs font-black text-slate-900">إضافة حساب مستخدم جديد</h3>
              </div>

              <form onSubmit={handleAddUser} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سرمد التميمي"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    placeholder="077XXXXXXXX"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none text-left focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">نوع الصلاحية:</label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value="user">عميل (طالب آليات)</option>
                    <option value="owner">مالك آليات ومزود خدمة</option>
                    <option value="admin">مسؤول نظام</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-xl font-bold mt-4 cursor-pointer hover:opacity-95 shadow"
                >
                  حفظ وإضافة الحساب
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-right p-5 space-y-4"
              dir="rtl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <button onClick={() => setShowAddProduct(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                  <X className="h-4 w-4" />
                </button>
                <h3 className="text-xs font-black text-slate-900">إضافة منتج جديد للمتجر</h3>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">اسم المادة أو المنتج:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سمنت مقاوم عراقي"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold">تصنيف المادة:</label>
                    <select
                      value={newProdCat}
                      onChange={(e: any) => setNewProdCat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                    >
                      <option value="construction">إنشائية وبناء</option>
                      <option value="heavy">تجهيزات ثقيلة</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold">الوحدة القياسية:</label>
                    <input
                      type="text"
                      required
                      placeholder="طن، لوري، كيس، قطعة"
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">سعر الوحدة بالدينار العراقي:</label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 95000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">وصف دقيق للمنتج ومميزاته:</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="مقاومة الأملاح، شروط التسليم والتفريغ..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-xl font-bold mt-4 cursor-pointer hover:opacity-95 shadow"
                >
                  حفظ ونشر المادة بالمتجر
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Banner Modal Overlay */}
      <AnimatePresence>
        {showAddBanner && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-right p-5 space-y-4"
              dir="rtl"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <button onClick={() => setShowAddBanner(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                  <X className="h-4 w-4" />
                </button>
                <h3 className="text-xs font-black text-slate-900">إضافة لافتة ترويجية جديدة</h3>
              </div>

              <form onSubmit={handleAddBanner} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">عنوان اللافتة العريض:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تجهيز المشاريع بالكامل"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">الوصف الفرعي أو السلوغان ترويجي:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: خصومات خاصة للمشاريع والبلديات..."
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">رابط صورة البانر (اختياري):</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newBannerImg}
                    onChange={(e) => setNewBannerImg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none text-left focus:bg-white focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-xl font-bold mt-4 cursor-pointer hover:opacity-95 shadow"
                >
                  حفظ وتنشيط الإعلان
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
