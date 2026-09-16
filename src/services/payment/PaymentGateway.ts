// Payment Gateway Interface Abstraction
// Decouples payment provider logic from checkout and invitation activation.

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
  /** Exact Midtrans gross_amount string (for example "50000.00"). Do not reformat before signature verification. */
  grossAmount: string;
  /** Midtrans HTTP notification status_code. */
  statusCode: string;
  /** Required for cryptographic verification in production. */
  signatureKey: string;
  paymentType: string;
  transactionTime: string;
  /** Required for capture transactions; only ACCEPT is considered payable. */
  fraudStatus?: 'accept' | 'challenge' | 'deny' | string;
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
