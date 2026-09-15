import React, { useState } from 'react';
import { Smartphone, Monitor, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';

interface InvitationViewportProps {
  children: React.ReactNode;
  slug: string;
  onBack?: () => void;
  title?: string;
}

export const InvitationViewport: React.FC<InvitationViewportProps> = ({
  children,
  slug,
  onBack,
  title,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'full'>('mobile');

  return (
    <div className="min-h-screen bg-[#111625] flex flex-col">
      {/* Top Floating Simulation Bar (Only visible in preview or dashboard) */}
      <div className="bg-[#0B132B] text-white border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between z-50 text-xs shadow-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-stone-300 hover:text-white px-2 py-1 rounded bg-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
          )}
          <span className="font-semibold text-amber-200 truncate max-w-xs sm:max-w-md">
            {title || `Preview: /invite/${slug}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="hidden sm:flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-[#D4AF37] text-[#0B132B] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile (390px)
            </button>
            <button
              onClick={() => setDeviceMode('full')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                deviceMode === 'full'
                  ? 'bg-[#D4AF37] text-[#0B132B] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Full Responsive
            </button>
          </div>

          <a
            href={`/invite/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] bg-white/10 hover:bg-white/20 text-stone-200"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Tab Baru
          </a>
        </div>
      </div>

      {/* Viewport Frame */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto py-4 sm:py-8 px-2 sm:px-4">
        {deviceMode === 'mobile' ? (
          <div className="w-full max-w-[420px] min-h-[780px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-stone-800 relative transition-all">
            {/* Phone Notch/Speaker simulation */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-stone-800 rounded-full z-30 pointer-events-none"></div>
            <div className="h-full overflow-y-auto pt-2">{children}</div>
          </div>
        ) : (
          <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden min-h-screen">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
