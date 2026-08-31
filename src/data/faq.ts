export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse the shop or create a custom design, add it to your cart, and continue to WhatsApp. Our team confirms availability, final pricing, and delivery details before you pay.',
  },
  {
    question: 'How does the custom design process work?',
    answer:
      'Upload your artwork on the Custom page, preview it on the product, and confirm you have the rights to use it. We review every submission manually before it goes to print.',
  },
  {
    question: 'What file types can I upload?',
    answer: 'PNG, JPG, WEBP, and PDF files up to 10 MB. PNG is preferred for artwork with transparency.',
  },
  {
    question: 'How is payment handled?',
    answer:
      'AYUM confirms your order and final price on WhatsApp first. Payment is collected after confirmation — not automatically on the website.',
  },
  {
    question: 'What are the delivery timelines?',
    answer:
      'Most orders ship within 5–8 business days of confirmation, depending on the product. Exact estimates are shown on each product page.',
  },
  {
    question: 'Can I return or exchange an order?',
    answer:
      'Standard products follow our Returns & Refunds policy. Custom-printed items are made specifically for you, so please review your design carefully before confirming.',
  },
];
