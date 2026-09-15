import {
  Package,
  Template,
  User,
  Invitation,
  Order,
  Payment,
  MusicTrack,
  Coupon,
  TemplateRequest,
  Rsvp,
  GuestMessage,
  Couple,
  WeddingEvent,
  GalleryItem,
  GiftAccount,
} from '../types';
import {
  SEED_PACKAGES,
  SEED_TEMPLATES,
  SEED_USERS,
  SEED_INVITATIONS,
  SEED_ORDERS,
  SEED_PAYMENTS,
  SEED_MUSIC_LIBRARY,
  SEED_COUPONS,
  SEED_TEMPLATE_REQUESTS,
} from '../data/seedData';
import { activePaymentGateway, PaymentTransactionResult } from './payment';

const STORAGE_KEYS = {
  PACKAGES: 'aksara_packages_v1',
  TEMPLATES: 'aksara_templates_v1',
  USERS: 'aksara_users_v1',
  INVITATIONS: 'aksara_invitations_v1',
  ORDERS: 'aksara_orders_v1',
  PAYMENTS: 'aksara_payments_v1',
  MUSIC: 'aksara_music_v1',
  COUPONS: 'aksara_coupons_v1',
  REQUESTS: 'aksara_requests_v1',
  CURRENT_USER: 'aksara_current_user_v1',
};

// Helper for unique ID generation
export function generateUUID(prefix: string = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

// Simple HTML/Text sanitizer to prevent XSS in guestbook & RSVP
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

class AppStorageService {
  private isBrowser = typeof window !== 'undefined';

  private load<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private save<T>(key: string, data: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  // --- PACKAGES ---
  getPackages(): Package[] {
    return this.load<Package[]>(STORAGE_KEYS.PACKAGES, SEED_PACKAGES);
  }

  getPackageBySlug(slug: string): Package | undefined {
    return this.getPackages().find((p) => p.slug === slug);
  }

  updatePackage(updated: Package): void {
    const list = this.getPackages().map((p) => (p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p));
    this.save(STORAGE_KEYS.PACKAGES, list);
  }

  // --- TEMPLATES ---
  getTemplates(): Template[] {
    return this.load<Template[]>(STORAGE_KEYS.TEMPLATES, SEED_TEMPLATES);
  }

  getTemplateBySlug(slug: string): Template | undefined {
    return this.getTemplates().find((t) => t.slug === slug);
  }

  saveTemplate(tpl: Template): void {
    const list = this.getTemplates();
    const idx = list.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) {
      list[idx] = { ...tpl, updatedAt: new Date().toISOString() };
    } else {
      list.push(tpl);
    }
    this.save(STORAGE_KEYS.TEMPLATES, list);
  }

  deleteTemplate(id: string): void {
    const list = this.getTemplates().filter((t) => t.id !== id);
    this.save(STORAGE_KEYS.TEMPLATES, list);
  }

  // --- INVITATIONS ---
  getInvitations(): Invitation[] {
    return this.load<Invitation[]>(STORAGE_KEYS.INVITATIONS, SEED_INVITATIONS);
  }

  getInvitationBySlug(slug: string): Invitation | undefined {
    return this.getInvitations().find((inv) => inv.slug === slug.toLowerCase().trim());
  }

  getInvitationById(id: string): Invitation | undefined {
    return this.getInvitations().find((inv) => inv.id === id);
  }

  getInvitationsByUserId(userId: string): Invitation[] {
    return this.getInvitations().filter((inv) => inv.userId === userId);
  }

  saveInvitation(invitation: Invitation): void {
    const list = this.getInvitations();
    const idx = list.findIndex((i) => i.id === invitation.id);
    const updated = { ...invitation, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.save(STORAGE_KEYS.INVITATIONS, list);
  }

  updateInvitation(id: string, partial: Partial<Invitation>): Invitation | undefined {
    const list = this.getInvitations();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    const updated: Invitation = {
      ...list[idx],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    this.save(STORAGE_KEYS.INVITATIONS, list);
    return updated;
  }

  // --- USERS & AUTH ---
  getCurrentUser(): User {
    const defaultUser = SEED_USERS[1]; // default to customer for ease of preview
    return this.load<User>(STORAGE_KEYS.CURRENT_USER, defaultUser);
  }

  setCurrentUser(user: User): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  getUsers(): User[] {
    return this.load<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  // --- ORDERS & PAYMENTS ---
  getOrders(): Order[] {
    return this.load<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  getPayments(): Payment[] {
    return this.load<Payment[]>(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
  }

  async createOrderAndPayment(payload: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    packageSlug: 'HEMAT' | 'REGULER' | 'VIP';
    templateSlug: string;
    couponCode?: string;
    paymentMethod: 'qris' | 'va' | 'gopay';
    invitationDraft?: {
      slug: string;
      title: string;
      couple: Partial<Couple>;
      events: Partial<WeddingEvent>[];
      gifts?: Partial<GiftAccount>[];
    };
  }): Promise<{ order: Order; paymentResult: PaymentTransactionResult }> {
    const pkg = this.getPackageBySlug(payload.packageSlug) || SEED_PACKAGES[1];
    const tpl = this.getTemplateBySlug(payload.templateSlug) || SEED_TEMPLATES[0];

    let discount = 0;
    if (payload.couponCode) {
      const coupon = this.getCoupons().find(
        (c) => c.code.toUpperCase() === payload.couponCode?.toUpperCase() && c.isActive
      );
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((pkg.price * coupon.discountValue) / 100);
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const finalAmount = Math.max(0, pkg.price - discount);
    const orderId = generateUUID('ord');
    const orderNumber = `AKS-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Generate unique slug for invitation
    const rawSlug = payload.invitationDraft?.slug || `${payload.invitationDraft?.couple?.groomName || 'pengantin'}-${payload.invitationDraft?.couple?.brideName || 'bahagia'}`;
    const cleanSlug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const invitationId = generateUUID('inv');

    // Create Initial Invitation record (marked draft / will be activated upon paid)
    const newInvitation: Invitation = {
      id: invitationId,
      orderId,
      userId: payload.userId,
      templateId: tpl.id,
      templateSlug: tpl.slug,
      packageSlug: pkg.slug,
      slug: cleanSlug,
      title: payload.invitationDraft?.title || `Pernikahan ${payload.invitationDraft?.couple?.groomName || 'Fauzi'} & ${payload.invitationDraft?.couple?.brideName || 'Aisyah'}`,
      isPublished: true, // Auto publish once paid
      allowSearchEngines: true,
      activeUntil: pkg.activeDurationMonths ? new Date(Date.now() + pkg.activeDurationMonths * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      quoteArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
      quoteTranslation: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
      quoteSource: 'QS. Ar-Rum: 21',
      musicId: pkg.hasMusic ? 'mus-001' : undefined,
      musicUrl: pkg.hasMusic ? 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3' : undefined,
      musicTitle: pkg.hasMusic ? 'Kisah Kasih Abadi (Acoustic)' : undefined,
      couple: {
        id: generateUUID('cpl'),
        invitationId,
        groomName: payload.invitationDraft?.couple?.groomName || 'Fauzi',
        groomFullName: payload.invitationDraft?.couple?.groomFullName || 'Ahmad Fauzi, S.Kom.',
        groomFather: payload.invitationDraft?.couple?.groomFather || 'Bpk. H. Bambang Sudiro',
        groomMother: payload.invitationDraft?.couple?.groomMother || 'Ibu Hj. Siti Nurhaliza',
        groomChildOrder: payload.invitationDraft?.couple?.groomChildOrder || 'Putra Pertama',
        groomPhotoUrl: payload.invitationDraft?.couple?.groomPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        brideName: payload.invitationDraft?.couple?.brideName || 'Aisyah',
        brideFullName: payload.invitationDraft?.couple?.brideFullName || 'Aisyah Putri, S.Farm.',
        brideFather: payload.invitationDraft?.couple?.brideFather || 'Bpk. H. Mochammad Yusuf',
        brideMother: payload.invitationDraft?.couple?.brideMother || 'Ibu Hj. Endang Sulastri',
        brideChildOrder: payload.invitationDraft?.couple?.brideChildOrder || 'Putri Kedua',
        bridePhotoUrl: payload.invitationDraft?.couple?.bridePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      events: payload.invitationDraft?.events && payload.invitationDraft.events.length > 0
        ? payload.invitationDraft.events.map((evt) => ({
            id: generateUUID('evt'),
            invitationId,
            title: evt.title || 'Akad & Resepsi',
            date: evt.date || '2026-11-20',
            startTime: evt.startTime || '09:00',
            endTime: evt.endTime || '14:00',
            timezone: evt.timezone || 'WIB',
            venueName: evt.venueName || 'Gedung Pernikahan',
            venueAddress: evt.venueAddress || 'Jl. Bahagia No. 1, Jakarta',
            mapsUrl: evt.mapsUrl || 'https://maps.google.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        : [
            {
              id: generateUUID('evt'),
              invitationId,
              title: 'Akad Nikah',
              date: '2026-11-20',
              startTime: '08:00',
              endTime: '10:00',
              timezone: 'WIB',
              venueName: 'Masjid Agung',
              venueAddress: 'Jl. Pemuda No. 1',
              mapsUrl: 'https://maps.google.com',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: generateUUID('evt'),
              invitationId,
              title: 'Resepsi Pernikahan',
              date: '2026-11-20',
              startTime: '11:00',
              endTime: '14:00',
              timezone: 'WIB',
              venueName: 'Grand Ballroom',
              venueAddress: 'Jl. Sudirman No. 100',
              mapsUrl: 'https://maps.google.com',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
      galleries: [
        {
          id: generateUUID('gal'),
          invitationId,
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          caption: 'Momen Bahagia',
          order: 1,
          createdAt: new Date().toISOString(),
        },
      ],
      gifts: [
        {
          id: generateUUID('gft'),
          invitationId,
          type: 'bank',
          providerName: 'BCA',
          accountNumber: '1234567890',
          accountHolder: payload.invitationDraft?.couple?.groomFullName || 'Pengantin Pria',
          createdAt: new Date().toISOString(),
        },
      ],
      rsvps: [],
      guestMessages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: payload.userId,
      userEmail: payload.userEmail,
      userName: payload.userName,
      userPhone: payload.userPhone,
      packageId: pkg.id,
      packageSlug: pkg.slug,
      packageName: pkg.name,
      templateId: tpl.id,
      templateSlug: tpl.slug,
      amount: pkg.price,
      discountAmount: discount,
      finalAmount,
      couponCode: payload.couponCode,
      status: 'PENDING',
      paymentMethod: payload.paymentMethod,
      invitationId,
      invitationSlug: cleanSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save initial order & draft invitation
    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.save(STORAGE_KEYS.ORDERS, orders);

    this.saveInvitation(newInvitation);

    // Call payment gateway abstraction
    const paymentResult = await activePaymentGateway.createTransaction({
      orderId,
      orderNumber,
      amount: finalAmount,
      customerName: payload.userName,
      customerEmail: payload.userEmail,
      customerPhone: payload.userPhone,
      packageName: pkg.name,
      paymentMethod: payload.paymentMethod,
    });

    const newPayment: Payment = {
      id: generateUUID('pay'),
      orderId,
      gateway: 'MOCK',
      transactionId: paymentResult.transactionId,
      paymentType: payload.paymentMethod,
      grossAmount: finalAmount,
      status: 'pending',
      vaNumber: paymentResult.vaNumber,
      bankName: paymentResult.bankName,
      qrCodeUrl: paymentResult.qrCodeUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payments = this.getPayments();
    payments.unshift(newPayment);
    this.save(STORAGE_KEYS.PAYMENTS, payments);

    return { order: newOrder, paymentResult };
  }

  // Payment Webhook Verification Simulation
  async processPaymentWebhook(orderId: string, isSettlement: boolean = true): Promise<boolean> {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return false;

    const order = orders[orderIndex];
    order.status = isSettlement ? 'PAID' : 'FAILED';
    order.updatedAt = new Date().toISOString();
    orders[orderIndex] = order;
    this.save(STORAGE_KEYS.ORDERS, orders);

    // Update payment record
    const payments = this.getPayments();
    const payIdx = payments.findIndex((p) => p.orderId === orderId);
    if (payIdx !== -1) {
      payments[payIdx].status = isSettlement ? 'settlement' : 'expire';
      payments[payIdx].paidAt = isSettlement ? new Date().toISOString() : undefined;
      payments[payIdx].updatedAt = new Date().toISOString();
      this.save(STORAGE_KEYS.PAYMENTS, payments);
    }

    // Auto-activate invitation
    if (isSettlement && order.invitationId) {
      const inv = this.getInvitationById(order.invitationId);
      if (inv) {
        inv.isPublished = true;
        this.saveInvitation(inv);
      }
    }

    return true;
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = newStatus;
      orders[idx].updatedAt = new Date().toISOString();
      this.save(STORAGE_KEYS.ORDERS, orders);

      if (newStatus === 'PAID' && orders[idx].invitationId) {
        const inv = this.getInvitationById(orders[idx].invitationId!);
        if (inv) {
          inv.isPublished = true;
          this.saveInvitation(inv);
        }
      }
    }
  }

  // --- RSVP & GUESTBOOK WITH SANITIZATION & RATE LIMIT ---
  async submitRsvp(
    invitationId: string,
    data: {
      guestName: string;
      guestPhone?: string;
      attendance: 'hadir' | 'tidak_hadir' | 'ragu';
      guestCount: number;
      notes?: string;
    }
  ): Promise<boolean> {
    const inv = this.getInvitationById(invitationId);
    if (!inv) return false;

    // Sanitize guest inputs
    const newRsvp: Rsvp = {
      id: generateUUID('rsvp'),
      invitationId,
      guestName: sanitizeInput(data.guestName),
      guestPhone: data.guestPhone ? sanitizeInput(data.guestPhone) : undefined,
      attendance: data.attendance,
      guestCount: Math.max(1, Math.min(10, Number(data.guestCount) || 1)),
      notes: data.notes ? sanitizeInput(data.notes) : undefined,
      createdAt: new Date().toISOString(),
    };

    inv.rsvps = inv.rsvps || [];
    inv.rsvps.unshift(newRsvp);
    this.saveInvitation(inv);
    return true;
  }

  async submitGuestMessage(
    invitationId: string,
    data: {
      senderName: string;
      relationship?: string;
      attendance: 'hadir' | 'tidak_hadir' | 'ragu';
      message: string;
    }
  ): Promise<boolean> {
    const inv = this.getInvitationById(invitationId);
    if (!inv) return false;

    // Rate-limit check (prevent rapid spam by checking last submission timestamp in session)
    const lastPostKey = `aksara_ratelimit_${invitationId}`;
    const lastPost = sessionStorage.getItem(lastPostKey);
    if (lastPost && Date.now() - Number(lastPost) < 4000) {
      // Too fast - rate limited
      return false;
    }
    sessionStorage.setItem(lastPostKey, Date.now().toString());

    // Sanitize message & author
    const cleanMessage = sanitizeInput(data.message);
    const cleanName = sanitizeInput(data.senderName);
    if (!cleanMessage || !cleanName) return false;

    const newMessage: GuestMessage = {
      id: generateUUID('msg'),
      invitationId,
      senderName: cleanName,
      relationship: data.relationship ? sanitizeInput(data.relationship) : undefined,
      attendance: data.attendance,
      message: cleanMessage,
      isApproved: true, // default approved, admin can moderate
      createdAt: new Date().toISOString(),
    };

    inv.guestMessages = inv.guestMessages || [];
    inv.guestMessages.unshift(newMessage);
    this.saveInvitation(inv);
    return true;
  }

  toggleMessageApproval(invitationId: string, messageId: string): void {
    const inv = this.getInvitationById(invitationId);
    if (!inv || !inv.guestMessages) return;
    const msg = inv.guestMessages.find((m) => m.id === messageId);
    if (msg) {
      msg.isApproved = !msg.isApproved;
      this.saveInvitation(inv);
    }
  }

  deleteMessage(invitationId: string, messageId: string): void {
    const inv = this.getInvitationById(invitationId);
    if (!inv || !inv.guestMessages) return;
    inv.guestMessages = inv.guestMessages.filter((m) => m.id !== messageId);
    this.saveInvitation(inv);
  }

  // --- MUSIC LIBRARY ---
  getMusicLibrary(): MusicTrack[] {
    return this.load<MusicTrack[]>(STORAGE_KEYS.MUSIC, SEED_MUSIC_LIBRARY);
  }

  saveMusicTrack(track: MusicTrack): void {
    const tracks = this.getMusicLibrary();
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) {
      tracks[idx] = track;
    } else {
      tracks.push(track);
    }
    this.save(STORAGE_KEYS.MUSIC, tracks);
  }

  deleteMusicTrack(id: string): void {
    const tracks = this.getMusicLibrary().filter((t) => t.id !== id);
    this.save(STORAGE_KEYS.MUSIC, tracks);
  }

  // --- TEMPLATE REQUESTS ---
  getTemplateRequests(): TemplateRequest[] {
    return this.load<TemplateRequest[]>(STORAGE_KEYS.REQUESTS, SEED_TEMPLATE_REQUESTS);
  }

  createTemplateRequest(req: Omit<TemplateRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): TemplateRequest {
    const newReq: TemplateRequest = {
      ...req,
      id: generateUUID('req'),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = this.getTemplateRequests();
    list.unshift(newReq);
    this.save(STORAGE_KEYS.REQUESTS, list);
    return newReq;
  }

  updateTemplateRequestStatus(id: string, status: TemplateRequest['status']): void {
    const list = this.getTemplateRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      list[idx].updatedAt = new Date().toISOString();
      this.save(STORAGE_KEYS.REQUESTS, list);
    }
  }

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    return this.load<Coupon[]>(STORAGE_KEYS.COUPONS, SEED_COUPONS);
  }

  saveCoupon(coupon: Coupon): void {
    const list = this.getCoupons();
    const idx = list.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx >= 0) {
      list[idx] = coupon;
    } else {
      list.push(coupon);
    }
    this.save(STORAGE_KEYS.COUPONS, list);
  }

  deleteCoupon(code: string): void {
    const list = this.getCoupons().filter((c) => c.code.toUpperCase() !== code.toUpperCase());
    this.save(STORAGE_KEYS.COUPONS, list);
  }
}

export const appStorage = new AppStorageService();
