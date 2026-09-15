export interface SecureCheckoutRequest {
  packageSlug: 'HEMAT' | 'REGULER' | 'VIP';
  templateSlug: string;
  invitationSlug: string;
  customer: { name: string; email: string; phone: string };
}

export interface SecureCheckoutResult {
  ok: true;
  orderId: string;
  amount: number;
  snapToken: string;
  redirectUrl: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function createSecureCheckout(payload: SecureCheckoutRequest): Promise<SecureCheckoutResult> {
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null) as SecureCheckoutResult | { ok: false; code?: string } | null;
  if (!response.ok || !data || data.ok !== true) throw new Error(data && 'code' in data ? data.code || 'CHECKOUT_FAILED' : 'CHECKOUT_FAILED');
  return data;
}
