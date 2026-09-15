// Database Schema & Application Type Definitions for AKSARA UNDANGAN

export type PackageTier = 'HEMAT' | 'REGULER' | 'VIP';

export interface Package {
  id: string; // UUID
  slug: PackageTier;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  templateCategory: 'gratis' | 'reguler' | 'premium';
  hasAnimation: boolean;
  hasMusic: boolean;
  canCustomMusic: boolean;
  canRequestMusic: boolean;
  canRequestTemplate: boolean;
  hasPrioritySupport: boolean;
  activeDurationMonths: number | null; // null = lifetime (VIP)
  isPopular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory = 'gratis' | 'reguler' | 'premium';

export interface Template {
  id: string; // UUID
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnailUrl: string;
  previewUrl?: string;
  features: string[];
  tags: string[];
  isActive: boolean;
  accentColor: string;
  fontFamily: string;
  demoSlug: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';

export interface Order {
  id: string; // UUID
  orderNumber: string; // e.g. AKS-202609-001
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  packageId: string;
  packageSlug: PackageTier;
  packageName: string;
  templateId: string;
  templateSlug: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod?: string;
  invitationId?: string;
  invitationSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string; // UUID
  orderId: string;
  gateway: 'MOCK' | 'MIDTRANS' | 'MANUAL';
  transactionId: string;
  paymentType: 'qris' | 'bank_transfer' | 'gopay' | 'va';
  grossAmount: number;
  status: 'pending' | 'settlement' | 'cancel' | 'expire';
  vaNumber?: string;
  bankName?: string;
  qrCodeUrl?: string;
  paidAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Couple {
  id: string; // UUID
  invitationId: string;
  // Groom (Pria)
  groomName: string;
  groomFullName: string;
  groomFather: string;
  groomMother: string;
  groomChildOrder?: string; // Anak ke-X
  groomInstagram?: string;
  groomPhotoUrl?: string;
  // Bride (Wanita)
  brideName: string;
  brideFullName: string;
  brideFather: string;
  brideMother: string;
  brideChildOrder?: string;
  brideInstagram?: string;
  bridePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingEvent {
  id: string; // UUID
  invitationId: string;
  title: string; // 'Akad Nikah' | 'Resepsi' | 'Walimatul Ursy'
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm or 'Selesai'
  timezone: 'WIB' | 'WITA' | 'WIT';
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  mapsEmbedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoveStory {
  id: string;
  invitationId: string;
  year: string;
  title: string;
  story: string;
}

export interface GalleryItem {
  id: string; // UUID
  invitationId: string;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: string;
}

export interface GiftAccount {
  id: string; // UUID
  invitationId: string;
  type: 'bank' | 'ewallet' | 'qris';
  providerName: string; // e.g. BCA, Mandiri, BSI, GoPay
  accountNumber: string;
  accountHolder: string;
  qrisImageUrl?: string;
  createdAt: string;
}

export interface Rsvp {
  id: string; // UUID
  invitationId: string;
  guestName: string;
  guestPhone?: string;
  attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  guestCount: number;
  notes?: string;
  createdAt: string;
}

export interface GuestMessage {
  id: string; // UUID
  invitationId: string;
  senderName: string;
  relationship?: string; // Teman SMA, Keluarga, Kolega
  attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  message: string;
  isApproved: boolean; // For moderation
  createdAt: string;
}

export interface MusicTrack {
  id: string; // UUID
  title: string;
  artist: string;
  audioUrl: string;
  genre: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface TemplateRequest {
  id: string; // UUID
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestDetails: string;
  preferredStyle: string;
  budgetNotes?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  isActive: boolean;
  validUntil: string;
}

export interface Invitation {
  id: string; // UUID
  orderId: string;
  userId: string;
  templateId: string;
  templateSlug: string;
  packageSlug: PackageTier;
  slug: string; // e.g. aisyah-fauzi
  title: string;
  isPublished: boolean;
  allowSearchEngines: boolean; // configurable noindex
  activeUntil?: string; // null if VIP
  // Customization
  quoteArabic?: string;
  quoteTranslation?: string;
  quoteSource?: string;
  musicId?: string;
  musicUrl?: string;
  musicTitle?: string;
  customMusicUrl?: string;
  // Relations embedded for ease of retrieval
  couple: Couple;
  events: WeddingEvent[];
  loveStories?: LoveStory[];
  galleries: GalleryItem[];
  gifts: GiftAccount[];
  rsvps?: Rsvp[];
  guestMessages?: GuestMessage[];
  createdAt: string;
  updatedAt: string;
}

// Template Registry Contract
export interface InvitationTemplateProps {
  invitation: Invitation;
  packageTier: PackageTier;
  guestName?: string; // "?to=Nama+Tamu"
  onRsvpSubmit?: (rsvp: Omit<Rsvp, 'id' | 'invitationId' | 'createdAt'>) => Promise<boolean>;
  onMessageSubmit?: (msg: Omit<GuestMessage, 'id' | 'invitationId' | 'isApproved' | 'createdAt'>) => Promise<boolean>;
  isEditablePreview?: boolean;
}
