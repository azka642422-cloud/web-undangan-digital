// Payment Gateway Interface Abstraction
// Decouples payment provider logic from checkout and invitation activation

export interface CreateTransactionRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  paymentMethod?: 'qris' | 'va' | 'gopay';
}

export interface PaymentTransactionResult {
  success: boolean;
  transactionId: string;
  orderId: string;
  paymentType: string;
  grossAmount: number;
  status: 'pending' | 'settlement' | 'expire' | 'failed';
  redirectUrl?: string;
  snapToken?: string;
  qrCodeUrl?: string;
  vaNumber?: string;
  bankName?: string;
  expiryTime: string;
  instructions: string[];
}

export interface PaymentNotificationPayload {
  orderId: string;
  transactionId: string;
  status: 'settlement' | 'capture' | 'pending' | 'deny' | 'cancel' | 'expire' | 'failure';
  grossAmount: number;
  signatureKey?: string;
  paymentType: string;
  transactionTime: string;
}

export interface PaymentVerificationResult {
  isValid: boolean;
  orderId: string;
  transactionStatus: 'PAID' | 'PENDING' | 'FAILED';
  paidAt?: string;
  message?: string;
}

export interface PaymentGateway {
  name: string;
  createTransaction(request: CreateTransactionRequest): Promise<PaymentTransactionResult>;
  verifyNotification(payload: PaymentNotificationPayload): Promise<PaymentVerificationResult>;
  checkStatus(transactionId: string): Promise<PaymentVerificationResult>;
}
