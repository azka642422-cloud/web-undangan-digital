import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { pool } from './db.js';

export const uploadRequestSchema = z.object({
  invitationId: z.string().uuid(),
  category: z.enum(['IMAGE', 'AUDIO']),
  byteSize: z.number().int().positive(),
  contentType: z.string().min(1).max(100),
}).strict();

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const audioTypes = new Set(['audio/mpeg', 'audio/mp4', 'audio/ogg']);

export function validateUploadRequest(category: 'IMAGE' | 'AUDIO', byteSize: number, contentType: string) {
  if (category === 'IMAGE') return byteSize <= 8 * 1024 * 1024 && imageTypes.has(contentType);
  return byteSize <= 15 * 1024 * 1024 && audioTypes.has(contentType);
}

export async function authorizeUpload(userId: string, input: z.infer<typeof uploadRequestSchema>) {
  if (!pool) throw new Error('DATABASE_NOT_CONFIGURED');
  if (!validateUploadRequest(input.category, input.byteSize, input.contentType)) return null;
  const r = await pool.query(
    `SELECT i.id,i.package_slug FROM invitations i JOIN orders o ON o.id=i.order_id
     WHERE i.id=$1 AND o.user_id=$2 LIMIT 1`,
    [input.invitationId, userId]
  );
  if (r.rowCount !== 1) return null;
  const invitation = r.rows[0];
  if (input.category === 'AUDIO' && invitation.package_slug === 'HEMAT') return null;
  const objectKey = `${userId}/${input.invitationId}/${randomUUID()}`;
  await pool.query(
    `INSERT INTO media_uploads(id,invitation_id,user_id,object_key,category,declared_content_type,byte_size,status)
     VALUES($1,$2,$3,$4,$5,$6,$7,'QUARANTINED')`,
    [randomUUID(), input.invitationId, userId, objectKey, input.category, input.contentType, input.byteSize]
  );
  return { objectKey, status: 'QUARANTINED' as const };
}

export function storageConfigured() {
  return Boolean(process.env.MEDIA_STORAGE_ENDPOINT && process.env.MEDIA_STORAGE_BUCKET && process.env.MEDIA_STORAGE_ACCESS_KEY && process.env.MEDIA_STORAGE_SECRET_KEY);
}
