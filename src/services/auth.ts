export type SessionUser={id:string;email:string;displayName:string;role:'CUSTOMER'|'ADMIN'};
const API_BASE=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');
async function request(path:string,init?:RequestInit){const r=await fetch(`${API_BASE}${path}`,{...init,credentials:'include',headers:{Accept:'application/json',...(init?.body?{'Content-Type':'application/json'}:{}),...init?.headers}});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.code||'REQUEST_FAILED');return d;}
export async function getSession():Promise<SessionUser|null>{try{const d=await request('/api/auth/session');return d.user as SessionUser;}catch{return null;}}
export async function loginUser(email:string,password:string):Promise<SessionUser>{const d=await request('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});return d.user as SessionUser;}
export async function logoutUser(){await request('/api/auth/logout',{method:'POST'});}
