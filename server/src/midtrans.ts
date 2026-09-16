import { createHash, timingSafeEqual } from 'node:crypto';

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
}

export interface MidtransStatus {
  order_id?: string;
  gross_amount?: string;
  transaction_status?: string;
  fraud_status?: string;
  transaction_id?: string;
}

export function verifyMidtransSignature(notification: MidtransNotification, serverKey: string): boolean {
  if (!serverKey || !notification.signature_key) return false;
  const expected = createHash('sha512')
    .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`)
    .digest('hex');
  const supplied = notification.signature_key.toLowerCase();
  if (expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

export function isTrustedSettlement(transactionStatus?: string, fraudStatus?: string): boolean {
  if (fraudStatus && fraudStatus.toLowerCase() !== 'accept') return false;
  return transactionStatus === 'settlement' || transactionStatus === 'capture';
}

export function isSettledPayment(notification: MidtransNotification): boolean {
  return isTrustedSettlement(notification.transaction_status, notification.fraud_status);
}
