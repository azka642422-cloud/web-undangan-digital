import React, { useState } from 'react';
import { Template, TemplateCategory } from '../types';
import { appStorage } from '../services/storage';
import { Eye, Sparkles, Filter, MessageCircle, Check } from 'lucide-react';

interface TemplatesPageProps {
  onNavigate: (path: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const templates = appStorage.getTemplates().filter((t) => t.isActive);

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory === 'all') return true;
    return tpl.category === selectedCategory;
  });

  const openWhatsApp = () => {
    window.open(
      'https://wa.me/6285941041089?text=Halo%20Admin%20Aksara%20Undangan,%20saya%20ingin%20request%20template%20baru.',
      '_blank'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest uppercase text-[#C59B27]">
          Katalog Desain Undangan
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-stone-900">
          Pilihan Template Elegan
        </h1>
        <p className="text-sm text-stone-600">
          Semua template sudah dirancang responsif, mobile-first, dan dapat disesuaikan sepenuhnya dengan data pernikahan Anda.
        </p>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#0B132B] text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
          }`}
        >
          Semua Template ({templates.length})
        </button>
        <button
          onClick={() => setSelectedCategory('gratis')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === 'gratis'
              ? 'bg-[#0B132B] text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
          }`}
        >
          Paket Hemat (Gratis Template)
        </button>
        <button
          onClick={() => setSelectedCategory('reguler')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === 'reguler'
              ? 'bg-[#0B132B] text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
          }`}
        >
          Kategori Reguler
        </button>
        <button
          onClick={() => setSelectedCategory('premium')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === 'premium'
              ? 'bg-[#0B132B] text-white shadow-md'
              : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
          }`}
        >
          Kategori VIP Premium (Kitab Kuning)
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-64 overflow-hidden bg-stone-100">
              <img
                src={tpl.thumbnailUrl}
                alt={tpl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md ${
                    tpl.category === 'gratis'
                      ? 'bg-emerald-600 text-white'
                      : tpl.category === 'reguler'
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#0B132B] text-amber-300 border border-amber-400/40'
                  }`}
                >
                  {tpl.category === 'gratis' ? 'Hemat' : tpl.category === 'reguler' ? 'Reguler' : 'VIP Santri'}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-stone-900">{tpl.name}</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="space-y-1.5 mt-4">
                  {tpl.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => onNavigate(`/invite/${tpl.demoSlug}`)}
                  className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Demo
                </button>
                <button
                  onClick={() => onNavigate(`/checkout?template=${tpl.slug}`)}
                  className="flex-1 py-2.5 px-3 bg-[#0B132B] hover:bg-[#1E232A] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Gunakan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Custom Template Section */}
      <div className="bg-[#FAF7F0] border border-amber-400/30 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
            Ingin Template Adat atau Kustomisasi Khusus?
          </h3>
          <p className="text-xs text-stone-600 max-w-lg">
            Sampaikan konsep Anda (Adat Batak, Minang, Bali, Bugis, Modern Glamour) ke nomor WhatsApp admin kami:
            <span className="font-bold text-stone-900"> 085941041089</span>.
          </p>
        </div>

        <button
          onClick={openWhatsApp}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Request Custom Template</span>
        </button>
      </div>
    </div>
  );
};
