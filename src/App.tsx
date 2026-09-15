import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SecureCheckoutPage } from './pages/SecureCheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { InvitationPage } from './pages/InvitationPage';

export default function App() {
  const [currentPath,setCurrentPath]=useState(window.location.pathname||'/');
  const [searchParams,setSearchParams]=useState(new URLSearchParams(window.location.search));
  useEffect(()=>{const h=()=>{setCurrentPath(window.location.pathname||'/');setSearchParams(new URLSearchParams(window.location.search));window.scrollTo(0,0)};window.addEventListener('popstate',h);return()=>window.removeEventListener('popstate',h)},[]);
  const navigate=(to:string)=>{const[path,query]=to.split('?');window.history.pushState({},'',to);setCurrentPath(path||'/');setSearchParams(new URLSearchParams(query?`?${query}`:''));window.scrollTo(0,0)};
  const isInviteRoute=currentPath.startsWith('/invite/');const inviteSlug=isInviteRoute?currentPath.replace('/invite/','').split('/')[0]:'';const isAdminRoute=currentPath.startsWith('/admin');
  if(isInviteRoute&&inviteSlug)return <div className="min-h-screen bg-stone-900"><InvitationPage slug={inviteSlug} onNavigate={navigate}/></div>;
  if(isAdminRoute)return <AdminDashboardPage onNavigate={navigate}/>;
  return <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E232A] font-sans antialiased selection:bg-[#D4AF37]/30"><div className="bg-[#050A18] text-amber-200/90 text-[11px] py-1.5 px-4 border-b border-amber-500/20 flex items-center justify-between overflow-x-auto gap-4"><div className="flex items-center gap-2 shrink-0"><span className="font-bold text-white uppercase tracking-wider">Aksara Undangan</span><span className="text-stone-400">|</span><span className="text-stone-300">Demo Template</span></div><div className="flex items-center gap-3 shrink-0"><button onClick={()=>navigate('/invite/aisyah-fauzi')} className="hover:text-white underline">Modern</button><button onClick={()=>navigate('/invite/ali-fatimah')} className="hover:text-white underline">Walimah</button><button onClick={()=>navigate('/invite/hasan-maryam')} className="hover:text-white underline">Kitab Kuning</button></div></div><Navbar currentPath={currentPath} onNavigate={navigate}/><main className="flex-1">{currentPath==='/'&&<HomePage onNavigate={navigate}/>} {currentPath==='/templates'&&<TemplatesPage onNavigate={navigate}/>} {currentPath==='/pricing'&&<PricingPage onNavigate={navigate}/>} {currentPath==='/how-it-works'&&<HowItWorksPage onNavigate={navigate}/>} {currentPath==='/checkout'&&<SecureCheckoutPage initialPackage={searchParams.get('package')||'REGULER'} initialTemplate={searchParams.get('template')||'modern-minimalist'} onNavigate={navigate}/>} {currentPath==='/dashboard'&&<DashboardPage onNavigate={navigate}/>}</main><Footer onNavigate={navigate}/></div>;
}
