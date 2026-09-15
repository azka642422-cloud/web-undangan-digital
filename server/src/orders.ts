import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { pool } from './db.js';

export const createOrderSchema = z.object({
  packageSlug: z.enum(['HEMAT', 'REGULER', 'VIP']),
  templateSlug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  invitationSlug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().email().max(200),
    phone: z.string().trim().min(8).max(20).regex(/^\+?[0-9]+$/),
  }),
}).strict();

const PACKAGES = { HEMAT: 5000, REGULER: 50000, VIP: 150000 } as const;

function snapBaseUrl() {
  return process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
}

export async function createOrder(input: z.infer<typeof createOrderSchema>) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) throw new Error('MIDTRANS_NOT_CONFIGURED');

  const amount = PACKAGES[input.packageSlug];
  const orderId = `AKS-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO orders (id, order_number, customer_name, customer_email, customer_phone, package_slug, template_slug, amount, status)
       VALUES ($1,$1,$2,$3,$4,$5,$6,$7,'PENDING_PAYMENT')`,
      [orderId, input.customer.name, input.customer.email.toLowerCase(), input.customer.phone, input.packageSlug, input.templateSlug, amount],
    );
    await client.query(
      `INSERT INTO invitations (id, order_id, slug, template_slug, package_slug, is_published)
       VALUES ($1,$2,$3,$4,$5,false)`,
      [randomUUID(), orderId, input.invitationSlug, input.templateSlug, input.packageSlug],
    );

    const auth = Buffer.from(`${serverKey}:`).toString('base64');
    const response = await fetch(snapBaseUrl(), {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: { first_name: input.customer.name, email: input.customer.email, phone: input.customer.phone },
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`MIDTRANS_HTTP_${response.status}`);
    const snap = await response.json() as { token?: string; redirect_url?: string };
    if (!snap.token || !snap.redirect_url) throw new Error('MIDTRANS_INVALID_RESPONSE');
    await client.query(
      `INSERT INTO payments (id, order_id, provider, provider_transaction_id, amount, status)
       VALUES ($1,$2,'MIDTRANS',$3,$4,'PENDING')`,
      [randomUUID(), orderId, snap.token, amount],
    );
    await client.query('COMMIT');
    return { orderId, amount, snapToken: snap.token, redirectUrl: snap.redirect_url };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
