import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SecureCheckoutPage } from './pages/SecureCheckoutPage';
import { InvitationPage } from './pages/InvitationPage';

function ProtectedRouteUnavailable({ area, onNavigate }: { area: string; onNavigate: (to: string) => void }) {
  return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6"><div className="max-w-md w-full rounded-2xl border border-stone-200 bg-white p-7 text-center shadow-sm"><h1 className="text-2xl font-semibold text-stone-900">{area} belum tersedia</h1><p className="mt-3 text-sm leading-6 text-stone-600">Akses dinonaktifkan sementara sampai autentikasi dan otorisasi server-side selesai. Data admin atau pelanggan tidak akan dibuka hanya berdasarkan state browser.</p><button onClick={()=>onNavigate('/')} className="mt-6 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white">Kembali ke beranda</button></div></div>;
}

export default function App() {
  const [currentPath,setCurrentPath]=useState(window.location.pathname||'/');
  const [searchParams,setSearchParams]=useState(new URLSearchParams(window.location.search));
  useEffect(()=>{const h=()=>{setCurrentPath(window.location.pathname||'/');setSearchParams(new URLSearchParams(window.location.search));window.scrollTo(0,0)};window.addEventListener('popstate',h);return()=>window.removeEventListener('popstate',h)},[]);
  const navigate=(to:string)=>{const[path,query]=to.split('?');window.history.pushState({},'',to);setCurrentPath(path||'/');setSearchParams(new URLSearchParams(query?`?${query}`:''));window.scrollTo(0,0)};
  const isInviteRoute=currentPath.startsWith('/invite/');const inviteSlug=isInviteRoute?currentPath.replace('/invite/','').split('/')[0]:'';
  if(isInviteRoute&&inviteSlug)return <div className="min-h-screen bg-stone-900"><InvitationPage slug={inviteSlug} onNavigate={navigate}/></div>;
  if(currentPath.startsWith('/admin'))return <ProtectedRouteUnavailable area="Panel admin" onNavigate={navigate}/>;
  if(currentPath.startsWith('/dashboard'))return <ProtectedRouteUnavailable area="Dashboard pelanggan" onNavigate={navigate}/>;
  return <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E232A] font-sans antialiased selection:bg-[#D4AF37]/30"><div className="bg-[#050A18] text-amber-200/90 text-[11px] py-1.5 px-4 border-b border-amber-500/20 flex items-center justify-between overflow-x-auto gap-4"><div className="flex items-center gap-2 shrink-0"><span className="font-bold text-white uppercase tracking-wider">Aksara Undangan</span><span className="text-stone-400">|</span><span className="text-stone-300">Demo Template</span></div><div className="flex items-center gap-3 shrink-0"><button onClick={()=>navigate('/invite/aisyah-fauzi')} className="hover:text-white underline">Modern</button><button onClick={()=>navigate('/invite/ali-fatimah')} className="hover:text-white underline">Walimah</button><button onClick={()=>navigate('/invite/hasan-maryam')} className="hover:text-white underline">Kitab Kuning</button></div></div><Navbar currentPath={currentPath} onNavigate={navigate}/><main className="flex-1">{currentPath==='/'&&<HomePage onNavigate={navigate}/>} {currentPath==='/templates'&&<TemplatesPage onNavigate={navigate}/>} {currentPath==='/pricing'&&<PricingPage onNavigate={navigate}/>} {currentPath==='/how-it-works'&&<HowItWorksPage onNavigate={navigate}/>} {currentPath==='/checkout'&&<SecureCheckoutPage initialPackage={searchParams.get('package')||'REGULER'} initialTemplate={searchParams.get('template')||'modern-minimalist'} onNavigate={navigate}/>}</main><Footer onNavigate={navigate}/></div>;
}
