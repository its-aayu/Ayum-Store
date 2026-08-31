import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { SupportCTA } from '@/components/trust/SupportCTA';

type WhatsAppFallbackModalProps = {
  message: string | null;
  onClose: () => void;
};

export function WhatsAppFallbackModal({ message, onClose }: WhatsAppFallbackModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the textarea below still lets the customer select and copy manually.
    }
  }

  return (
    <Modal open={message !== null} onClose={onClose} title="We couldn't open WhatsApp">
      <p className="text-sm text-muted">
        Your browser blocked the WhatsApp link. Copy your order details below and paste them into a chat with us.
      </p>
      <textarea
        readOnly
        value={message ?? ''}
        rows={8}
        className="mt-4 w-full rounded-input border border-border bg-surface p-3 text-xs text-ink"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="primary" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy Order Details'}
        </Button>
        <SupportCTA />
      </div>
    </Modal>
  );
}
