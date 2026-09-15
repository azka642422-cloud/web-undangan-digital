import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { pool } from './db.js';

const COOKIE_NAME = 'aksara_session';
const SESSION_MS = 1000 * 60 * 60 * 24 * 7;

export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(8).max(200) }).strict();
export type AuthUser = { id: string; email: string; displayName: string; role: 'CUSTOMER' | 'ADMIN' };
export type AuthRequest = Request & { authUser?: AuthUser; sessionId?: string };

function hashToken(token: string) { return createHash('sha256').update(token).digest('hex'); }
function readCookie(req: Request, name: string) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) { const [key, ...value] = part.trim().split('='); if (key === name) return decodeURIComponent(value.join('=')); }
  return null;
}
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: SESSION_MS }; }

export async function login(email: string, password: string) {
  if (!pool) throw new Error('DATABASE_NOT_CONFIGURED');
  const result = await pool.query(`SELECT id,email,password_hash,display_name,role,is_active FROM users WHERE lower(email)=lower($1) LIMIT 1`, [email]);
  const row = result.rows[0];
  if (!row || !row.is_active || !(await argon2.verify(row.password_hash, password))) return null;
  const token = randomBytes(32).toString('base64url');
  const sessionId = randomUUID();
  await pool.query(`INSERT INTO sessions (id,user_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '7 days')`, [sessionId, row.id, hashToken(token)]);
  return { token, user: { id: row.id, email: row.email, displayName: row.display_name, role: row.role } as AuthUser };
}

export function setSessionCookie(res: Response, token: string) { res.cookie(COOKIE_NAME, token, cookieOptions()); }
export function clearSessionCookie(res: Response) { res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' }); }

export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    if (!pool) return next();
    const token = readCookie(req, COOKIE_NAME); if (!token) return next();
    const result = await pool.query(`SELECT s.id AS session_id,u.id,u.email,u.display_name,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now() AND u.is_active=true LIMIT 1`, [hashToken(token)]);
    const row = result.rows[0];
    if (row) { req.sessionId=row.session_id; req.authUser={ id:row.id,email:row.email,displayName:row.display_name,role:row.role }; await pool.query(`UPDATE sessions SET last_seen_at=now() WHERE id=$1`, [row.session_id]); }
    next();
  } catch { next(); }
}
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) { if (!req.authUser) return res.status(401).json({ ok:false, code:'AUTH_REQUIRED' }); next(); }
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) { if (!req.authUser) return res.status(401).json({ ok:false, code:'AUTH_REQUIRED' }); if (req.authUser.role !== 'ADMIN') return res.status(403).json({ ok:false, code:'FORBIDDEN' }); next(); }
export async function revokeCurrentSession(req: AuthRequest) { if (pool && req.sessionId) await pool.query(`UPDATE sessions SET revoked_at=now() WHERE id=$1`, [req.sessionId]); }
