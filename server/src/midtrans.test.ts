import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { isSettledPayment, isTrustedSettlement, verifyMidtransSignature, type MidtransNotification } from './midtrans.js';

const serverKey = 'sandbox-server-key';

function notification(overrides: Partial<MidtransNotification> = {}): MidtransNotification {
  const base: MidtransNotification = {
    order_id: 'AKSARA-TEST-001',
    status_code: '200',
    gross_amount: '50000.00',
    transaction_status: 'settlement',
    fraud_status: 'accept',
    signature_key: '',
  };
  const value = { ...base, ...overrides };
  value.signature_key = createHash('sha512')
    .update(value.order_id + value.status_code + value.gross_amount + serverKey)
    .digest('hex');
  return value;
}

test('accepts the exact Midtrans SHA512 signature', () => {
  assert.equal(verifyMidtransSignature(notification(), serverKey), true);
});

test('rejects a notification after signed fields are changed', () => {
  const signed = notification();
  signed.gross_amount = '50001.00';
  assert.equal(verifyMidtransSignature(signed, serverKey), false);
});

test('settlement and capture are trusted only when fraud status is not adverse', () => {
  assert.equal(isTrustedSettlement('settlement', 'accept'), true);
  assert.equal(isTrustedSettlement('capture', 'accept'), true);
  assert.equal(isTrustedSettlement('settlement', undefined), true);
  assert.equal(isTrustedSettlement('capture', 'challenge'), false);
  assert.equal(isTrustedSettlement('capture', 'deny'), false);
  assert.equal(isTrustedSettlement('pending', 'accept'), false);
});

test('isSettledPayment follows the trusted settlement rule', () => {
  assert.equal(isSettledPayment(notification()), true);
  assert.equal(isSettledPayment(notification({ transaction_status: 'pending' })), false);
  assert.equal(isSettledPayment(notification({ transaction_status: 'capture', fraud_status: 'deny' })), false);
});
