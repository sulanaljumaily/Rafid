export type MachineryType = 
  | 'shovel' 
  | 'excavator' 
  | 'crane' 
  | 'trailer' 
  | 'grader' 
  | 'dumper' 
  | 'roller' 
  | 'kia' 
  | 'flatbed' 
  | 'mixer' 
  | 'water_tanker' 
  | 'bobcat';

export type PricingType = 'hourly' | 'road';

export type Governorate = 'بغداد' | 'البصرة' | 'نينوى' | 'أربيل' | 'الأنبار' | 'النجف' | 'كربلاء' | 'بابل' | 'ذي قار' | 'ميسان' | 'صلاح الدين' | 'كركوك' | 'السليمانية' | 'دهوك' | 'ديالى' | 'واسط' | 'المثنى' | 'القادسية';

export interface ServiceListing {
  id: string;
  title: string;
  type: MachineryType;
  pricingType: PricingType;
  price: number; // in Iraqi Dinars (IQD)
  pricingNegotiable?: boolean;
  governorate: Governorate;
  district: string; // القضاء
  originGovernorate?: Governorate;
  originDistrict?: string;
  coverageGovernorates?: string[];
  coverageDistricts?: string[];
  destinationGovernorate?: Governorate;
  destinationDistrict?: string;
  location: { x: number; y: number }; // Relative coordinates for our SVG map (0-100)
  exactCoordinates?: { lat: number; lng: number };
  images: string[];
  phone: string;
  description: string;
  ownerName: string;
  rating: number;
  status: 'active' | 'pending' | 'suspended';
  reviewsCount: number;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'construction' | 'heavy' | 'tools';
  price: number; // in IQD
  unit: string; // طن, لوري, كيس, الخ
  image: string;
  description: string;
  available: boolean;
  originalPrice?: number;
  isNew?: boolean;
  isOffer?: boolean;
}

export type RequestStatus = 'pending' | 'accepted' | 'approved' | 'rejected' | 'ongoing' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  machineryType: MachineryType;
  customerName: string;
  customerPhone: string;
  requestType: PricingType;
  durationOrDistance: number; // Hours or Kilometers (for road)
  totalPrice: number;
  status: RequestStatus;
  date: string;
  governorate: Governorate;
  district: string;
  originGovernorate?: Governorate;
  originDistrict?: string;
  destinationGovernorate?: Governorate;
  destinationDistrict?: string;
  notes?: string;
  exactCoordinates?: { lat: number; lng: number };
  providerRated?: boolean;
}

export interface AppNotification {
  id: string;
  requestId: string;
  requestTitle: string;
  status: RequestStatus;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ProviderReview {
  id: string;
  listingId: string;
  providerName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserAccount {
  id: string;
  name: string;
  role: 'user' | 'owner' | 'admin';
  phone: string;
  status: 'active' | 'suspended';
  avatar: string;
  listingsCount: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

export interface SupportTicket {
  id: string;
  senderName: string;
  senderPhone: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  date: string;
  reply?: string;
}

export type TabType = 'overview' | 'services' | 'request' | 'store' | 'more';

