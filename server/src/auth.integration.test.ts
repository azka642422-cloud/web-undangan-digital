import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import argon2 from 'argon2';
import { pool } from './db.js';
import { login } from './auth.js';

const enabled=Boolean(process.env.DATABASE_URL);

test('concurrent logins never leave more than five active sessions',{skip:!enabled},async()=>{
  if(!pool)throw new Error('DATABASE_NOT_CONFIGURED');
  const userId=randomUUID(),email=`sessions-${randomUUID()}@example.com`,password='StrongPassword123';
  const passwordHash=await argon2.hash(password,{type:argon2.argon2id});
  try{
    await pool.query(`INSERT INTO users(id,email,password_hash,display_name,role,is_active) VALUES($1,$2,$3,'Session Test','CUSTOMER',true)`,[userId,email,passwordHash]);
    const results=await Promise.all(Array.from({length:10},()=>login(email,password)));
    assert.equal(results.filter(Boolean).length,10);
    const count=await pool.query(`SELECT count(*)::int n FROM sessions WHERE user_id=$1 AND revoked_at IS NULL AND expires_at>now()`,[userId]);
    assert.equal(count.rows[0].n,5);
  }finally{
    await pool.query('DELETE FROM sessions WHERE user_id=$1',[userId]);
    await pool.query('DELETE FROM users WHERE id=$1',[userId]);
  }
});
