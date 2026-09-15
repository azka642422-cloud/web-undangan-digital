import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { pool } from './db.js';
import { getCustomerDashboard } from './dashboard.js';

const enabled=Boolean(process.env.DATABASE_URL);

test('customer dashboard returns only invitations owned by that user',{skip:!enabled},async()=>{
  if(!pool)throw new Error('DATABASE_NOT_CONFIGURED');
  const userA=randomUUID(),userB=randomUUID(),orderA=randomUUID(),orderB=randomUUID();
  try{
    await pool.query(`INSERT INTO users(id,email,password_hash,display_name) VALUES($1,$2,'test-hash','Owner A'),($3,$4,'test-hash','Owner B')`,[userA,`a-${randomUUID()}@example.com`,userB,`b-${randomUUID()}@example.com`]);
    await pool.query(`INSERT INTO orders(id,order_number,customer_name,customer_email,customer_phone,package_slug,template_slug,gross_amount,status,user_id) VALUES($1,$2,'A','a@example.com','0801','REGULER','modern-minimalist',50000,'ACTIVE',$3),($4,$5,'B','b@example.com','0802','REGULER','modern-minimalist',50000,'ACTIVE',$6)`,[orderA,`ORD-${randomUUID()}`,userA,orderB,`ORD-${randomUUID()}`,userB]);
    await pool.query(`INSERT INTO invitations(id,order_id,slug,template_slug,package_slug,is_published) VALUES($1,$2,$3,'modern-minimalist','REGULER',true),($4,$5,$6,'modern-minimalist','REGULER',true)`,[randomUUID(),orderA,`owner-a-${randomUUID()}`,randomUUID(),orderB,`owner-b-${randomUUID()}`]);
    const a=await getCustomerDashboard(userA),b=await getCustomerDashboard(userB);
    assert.equal(a.length,1);assert.equal(b.length,1);
    assert.match(String(a[0].slug),/^owner-a-/);assert.match(String(b[0].slug),/^owner-b-/);
    assert.notEqual(a[0].slug,b[0].slug);
  }finally{
    await pool.query('DELETE FROM invitations WHERE order_id=ANY($1::uuid[])',[[orderA,orderB]]);
    await pool.query('DELETE FROM orders WHERE id=ANY($1::uuid[])',[[orderA,orderB]]);
    await pool.query('DELETE FROM users WHERE id=ANY($1::uuid[])',[[userA,userB]]);
  }
});
