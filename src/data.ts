import { ServiceListing, StoreItem, ServiceRequest, UserAccount, PromoBanner, SupportTicket, Governorate, MachineryType, AppNotification, ProviderReview } from './types';

export const GOVERNORATES: Governorate[] = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'الأنبار', 
  'النجف', 'كربلاء', 'بابل', 'ذي قار', 'ميسان', 
  'صلاح الدين', 'كركوك', 'السليمانية', 'دهوك', 
  'ديالى', 'واسط', 'المثنى', 'القادسية'
];

export const DISTRICTS_BY_GOVERNORATE: Record<Governorate, string[]> = {
  'بغداد': ['الكرادة', 'المنصور', 'الأعظمية', 'الكاظمية', 'الرشيد', 'الصدر', 'التاجي', 'المحمودية'],
  'البصرة': ['العشار', 'الزبير', 'القرنة', 'أبي الخصيب', 'الفاو', 'شط العرب', 'المدينة'],
  'نينوى': ['الموصل', 'تلكيف', 'الحمدانية', 'سنجار', 'شيخان', 'البعاج', 'الحضر'],
  'أربيل': ['أربيل', 'عينكاوة', 'شقلاوة', 'سوران', 'كويه', 'خبات'],
  'الأنبار': ['الرمادي', 'الفلوجة', 'هيت', 'حديثة', 'عنة', 'القائم', 'الرطبة'],
  'النجف': ['النجف', 'الكوفة', 'المناذرة', 'المشخاب'],
  'كربلاء': ['كربلاء', 'الهندية', 'عين التمر'],
  'بابل': ['الحلة', 'المحاويل', 'المسيب', 'الهاشمية', 'القاسم'],
  'ذي قار': ['الناصرية', 'الشطرة', 'الرفاعي', 'سوق الشيوخ', 'الجبايش'],
  'ميسان': ['العمارة', 'المجر الكبير', 'الكحلاء', 'علي الغربي', 'قلعة صالح'],
  'صلاح الدين': ['تكريت', 'سامراء', 'بلد', 'الدجيل', 'الشرقاط', 'طوزخورماتو'],
  'كركوك': ['كركوك', 'الحويجة', 'دقوق', 'الدبس'],
  'السليمانية': ['السليمانية', 'حلبجة', 'رانية', 'دوكان', 'كلار', 'بنجوين'],
  'دهوك': ['دهوك', 'زاخو', 'العمادية', 'سميل', 'عقرة'],
  'ديالى': ['بعقوبة', 'المقدادية', 'الخالص', 'خانقين', 'بلدروز'],
  'واسط': ['الكوت', 'النعمانية', 'الصويرة', 'الحي', 'بدرة'],
  'المثنى': ['السماوة', 'الرميثة', 'الخضر', 'السلمان'],
  'القادسية': ['الديوانية', 'عفك', 'الشامية', 'حمزة']
};

export const MACHINERY_DETAILS: Record<MachineryType, { name: string; icon: string; defaultHourly: number; defaultRoad: number }> = {
  'shovel': { name: 'شَفَل (لودر)', icon: 'Hammer', defaultHourly: 55000, defaultRoad: 90000 },
  'excavator': { name: 'حفارة مجنزرة', icon: 'Construction', defaultHourly: 75000, defaultRoad: 120000 },
  'crane': { name: 'كرين (رافعة)', icon: 'ArrowUpCircle', defaultHourly: 90000, defaultRoad: 150000 },
  'trailer': { name: 'تريلة نقل ثقيل', icon: 'Truck', defaultHourly: 0, defaultRoad: 140000 }, // Trailers mostly operate per road trip
  'grader': { name: 'كريدر تسوية', icon: 'Layers', defaultHourly: 80000, defaultRoad: 130000 },
  'dumper': { name: 'قلاب (لوري)', icon: 'Truck', defaultHourly: 40000, defaultRoad: 75000 },
  'roller': { name: 'حادلة مدمجة', icon: 'Disc', defaultHourly: 50000, defaultRoad: 85000 },
  'kia': { name: 'كيا حمل (شاحنة خفيفة)', icon: 'Truck', defaultHourly: 25000, defaultRoad: 40000 },
  'flatbed': { name: 'سطحة لنقل السيارات والآليات', icon: 'Truck', defaultHourly: 35000, defaultRoad: 65000 },
  'mixer': { name: 'خلاطة خرسانة جاهزة', icon: 'RefreshCw', defaultHourly: 60000, defaultRoad: 95000 },
  'water_tanker': { name: 'صهريج / حوضية ماء ونقل سائل', icon: 'Droplet', defaultHourly: 30000, defaultRoad: 50000 },
  'bobcat': { name: 'بوبكات (لودر صغير)', icon: 'Box', defaultHourly: 35000, defaultRoad: 60000 }
};

const INITIAL_LISTINGS: ServiceListing[] = [
  {
    id: 'L-1',
    title: 'شفل كاتر بيلر CAT 950H جاهز للعمل',
    type: 'shovel',
    pricingType: 'hourly',
    price: 60000,
    governorate: 'بغداد',
    district: 'المنصور',
    location: { x: 48, y: 46 },
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8GQZOpy2GJ-modOI28gqoVmqHEGdPO8OyBzkoa6pKlQ&s=10'
    ],
    phone: '07701234567',
    description: 'شفل كاتر بيلر موديل حديث، نظيف جداً وجاهز للمشاريع الإنشائية الكبيرة والصغيرة. متوفر سائق ذو خبرة عالية بجميع الطرق والمشاريع الخدمية في بغداد وأطرافها.',
    ownerName: 'الحاج أبو مصطفى للجنابي',
    rating: 4.9,
    reviewsCount: 24,
    status: 'active'
  },
  {
    id: 'L-2',
    title: 'حفارة كوماتسو PC200 عملاقة',
    type: 'excavator',
    pricingType: 'hourly',
    price: 85000,
    governorate: 'البصرة',
    district: 'الزبير',
    location: { x: 75, y: 78 },
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs5pZ4qC0aErALu95UIllG4YpO5GryUXxF02wWeFdCQyp87l6clgTkV0c&s=10'
    ],
    phone: '07812233445',
    description: 'حفارة مجنزرة كوماتسو لعمليات الحفر العميق وتهيئة الأساسات وكسر الصخور. عمل مستمر وبكفاءة عالية. السعر يشمل الوقود والسائق.',
    ownerName: 'شركة الرافدين للمقاولات',
    rating: 4.7,
    reviewsCount: 18,
    status: 'active'
  },
  {
    id: 'L-3',
    title: 'تريلة مرسيدس أكتروس لنقل الحصى والرمل والتراب',
    type: 'trailer',
    pricingType: 'road',
    price: 130000,
    governorate: 'أربيل',
    district: 'شقلاوة',
    originGovernorate: 'أربيل',
    originDistrict: 'شقلاوة',
    destinationGovernorate: 'بغداد',
    destinationDistrict: 'الكرادة',
    coverageGovernorates: ['أربيل', 'بغداد', 'نينوى', 'كركوك', 'سليمانية'],
    location: { x: 52, y: 22 },
    images: [
      'https://daimlertruckag-mbthub.scene7.com/is/image/daimlertruckagmbthub/actrosL01_highlights%3A16x9?ts=1780920701507&dpr=on,2.625'
    ],
    phone: '07509876543',
    description: 'تريلات قلاب حمولة 35 طن لنقل المواد الإنشائية والأتربة لجميع مناطق كردستان ومحافظات العراق. أسعار خاصة للتعاقدات الطويلة والمشاريع الحكومية.',
    ownerName: 'ريباز شيرواني',
    rating: 4.8,
    reviewsCount: 15,
    status: 'active'
  },
  {
    id: 'L-4',
    title: 'كرين تادانو 50 طن تلسكوبي لرفع الأوزان الثقيلة',
    type: 'crane',
    pricingType: 'hourly',
    price: 110000,
    governorate: 'بغداد',
    district: 'الكرادة',
    location: { x: 50, y: 48 },
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgswfcGoB7lMwIn0tDp4QhFKFKVDyuu126uhmFF0g-LM_GqVu8erwmHTdY&s=10'
    ],
    phone: '07901112223',
    description: 'رافعة تادانو ياباني حمولة 50 طن. جاهز لتركيب الهياكل الحديدية، نقل الأبراج والمولدات الكبيرة. مشغل مرخص بخبرة تزيد عن 10 سنوات في حقول العمل.',
    ownerName: 'مكتب أور للرافعات',
    rating: 5.0,
    reviewsCount: 32,
    status: 'active'
  },
  {
    id: 'L-5',
    title: 'كريدر تسوية الطرق والشوارع كاتربيلر 140G',
    type: 'grader',
    pricingType: 'hourly',
    price: 90000,
    governorate: 'الأنبار',
    district: 'الفلوجة',
    location: { x: 38, y: 44 },
    images: [
      'https://image.made-in-china.com/2f0j00iZFRjMSCLtkg/Used-Cat-Grader-140g-Caterpillar-140g-Grader-USA-Machine.webp'
    ],
    phone: '07804445556',
    description: 'كريدر مخصص لتعديل الأراضي وتسوية الطرق الترابية ودفن الشوارع بالحصى الخابط (السبيس). دقة عالية بالعمل وسرعة بالإنجاز.',
    ownerName: 'المقاول جاسم المحمدي',
    rating: 4.6,
    reviewsCount: 9,
    status: 'active'
  },
  {
    id: 'L-6',
    title: 'لوري قلاب ميتسوبيشي كانتر 5 طن مخصص للمناطق الضيقة',
    type: 'dumper',
    pricingType: 'road',
    price: 65000,
    governorate: 'النجف',
    district: 'الكوفة',
    originGovernorate: 'النجف',
    originDistrict: 'الكوفة',
    destinationGovernorate: 'كربلاء',
    destinationDistrict: 'المركز',
    coverageGovernorates: ['النجف', 'كربلاء', 'بابل', 'القادسية'],
    location: { x: 46, y: 56 },
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGC_DqacAUKIvtlY1tmHTb6S_3HkMdyMfIVgXuXy1lfA&s=10'
    ],
    phone: '07728889990',
    description: 'لوري قلاب صغير (حمل 5 طن) لتفريغ ونقل السبيس، الأنقاض، الرمل، الطابوق داخل الأحياء الضيقة والفروع السكنية في النجف والكوفة.',
    ownerName: 'أبو علي الكوفي لخدمات النقل',
    rating: 4.8,
    reviewsCount: 11,
    status: 'active'
  },
  {
    id: 'L-7',
    title: 'حادلة كوماتسو حديد-مطاط للمشاريع البلدية',
    type: 'roller',
    pricingType: 'hourly',
    price: 55000,
    governorate: 'نينوى',
    district: 'الموصل',
    location: { x: 42, y: 24 },
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhAd_1A1sxsI8H5467JszZKdP-MaVuHXf7lbSoPIs3Lw&s=10'
    ],
    phone: '07719998887',
    description: 'حادلة ممتازة لضغط التربة وسبيس الشوارع وتجهيزها للإسفلت. اهتزاز (Vibration) قوي جداً يضمن الكبس القياسي للتربة.',
    ownerName: 'شركة نينوى للإعمار والخدمات',
    rating: 4.5,
    reviewsCount: 7,
    status: 'active'
  }
];

const INITIAL_STORE_ITEMS: StoreItem[] = [
  {
    id: 'S-1',
    name: 'سمنت مقاوم الرافدين (سوبر عراقي)',
    category: 'construction',
    price: 89000,
    originalPrice: 95000,
    unit: 'طن واحد (20 كيس)',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600',
    description: 'سمنت عراقي مقاوم للأملاح والظروف الجوية الصعبة، ممتاز للمؤسسات والأساسات والصب الكونكريتي.',
    available: true,
    isOffer: true
  },
  {
    id: 'S-2',
    name: 'حديد تسليح تركي أصلي قياس 12 ملم و 16 ملم',
    category: 'construction',
    price: 880000,
    unit: 'طن واحد',
    image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=600',
    description: 'شيش حديد تسليح تركي عالي الجودة ومقاوم للشد والصدمات، مفحوص هندسياً ومطابق للمواصفات العراقية.',
    available: true,
    isNew: true
  },
  {
    id: 'S-3',
    name: 'رمل كربلاء ناعم مغسول وممتاز للفرش واللبخ',
    category: 'construction',
    price: 110000,
    unit: 'لوري قلاب كبير (حمولة 18 متر مكعب)',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600',
    description: 'رمل كربلائي أصلي خالٍ من الشوائب والأطيان، مغسول ومصنف ليكون ممتازاً لأعمال اللبخ والصب البسيط.',
    available: true
  },
  {
    id: 'S-4',
    name: 'كرفان مكتبي دبل قمارة قياس 3×6 م',
    category: 'heavy',
    price: 2950000,
    originalPrice: 3200000,
    unit: 'كرفان كامل جاهز',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=600',
    description: 'كرفان للسكن أو لمكاتب المهندسين في المواقع الإنشائية. مجهز بكهربائيات كاملة، إنارة LED، شبابيك سلايد، وباب ألمنيوم مع عزل حراري تركي.',
    available: true,
    isOffer: true
  },
  {
    id: 'S-5',
    name: 'حاوية بضائع حديدية (كونتينر) 40 قدم مستخدمة',
    category: 'heavy',
    price: 2600000,
    unit: 'حاوية قطعة واحدة',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
    description: 'حاوية حديد ممتازة للتخزين في مواقع العمل والمخازن. حديد سميك، مانعة لتسرب المياه وبحالة ممتازة (نظافة 85%).',
    available: true,
    isNew: true
  },
  {
    id: 'S-6',
    name: 'حصى خابط (سبيس) درجة أولى للمشاريع الشارعية',
    category: 'construction',
    price: 120000,
    originalPrice: 135000,
    unit: 'لوري قلاب حمولة 18 متر مكعب',
    image: 'https://images.unsplash.com/photo-1574621100236-d25b64cfdee6?auto=format&fit=crop&q=80&w=600',
    description: 'حصى خابط مطابق للفحوصات المختبرية لأعمال دفن التأسيسات والطرق والساحات تحت التبليط.',
    available: true,
    isOffer: true
  },
  {
    id: 'S-7',
    name: 'أخشاب معاكس عراقي قياسات متنوعة للصب',
    category: 'tools',
    price: 32000,
    originalPrice: 38000,
    unit: 'لوح واحد سميك',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600',
    description: 'خشب معاكس معالج ومقاوم للرطوبة والمياه مخصص للاستخدام المتكرر في قوالب الصب الكونكريتية.',
    available: true,
    isOffer: true
  },
  {
    id: 'S-8',
    name: 'منشار قرصي كهربائي ماكيتا ياباني أصلي 1200 واط',
    category: 'tools',
    price: 115000,
    unit: 'جهاز متكامل في حقيبة حماية',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
    description: 'منشار دائري لقطع الخشب والمعادن بدقة عالية، مناسب لورش الحدادة والنجارة ومواقع البناء.',
    available: true,
    isNew: true
  }
];

const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'R-1',
    serviceId: 'L-1',
    serviceTitle: 'شفل كاتر بيلر CAT 950H جاهز للعمل',
    machineryType: 'shovel',
    customerName: 'المهندس مصطفى الموسوي',
    customerPhone: '07723334445',
    requestType: 'hourly',
    durationOrDistance: 8,
    totalPrice: 480000,
    status: 'completed',
    date: '2026-07-15',
    governorate: 'بغداد',
    district: 'المنصور',
    providerRated: false
  },
  {
    id: 'R-2',
    serviceId: 'L-3',
    serviceTitle: 'تريلة مرسيدس أكتروس لنقل الحصى والرمل والتراب',
    machineryType: 'trailer',
    customerName: 'شركة بابل للمقاولات العامة',
    customerPhone: '07801122334',
    requestType: 'road',
    durationOrDistance: 3, // 3 trips
    totalPrice: 390000,
    status: 'pending',
    date: '2026-07-17',
    governorate: 'أربيل',
    district: 'شقلاوة',
    originGovernorate: 'أربيل',
    originDistrict: 'شقلاوة',
    destinationGovernorate: 'بغداد',
    destinationDistrict: 'الكرادة'
  },
  {
    id: 'R-3',
    serviceId: 'L-2',
    serviceTitle: 'حفارة كوماتسو PC200 عملاقة',
    machineryType: 'excavator',
    customerName: 'حسين الخفاجي',
    customerPhone: '07505556667',
    requestType: 'hourly',
    durationOrDistance: 12,
    totalPrice: 1020000,
    status: 'accepted',
    date: '2026-07-17',
    governorate: 'البصرة',
    district: 'الزبير'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N-1',
    requestId: 'R-3',
    requestTitle: 'حفارة كوماتسو PC200 عملاقة',
    status: 'accepted',
    message: 'تم قبول طلب الاستئجار الخاص بك من قبل المالك. يمكنك التواصل الآن لبدء العمل.',
    timestamp: 'قبل 15 دقيقة',
    read: false
  },
  {
    id: 'N-2',
    requestId: 'R-1',
    requestTitle: 'شفل كاتر بيلر CAT 950H',
    status: 'completed',
    message: 'تم إكمال فترة استئجار الآلية بنجاح. يرجى تقييم أداء المالك ومعدته.',
    timestamp: 'أمس',
    read: true
  },
  {
    id: 'N-3',
    requestId: 'R-2',
    requestTitle: 'تريلة مرسيدس أكتروس',
    status: 'pending',
    message: 'طلب الخدمة الخاص بك قيد الانتظار لمراجعة العروض.',
    timestamp: 'قبل يومين',
    read: true
  }
];

const INITIAL_REVIEWS: ProviderReview[] = [
  {
    id: 'REV-1',
    listingId: 'L-1',
    providerName: 'الحاج أبو مصطفى للجنابي',
    reviewerName: 'المهندس مصطفى الموسوي',
    rating: 5,
    comment: 'التزام تام بالموعد، والشفل بحالة ممتازة والسائق محترف.',
    date: '2026-07-20'
  }
];

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'U-1',
    name: 'الحاج أبو مصطفى الجنابي',
    role: 'owner',
    phone: '07701234567',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150',
    listingsCount: 2
  },
  {
    id: 'U-2',
    name: 'المهندس مصطفى الموسوي',
    role: 'user',
    phone: '07723334445',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    listingsCount: 0
  },
  {
    id: 'U-3',
    name: 'أحمد السامرائي (مسؤول النظام)',
    role: 'admin',
    phone: '07909998887',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    listingsCount: 0
  }
];

const INITIAL_BANNERS: PromoBanner[] = [
  {
    id: 'B-1',
    title: 'أضخم أسطول آليات ثقيلة في العراق',
    subtitle: 'نوفر لك الشفلات والحفارات والكرينات بضغطة زر واحدة وأينما كنت في محافظاتنا الحبيبة.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000',
    active: true
  },
  {
    id: 'B-2',
    title: 'المواد الإنشائية لجميع المشاريع',
    subtitle: 'اطلب السمنت، الحديد، الرمل، والسبيس مباشرة من المتجر ووفر تكاليف النقل الإضافية.',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1000',
    active: true
  }
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'T-1',
    senderName: 'محمد التميمي',
    senderPhone: '07730004445',
    subject: 'الاستفسار عن أسعار نقل التريلات بين بغداد والبصرة',
    message: 'السلام عليكم، أريد الاستفسار عن كلفة استئجار 5 تريلات مرسيدس لنقل أنابيب حديدية من ميناء أم قصر بالبصرة إلى موقع العمل في بغداد - التاجي، هل يتم احتساب السعر ذهاب وإياب أم بالرحلة الواحدة؟ وشكراً.',
    status: 'open',
    date: '2026-07-16'
  },
  {
    id: 'T-2',
    senderName: 'سرمد جرجيس',
    senderPhone: '07501239876',
    subject: 'مشكلة في تسجيل موقع الشفل على الخريطة',
    message: 'أحاول نشر خدمة تأجير حفارة في زاخو دهوك، ولكن عندما أضغط على الخريطة لا يتم تحديد إحداثيات الموقع بشكل دقيق وتظهر في أربيل. أرجو حل هذه المشكلة التقنية.',
    status: 'resolved',
    date: '2026-07-15',
    reply: 'مرحباً سرمد، تم معالجة الخريطة في التحديث الأخير. يمكنك الآن تكبير الخريطة والضغط على زاخو لتثبيت الدبوس بالكامل وبشكل دقيق. تحياتنا لك.'
  }
];

// LocalStorage Persistent Database Management Helper
export const getDB = () => {
  if (typeof window === 'undefined') {
    return {
      listings: INITIAL_LISTINGS,
      storeItems: INITIAL_STORE_ITEMS,
      requests: INITIAL_REQUESTS,
      notifications: INITIAL_NOTIFICATIONS,
      reviews: INITIAL_REVIEWS,
      users: INITIAL_USERS,
      banners: INITIAL_BANNERS,
      tickets: INITIAL_TICKETS
    };
  }

  const listings = localStorage.getItem('rafid_listings');
  const storeItems = localStorage.getItem('rafid_store_items');
  const requests = localStorage.getItem('rafid_requests');
  const notifications = localStorage.getItem('rafid_notifications');
  const reviews = localStorage.getItem('rafid_reviews');
  const users = localStorage.getItem('rafid_users');
  const banners = localStorage.getItem('rafid_banners');
  const tickets = localStorage.getItem('rafid_tickets');

  return {
    listings: listings ? JSON.parse(listings) : INITIAL_LISTINGS,
    storeItems: storeItems ? JSON.parse(storeItems) : INITIAL_STORE_ITEMS,
    requests: requests ? JSON.parse(requests) : INITIAL_REQUESTS,
    notifications: notifications ? JSON.parse(notifications) : INITIAL_NOTIFICATIONS,
    reviews: reviews ? JSON.parse(reviews) : INITIAL_REVIEWS,
    users: users ? JSON.parse(users) : INITIAL_USERS,
    banners: banners ? JSON.parse(banners) : INITIAL_BANNERS,
    tickets: tickets ? JSON.parse(tickets) : INITIAL_TICKETS
  };
};

export const saveDB = (db: {
  listings: ServiceListing[];
  storeItems: StoreItem[];
  requests: ServiceRequest[];
  notifications?: AppNotification[];
  reviews?: ProviderReview[];
  users: UserAccount[];
  banners: PromoBanner[];
  tickets: SupportTicket[];
}) => {
  localStorage.setItem('rafid_listings', JSON.stringify(db.listings));
  localStorage.setItem('rafid_store_items', JSON.stringify(db.storeItems));
  localStorage.setItem('rafid_requests', JSON.stringify(db.requests));
  if (db.notifications) {
    localStorage.setItem('rafid_notifications', JSON.stringify(db.notifications));
  }
  if (db.reviews) {
    localStorage.setItem('rafid_reviews', JSON.stringify(db.reviews));
  }
  localStorage.setItem('rafid_users', JSON.stringify(db.users));
  localStorage.setItem('rafid_banners', JSON.stringify(db.banners));
  localStorage.setItem('rafid_tickets', JSON.stringify(db.tickets));
};

