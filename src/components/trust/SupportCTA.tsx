import { MessageCircle } from 'lucide-react';
import { generateGeneralContactUrl } from '@/services/whatsapp/generateWhatsAppOrderUrl';
import { buttonClasses } from '@/components/common/Button';
import { cn } from '@/utils/cn';

export function SupportCTA({ className }: { className?: string }) {
  return (
    <a
      href={generateGeneralContactUrl()}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(buttonClasses('outline', 'sm'), className)}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      Contact AYUM
    </a>
  );
}
