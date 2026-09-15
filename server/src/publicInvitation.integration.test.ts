import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { getPublicInvitation, pool } from './db.js';

const enabled=Boolean(process.env.DATABASE_URL);

async function seed(status:'ACTIVE'|'PENDING_PAYMENT',published:boolean,activeUntil:string|null){
  if(!pool)throw new Error('DATABASE_NOT_CONFIGURED');
  const orderId=randomUUID(),invitationId=randomUUID(),slug=`public-${randomUUID()}`;
  await pool.query(`INSERT INTO orders(id,order_number,customer_name,customer_email,customer_phone,package_slug,template_slug,gross_amount,status) VALUES($1,$2,'Public Test','public@example.com','0800','REGULER','modern-minimalist',50000,$3)`,[orderId,`ORD-${randomUUID()}`,status]);
  await pool.query(`INSERT INTO invitations(id,order_id,slug,template_slug,package_slug,is_published,active_until,payload) VALUES($1,$2,$3,'modern-minimalist','REGULER',$4,$5,'{"couple":"test"}'::jsonb)`,[invitationId,orderId,slug,published,activeUntil]);
  return{orderId,slug};
}
async function cleanup(orderId:string){if(!pool)return;await pool.query('DELETE FROM invitations WHERE order_id=$1',[orderId]);await pool.query('DELETE FROM orders WHERE id=$1',[orderId])}

test('public invitation is returned only when published and active',{skip:!enabled},async()=>{
  const x=await seed('ACTIVE',true,new Date(Date.now()+86400000).toISOString());
  try{const invitation=await getPublicInvitation(x.slug);assert.ok(invitation);assert.equal(invitation.slug,x.slug);assert.deepEqual(invitation.payload,{couple:'test'})}finally{await cleanup(x.orderId)}
});

test('unpublished or unpaid invitation is not publicly readable',{skip:!enabled},async()=>{
  const unpublished=await seed('ACTIVE',false,new Date(Date.now()+86400000).toISOString());
  const unpaid=await seed('PENDING_PAYMENT',true,new Date(Date.now()+86400000).toISOString());
  try{assert.equal(await getPublicInvitation(unpublished.slug),null);assert.equal(await getPublicInvitation(unpaid.slug),null)}finally{await cleanup(unpublished.orderId);await cleanup(unpaid.orderId)}
});

test('expired invitation is hidden and order is atomically marked EXPIRED',{skip:!enabled},async()=>{
  const x=await seed('ACTIVE',true,new Date(Date.now()-60000).toISOString());
  try{
    assert.equal(await getPublicInvitation(x.slug),null);
    const state=await pool!.query('SELECT status FROM orders WHERE id=$1',[x.orderId]);
    assert.equal(state.rows[0].status,'EXPIRED');
  }finally{await cleanup(x.orderId)}
});
