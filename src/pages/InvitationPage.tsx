import React, { useState, useEffect } from 'react';
import { appStorage } from '../services/storage';
import { templateRegistry } from '../templates/registry';
import { Invitation, Rsvp, GuestMessage } from '../types';
import { Share2, Check } from 'lucide-react';

interface InvitationPageProps {
  slug: string;
  onNavigate?: (path: string) => void;
}

export const InvitationPage: React.FC<InvitationPageProps> = ({ slug, onNavigate }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Extract query parameters (?to=Nama+Tamu)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }
  }, []);

  // Fetch invitation by slug
  useEffect(() => {
    const found = appStorage.getInvitationBySlug(slug);
    if (found) {
      setInvitation(found);
    }
  }, [slug]);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-3xl font-serif-luxury font-bold text-amber-300">Undangan Tidak Ditemukan</h1>
        <p className="text-xs text-stone-300 max-w-sm">
          Undangan dengan alamat <span className="font-mono text-amber-200">/invite/{slug}</span> tidak ditemukan atau belum dipublikasikan.
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-2.5 bg-[#D4AF37] text-[#0B132B] font-bold text-xs rounded-xl shadow-md"
          >
            Kembali ke Beranda
          </button>
        )}
      </div>
    );
  }

  // Check if invitation is unpublished
  if (!invitation.isPublished) {
    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-serif-luxury font-bold text-amber-300">Undangan Sedang Ditangguhkan</h1>
        <p className="text-xs text-stone-300 max-w-sm">
          Undangan ini saat ini berada dalam status Non-Aktif oleh pemilik atau admin.
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-5 py-2 bg-stone-700 text-white font-bold text-xs rounded-xl"
          >
            Buka Dashboard
          </button>
        )}
      </div>
    );
  }

  const TemplateComponent = templateRegistry.get(invitation.templateSlug);

  const handleRsvpSubmit = async (rsvp: Omit<Rsvp, 'id' | 'invitationId' | 'createdAt'>): Promise<boolean> => {
    const success = await appStorage.submitRsvp(invitation.id, rsvp);
    if (success) {
      const refreshed = appStorage.getInvitationById(invitation.id);
      if (refreshed) setInvitation({ ...refreshed });
    }
    return success;
  };

  const handleMessageSubmit = async (
    msg: Omit<GuestMessage, 'id' | 'invitationId' | 'isApproved' | 'createdAt'>
  ): Promise<boolean> => {
    const success = await appStorage.submitGuestMessage(invitation.id, msg);
    if (success) {
      const refreshed = appStorage.getInvitationById(invitation.id);
      if (refreshed) setInvitation({ ...refreshed });
    }
    return success;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative">
      {/* Top Floating Helper for Invitation Viewers / Hosts */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="p-3 bg-[#0B132B]/90 hover:bg-[#0B132B] text-amber-300 rounded-full shadow-2xl border border-amber-400/30 backdrop-blur-sm transition-transform hover:scale-105"
          title="Salin Link Undangan"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Render Decoupled Registered Template */}
      <TemplateComponent
        invitation={invitation}
        packageTier={invitation.packageSlug}
        guestName={guestName}
        onRsvpSubmit={handleRsvpSubmit}
        onMessageSubmit={handleMessageSubmit}
      />
    </div>
  );
};
