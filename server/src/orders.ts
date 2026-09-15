import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { pool } from './db.js';

const text = (max: number) => z.string().trim().max(max);
export const createOrderSchema = z.object({
  packageSlug: z.enum(['HEMAT', 'REGULER', 'VIP']),
  templateSlug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  invitationSlug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  customer: z.object({ name: z.string().trim().min(2).max(100), email: z.string().email().max(200), phone: z.string().trim().min(8).max(20).regex(/^\+?[0-9]+$/) }).strict(),
  weddingData: z.object({
    groomName: text(100), brideName: text(100), groomFullName: text(160), brideFullName: text(160),
    groomFather: text(160), groomMother: text(160), brideFather: text(160), brideMother: text(160),
    akadDate: text(20), akadTime: text(40), akadVenue: text(180), akadAddress: text(500), akadMaps: text(1000),
    resepsiDate: text(20), resepsiTime: text(40), resepsiVenue: text(180), resepsiAddress: text(500), resepsiMaps: text(1000),
    bankName: text(100), accountNumber: text(80), accountHolder: text(160),
  }).strict(),
}).strict();

const PACKAGES = { HEMAT: 5000, REGULER: 50000, VIP: 150000 } as const;
const snapBaseUrl = () => process.env.MIDTRANS_IS_PRODUCTION === 'true' ? 'https://app.midtrans.com/snap/v1/transactions' : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export async function createOrder(input: z.infer<typeof createOrderSchema>) {
  if (!pool) throw new Error('DATABASE_NOT_CONFIGURED');
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) throw new Error('MIDTRANS_NOT_CONFIGURED');
  const amount = PACKAGES[input.packageSlug];
  const orderUuid = randomUUID();
  const orderNumber = `AKS-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`INSERT INTO orders (id,order_number,customer_name,customer_email,customer_phone,package_slug,template_slug,gross_amount,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'PENDING_PAYMENT')`, [orderUuid, orderNumber, input.customer.name, input.customer.email.toLowerCase(), input.customer.phone, input.packageSlug, input.templateSlug, amount]);
    await client.query(`INSERT INTO invitations (id,order_id,slug,template_slug,package_slug,payload,is_published) VALUES ($1,$2,$3,$4,$5,$6::jsonb,false)`, [randomUUID(), orderUuid, input.invitationSlug, input.templateSlug, input.packageSlug, JSON.stringify(input.weddingData)]);

    const response = await fetch(snapBaseUrl(), { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ transaction_details: { order_id: orderNumber, gross_amount: amount }, customer_details: { first_name: input.customer.name, email: input.customer.email, phone: input.customer.phone } }), signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`MIDTRANS_HTTP_${response.status}`);
    const snap = await response.json() as { token?: string; redirect_url?: string };
    if (!snap.token || !snap.redirect_url) throw new Error('MIDTRANS_INVALID_RESPONSE');
    await client.query(`INSERT INTO payments (id,order_id,provider,provider_order_id,provider_transaction_id,gross_amount,transaction_status) VALUES ($1,$2,'MIDTRANS',$3,$4,$5,'pending')`, [randomUUID(), orderUuid, orderNumber, snap.token, amount]);
    await client.query('COMMIT');
    return { orderId: orderNumber, amount, snapToken: snap.token, redirectUrl: snap.redirect_url };
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function getOrderStatus(orderNumber: string) {
  if (!pool) throw new Error('DATABASE_NOT_CONFIGURED');
  const result = await pool.query(`SELECT o.status, i.slug, i.is_published FROM orders o JOIN invitations i ON i.order_id=o.id WHERE o.order_number=$1`, [orderNumber]);
  if (result.rowCount !== 1) return null;
  return result.rows[0] as { status: string; slug: string; is_published: boolean };
}
