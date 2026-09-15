import React, { useState } from 'react';
import { GiftAccount } from '../types';
import { CreditCard, Copy, Check, QrCode, Heart } from 'lucide-react';

interface WeddingGiftSectionProps {
  gifts?: GiftAccount[];
  theme?: 'modern' | 'walimah' | 'kitab-kuning';
}

export const WeddingGiftSection: React.FC<WeddingGiftSectionProps> = ({ gifts = [], theme = 'modern' }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQris, setSelectedQris] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!gifts || gifts.length === 0) return null;

  return (
    <div className="my-8">
      <div className="text-center mb-6">
        <Heart className="w-6 h-6 mx-auto mb-2 text-[#C59B27] animate-pulse" />
        <h3
          className={`text-2xl font-bold ${
            theme === 'kitab-kuning'
              ? 'font-amiri text-[#4A3215]'
              : theme === 'walimah'
              ? 'font-serif text-emerald-950'
              : 'font-serif-luxury text-stone-900'
          }`}
        >
          Tanda Kasih (Wedding Gift)
        </h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto mt-1 px-4">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih, dapat melalui:
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto px-4">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className={`p-4 rounded-xl border transition-all ${
              theme === 'kitab-kuning'
                ? 'bg-[#F2E5BF] border-[#755B39] text-[#3D2C15]'
                : theme === 'walimah'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-white border-stone-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#C59B27]" />
                <span className="font-semibold text-sm">{gift.providerName}</span>
              </div>
              {gift.type === 'qris' && gift.qrisImageUrl && (
                <button
                  onClick={() => setSelectedQris(gift.qrisImageUrl || null)}
                  className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded"
                >
                  <QrCode className="w-3.5 h-3.5" /> Lihat QRIS
                </button>
              )}
            </div>

            <div className="bg-white/60 p-2.5 rounded-lg border border-black/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">Nomor Rekening / NMID:</p>
                <p className="font-mono font-bold text-base tracking-wider text-stone-800">
                  {gift.accountNumber}
                </p>
                <p className="text-xs text-stone-600">a.n {gift.accountHolder}</p>
              </div>

              <button
                id={`btn-copy-${gift.id}`}
                onClick={() => handleCopy(gift.accountNumber, gift.id)}
                className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                  copiedId === gift.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
                title="Salin Nomor"
              >
                {copiedId === gift.id ? (
                  <>
                    <Check className="w-4 h-4" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Salin
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QRIS Modal */}
      {selectedQris && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <h4 className="font-bold text-lg mb-2 text-stone-900">Scan QRIS</h4>
            <p className="text-xs text-stone-500 mb-4">
              Buka aplikasi m-Banking atau e-Wallet dan scan QR di bawah ini:
            </p>
            <div className="p-3 bg-stone-100 rounded-xl inline-block border">
              <img src={selectedQris} alt="QRIS Code" className="w-56 h-56 mx-auto object-contain" />
            </div>
            <button
              onClick={() => setSelectedQris(null)}
              className="mt-5 w-full py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
