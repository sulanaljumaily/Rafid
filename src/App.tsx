import React, { useState, useEffect } from 'react';
import { getDB, saveDB, MACHINERY_DETAILS } from './data';
import {
  ServiceListing, StoreItem, ServiceRequest, UserAccount, PromoBanner, SupportTicket, TabType,
  AppNotification, ProviderReview, RequestStatus
} from './types';
import BottomNav from './components/BottomNav';
import OverviewSection from './components/OverviewSection';
import ServicesSection from './components/ServicesSection';
import RequestSection from './components/RequestSection';
import StoreSection from './components/StoreSection';
import MoreSection from './components/MoreSection';
import AdminPortal from './components/AdminPortal';
import MachineryDetailPage from './components/MachineryDetailPage';
import ProviderProfilePage from './components/ProviderProfilePage';
import {
  X, Phone, Star, MapPin, Hammer, ClipboardCheck, ClipboardList, ArrowLeft, Heart, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [servicesSubTab, setServicesSubTab] = useState<'available' | 'requested'>('available');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Core Persistent State DB
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Cart State
  const [cart, setCart] = useState<{ item: StoreItem; quantity: number }[]>([]);

  // Detailed Modal Item
  const [viewingListingDetail, setViewingListingDetail] = useState<ServiceListing | null>(null);
  
  // Provider Profile Modal State
  const [selectedProviderName, setSelectedProviderName] = useState<string | null>(null);

  // Call Dialer notification simulate
  const [dialerNumber, setDialerNumber] = useState<string | null>(null);

  // Initialize DB on mount
  useEffect(() => {
    const db = getDB();
    setListings(db.listings);
    setStoreItems(db.storeItems);
    setRequests(db.requests);
    setNotifications(db.notifications || []);
    setReviews(db.reviews || []);
    setUsers(db.users);
    setBanners(db.banners);
    setTickets(db.tickets);
  }, []);

  // Update localStorage helper
  const updateDB = (updatedFields: {
    listings?: ServiceListing[];
    storeItems?: StoreItem[];
    requests?: ServiceRequest[];
    notifications?: AppNotification[];
    reviews?: ProviderReview[];
    users?: UserAccount[];
    banners?: PromoBanner[];
    tickets?: SupportTicket[];
  }) => {
    const currentListings = updatedFields.listings ?? listings;
    const currentStoreItems = updatedFields.storeItems ?? storeItems;
    const currentRequests = updatedFields.requests ?? requests;
    const currentNotifications = updatedFields.notifications ?? notifications;
    const currentReviews = updatedFields.reviews ?? reviews;
    const currentUsers = updatedFields.users ?? users;
    const currentBanners = updatedFields.banners ?? banners;
    const currentTickets = updatedFields.tickets ?? tickets;

    setListings(currentListings);
    setStoreItems(currentStoreItems);
    setRequests(currentRequests);
    setNotifications(currentNotifications);
    setReviews(currentReviews);
    setUsers(currentUsers);
    setBanners(currentBanners);
    setTickets(currentTickets);

    saveDB({
      listings: currentListings,
      storeItems: currentStoreItems,
      requests: currentRequests,
      notifications: currentNotifications,
      reviews: currentReviews,
      users: currentUsers,
      banners: currentBanners,
      tickets: currentTickets
    });
  };

  // State modification callbacks
  const handleAddListing = (newListing: Omit<ServiceListing, 'id' | 'rating' | 'reviewsCount' | 'status'>) => {
    const freshListing: ServiceListing = {
      ...newListing,
      id: `L-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      status: 'pending' // pending review by administrator
    };
    updateDB({ listings: [freshListing, ...listings] });
  };

  const handleAddRequest = (newRequest: Omit<ServiceRequest, 'id' | 'date' | 'status'>) => {
    const freshRequest: ServiceRequest = {
      ...newRequest,
      id: `R-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    const freshNotification: AppNotification = {
      id: `N-${Date.now()}`,
      requestId: freshRequest.id,
      requestTitle: freshRequest.serviceTitle,
      status: 'pending',
      message: `تم إنشاء طلبك (#${freshRequest.id}) بنجاح وهو الآن بانتظار عروض المالكين.`,
      timestamp: 'الآن',
      read: false
    };

    updateDB({
      requests: [freshRequest, ...requests],
      notifications: [freshNotification, ...notifications]
    });
  };

  const handleUpdateRequestStatus = (requestId: string, newStatus: RequestStatus) => {
    let targetTitle = 'طلب آلية';
    const updatedRequests = requests.map((r) => {
      if (r.id === requestId) {
        targetTitle = r.serviceTitle;
        return { ...r, status: newStatus };
      }
      return r;
    });

    let statusMsg = 'قيد الانتظار';
    if (newStatus === 'accepted' || newStatus === 'approved') statusMsg = 'تم قبول طلب الاستئجار الخاص بك من قبل المالك ✓';
    else if (newStatus === 'rejected') statusMsg = 'تم تعذر قبول الطلب في الوقت الحالي ✕';
    else if (newStatus === 'ongoing') statusMsg = 'بدأ العمل والتشغيل الميداني للمعدة الآن 🚚';
    else if (newStatus === 'completed') statusMsg = 'تم إكمال فترة الاستئجار والعمل بنجاح 🎉. يرجى تقييم المالك.';
    else if (newStatus === 'cancelled') statusMsg = 'تم إلغاء الطلب ✕';

    const newNotification: AppNotification = {
      id: `N-${Date.now()}`,
      requestId,
      requestTitle: targetTitle,
      status: newStatus,
      message: statusMsg,
      timestamp: 'الآن',
      read: false
    };

    updateDB({
      requests: updatedRequests,
      notifications: [newNotification, ...notifications]
    });
  };

  const handleRateProvider = ({
    listingId,
    rating,
    comment,
    reviewerName
  }: {
    listingId: string;
    rating: number;
    comment: string;
    reviewerName: string;
  }) => {
    // Update listing rating dynamically in dataset
    const updatedListings = listings.map((l) => {
      if (l.id === listingId || l.type === listingId || l.ownerName.includes(listingId)) {
        const currentCount = l.reviewsCount || 0;
        const currentRating = l.rating || 5.0;
        const newCount = currentCount + 1;
        const newRating = parseFloat(((currentRating * currentCount + rating) / newCount).toFixed(1));
        return { ...l, rating: newRating, reviewsCount: newCount };
      }
      return l;
    });

    const newReview: ProviderReview = {
      id: `REV-${Date.now()}`,
      listingId,
      providerName: listingId,
      reviewerName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedRequests = requests.map((r) => {
      if (r.serviceId === listingId || r.id === listingId || r.machineryType === listingId) {
        return { ...r, providerRated: true };
      }
      return r;
    });

    updateDB({
      listings: updatedListings,
      reviews: [newReview, ...reviews],
      requests: updatedRequests
    });
  };

  const handleMarkNotificationsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));
    updateDB({ notifications: updatedNotifications });
  };

  const handleAddTicket = (newTicket: Omit<SupportTicket, 'id' | 'status' | 'date'>) => {
    const freshTicket: SupportTicket = {
      ...newTicket,
      id: `T-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'open'
    };
    updateDB({ tickets: [freshTicket, ...tickets] });
  };

  // Cart operations
  const handleAddToCart = (item: StoreItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.item.id === item.id);
      if (exists) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const handleUpdateCartQuantity = (itemId: string, qty: number) => {
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity: qty } : c))
    );
  };

  const handleCheckout = () => {
    // Generate a Request representation for checkout
    const newReq: ServiceRequest = {
      id: `R-STORE-${Date.now()}`,
      serviceId: 'STORE',
      serviceTitle: `شراء مواد إنشائية من المتجر (${cart.length} أصناف)`,
      machineryType: 'dumper', // default dumper for delivery
      customerName: 'العميل الافتراضي',
      customerPhone: '07723334445',
      requestType: 'road',
      durationOrDistance: 1,
      totalPrice: cart.reduce((a, b) => a + b.item.price * b.quantity, 0),
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      governorate: 'بغداد',
      district: 'الكرادة'
    };

    updateDB({ requests: [newReq, ...requests] });
    setCart([]); // Empty cart on successful purchase
  };

  const handleCallInitiate = (phoneNum: string) => {
    setDialerNumber(phoneNum);
  };

  // Get current active tab or full page component
  const renderMainContent = () => {
    // 1. Provider Profile Full Page View
    if (selectedProviderName) {
      return (
        <ProviderProfilePage
          ownerName={selectedProviderName}
          listings={listings}
          onBack={() => setSelectedProviderName(null)}
          onSelectListing={(listing) => {
            setSelectedProviderName(null);
            setViewingListingDetail(listing);
          }}
          onCallInitiate={handleCallInitiate}
        />
      );
    }

    // 2. Heavy Machinery Detail Full Page View
    if (viewingListingDetail) {
      return (
        <MachineryDetailPage
          listing={viewingListingDetail}
          allListings={listings}
          onBack={() => setViewingListingDetail(null)}
          onSelectListing={(listing) => setViewingListingDetail(listing)}
          onOpenProviderProfile={(ownerName) => {
            setViewingListingDetail(null);
            setSelectedProviderName(ownerName);
          }}
          onCallInitiate={handleCallInitiate}
          onAddRequest={handleAddRequest}
          onNavigateToBooking={(listing) => {
            setViewingListingDetail(null);
            setServicesSubTab('requested');
            setActiveTab('services');
          }}
        />
      );
    }

    // 3. Main Navigation Tab Views
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewSection
            listings={listings}
            banners={banners}
            requests={requests}
            onSelectListing={(listing) => setViewingListingDetail(listing)}
            onInitiateRequest={(listing) => {
              setViewingListingDetail(listing);
            }}
            onOpenProviderProfile={(name) => setSelectedProviderName(name)}
            setActiveTab={setActiveTab}
          />
        );
      case 'services':
      case 'request':
        return (
          <div className="space-y-4">
            {/* Top Bar Sub-Tabs for Services Section */}
            <div className="bg-slate-200/90 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner" dir="rtl">
              <button
                type="button"
                onClick={() => setServicesSubTab('available')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  servicesSubTab === 'available'
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Hammer className={`h-4 w-4 ${servicesSubTab === 'available' ? 'text-amber-500' : 'text-slate-500'}`} />
                <span>الخدمات المتوفرة</span>
              </button>

              <button
                type="button"
                onClick={() => setServicesSubTab('requested')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  servicesSubTab === 'requested'
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <ClipboardList className={`h-4 w-4 ${servicesSubTab === 'requested' ? 'text-amber-500' : 'text-slate-500'}`} />
                <span>الخدمات المطلوبة</span>
              </button>
            </div>

            {servicesSubTab === 'available' ? (
              <ServicesSection
                listings={listings}
                onAddListing={handleAddListing}
                onSelectListing={(listing) => setViewingListingDetail(listing)}
                onOpenProviderProfile={(name) => setSelectedProviderName(name)}
              />
            ) : (
              <RequestSection
                requests={requests}
                notifications={notifications}
                currentUser={users[0]}
                onAddRequest={handleAddRequest}
                onUpdateRequestStatus={handleUpdateRequestStatus}
                onRateProvider={handleRateProvider}
                onMarkNotificationRead={handleMarkNotificationsRead}
              />
            )}
          </div>
        );
      case 'store':
        return (
          <StoreSection
            storeItems={storeItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onCheckout={handleCheckout}
          />
        );
      case 'more':
        return (
          <MoreSection
            isAdmin={isAdminMode}
            onEnterAdmin={() => setIsAdminMode(true)}
            tickets={tickets}
            onAddTicket={handleAddTicket}
            requests={requests}
            onUpdateRequests={(reqs) => updateDB({ requests: reqs })}
            onCallInitiate={handleCallInitiate}
          />
        );
      default:
        return null;
    }
  };

  // Calculate cart counts
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900 relative overflow-x-hidden">
      {/* Decorative floating grids */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-amber-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-orange-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      {isAdminMode ? (
        /* Full Administration Dashboard Screen Overlays */
        <AdminPortal
          listings={listings}
          storeItems={storeItems}
          requests={requests}
          users={users}
          banners={banners}
          tickets={tickets}
          onUpdateListings={(list) => updateDB({ listings: list })}
          onUpdateStoreItems={(items) => updateDB({ storeItems: items })}
          onUpdateRequests={(reqs) => updateDB({ requests: reqs })}
          onUpdateUsers={(usr) => updateDB({ users: usr })}
          onUpdateBanners={(bns) => updateDB({ banners: bns })}
          onUpdateTickets={(tks) => updateDB({ tickets: tks })}
          onExitAdmin={() => setIsAdminMode(false)}
        />
      ) : (
        /* Standard Public Customer Portal App Shell */
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:px-8 space-y-6">
          {/* Main Content Area */}
          <main className="animate-fadeIn">{renderMainContent()}</main>

          {/* Premium Floating Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setViewingListingDetail(null);
              setSelectedProviderName(null);
              setActiveTab(tab);
            }}
            cartCount={cartItemCount}
          />
        </div>
      )}

      {/* DIALER CALL CONFIRMATION SIMULATOR MODAL */}
      <AnimatePresence>
        {dialerNumber && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl text-right"
              dir="rtl"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-200 text-amber-600">
                <Phone className="h-8 w-8 animate-pulse" />
              </div>

              <div className="space-y-1 text-center">
                <h3 className="text-sm font-black text-slate-900">إجراء اتصال هاتفي</h3>
                <p className="text-xs text-slate-500">سيقوم جهازك بالاتصال برقم مالك الآلية مباشرة للتفاوض وتأكيد التشغيل:</p>
                <span className="text-lg font-mono font-black text-amber-600 block py-1.5">{dialerNumber}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed text-right flex items-start gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>احرص على تأكيد كلفة الوقود ومواعيد تسليم الآلية لضمان تشغيل آمن وموثق.</span>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${dialerNumber}`}
                  onClick={() => setDialerNumber(null)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 rounded-xl text-xs font-black text-center block cursor-pointer"
                >
                  اتصل الآن
                </a>
                <button
                  onClick={() => setDialerNumber(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold"
                >
                  إلغاء الاتصال
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
