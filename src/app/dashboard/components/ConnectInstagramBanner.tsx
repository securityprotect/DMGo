'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Camera, ArrowRight, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ConnectInstagramBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    const res = await fetch('/api/instagram/connect-url');
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.url) {
      toast.error(data.error || 'Unable to connect Instagram');
      return;
    }
    window.location.href = data.url;
  };

  return (
    <>
      <div className="rounded-2xl border border-primary/25 bg-primary-light/40 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-white shrink-0">
          <Camera size={22} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Connect your Instagram account to get started</p>
          <p className="text-xs text-muted-foreground mt-0.5">DmGo uses the official Instagram Graph API.</p>
        </div>
        <Button rightIcon={<ArrowRight size={15} />} onClick={() => setModalOpen(true)} className="shrink-0">
          Connect Instagram
        </Button>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Connect Instagram Account"
        description="You will be redirected to Instagram to authorize DmGo."
      >
        <div className="flex flex-col gap-5">
          <Button fullWidth rightIcon={<ExternalLink size={15} />} onClick={() => void handleConnect()} loading={loading}>
            Continue to Instagram
          </Button>
        </div>
      </Modal>
    </>
  );
}

