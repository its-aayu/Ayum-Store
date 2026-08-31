export type PolicySection = {
  heading: string;
  body: string[];
};

export type PolicyContent = {
  slug: string;
  title: string;
  summary: string;
  sections: PolicySection[];
};

export const policies: Record<string, PolicyContent> = {
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'How AYUM collects, uses and protects the information you share with us.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'When you contact us on WhatsApp to place an order, we receive the information you choose to share there — such as your name, delivery address and phone number — directly through WhatsApp, not through this website.',
          'If you upload a custom design, we store the file and basic metadata (file type, dimensions, upload date) so we can review and print it.',
          'The website itself may collect anonymous usage data (pages viewed, general interactions) to help us improve the experience.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To confirm, produce and ship your order.',
          'To respond to questions and provide support.',
          'To improve the website and our product offering.',
        ],
      },
      {
        heading: 'Custom design uploads',
        body: [
          'Uploaded artwork is stored securely and is not made publicly discoverable. We retain uploaded files for 30–90 days after an order is completed, after which they are deleted unless required for a support issue.',
        ],
      },
      {
        heading: 'Third parties',
        body: [
          'We use Cloudinary to store images and uploaded artwork, and WhatsApp to communicate about orders. We do not sell your personal information.',
        ],
      },
      {
        heading: 'Contact',
        body: ['If you have questions about this policy, reach out through the Contact page.'],
      },
    ],
  },
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    summary: 'The terms that apply when you use the AYUM website and place an order.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'Adding a product to your cart and continuing to WhatsApp creates an order request, not a confirmed order. An order is only confirmed once AYUM verifies availability, final pricing and delivery details with you directly.',
          'Prices shown on the website are indicative and are confirmed at the time of order.',
        ],
      },
      {
        heading: 'Payment',
        body: [
          'Payment is collected after AYUM confirms your order on WhatsApp. We do not charge you automatically through this website.',
        ],
      },
      {
        heading: 'Custom designs',
        body: [
          'By submitting a custom design, you confirm you own the rights to it or have permission to use and print it. AYUM manually reviews every custom submission and may decline to print content that infringes on third-party rights or violates our Custom Design & Copyright Policy.',
        ],
      },
      {
        heading: 'Changes',
        body: ['We may update these terms from time to time. Continued use of the website means you accept the current version.'],
      },
    ],
  },
  shipping: {
    slug: 'shipping',
    title: 'Shipping Policy',
    summary: 'How and when AYUM orders are delivered across India.',
    sections: [
      {
        heading: 'Delivery timelines',
        body: [
          'Most orders are printed and shipped within 4–8 business days of order confirmation, depending on the product. Estimated timelines are shown on each product page.',
          'Delivery timelines are estimates and may vary due to courier delays, high demand, or custom design review.',
        ],
      },
      {
        heading: 'Coverage',
        body: ['We currently ship across India.'],
      },
      {
        heading: 'Tracking',
        body: ['Once your order ships, AYUM will share tracking details with you on WhatsApp.'],
      },
    ],
  },
  returns: {
    slug: 'returns',
    title: 'Returns Policy',
    summary: 'When and how a product can be returned.',
    sections: [
      {
        heading: 'Standard products',
        body: [
          'If you receive a damaged or incorrect item, contact us within 48 hours of delivery with photos of the product and packaging, and we will arrange a replacement or resolution.',
        ],
      },
      {
        heading: 'Custom-printed products',
        body: [
          'Because custom products are made specifically for you, they can only be returned if the item is defective or does not match the design you approved.',
        ],
      },
      {
        heading: 'How to start a return',
        body: ['Message us on WhatsApp with your order reference and details of the issue.'],
      },
    ],
  },
  refunds: {
    slug: 'refunds',
    title: 'Refunds Policy',
    summary: 'How refunds are handled once a return or cancellation is approved.',
    sections: [
      {
        heading: 'Eligibility',
        body: ['Refunds are issued for orders that are cancelled before production, or approved returns as described in our Returns Policy.'],
      },
      {
        heading: 'Processing time',
        body: ['Approved refunds are processed within 5–7 business days to your original payment method.'],
      },
      {
        heading: 'Non-refundable cases',
        body: ['Custom orders already sent to production cannot be refunded unless the item is defective or incorrect.'],
      },
    ],
  },
  cancellation: {
    slug: 'cancellation',
    title: 'Cancellation Policy',
    summary: 'When you can cancel an order after confirming it with AYUM.',
    sections: [
      {
        heading: 'Before production',
        body: ['Orders can be cancelled free of charge any time before they are sent to print or production. Message us on WhatsApp with your order reference to cancel.'],
      },
      {
        heading: 'After production has started',
        body: ['Once an order — especially a custom design — has entered production, it can no longer be cancelled, as it is being made specifically for you.'],
      },
    ],
  },
  'custom-design-policy': {
    slug: 'custom-design-policy',
    title: 'Custom Design & Copyright Policy',
    summary: 'The rules that apply when you upload your own artwork for printing.',
    sections: [
      {
        heading: 'Your responsibility',
        body: [
          'By uploading a design, you confirm that you own the rights to it, or have explicit permission from the rights holder to use and print it.',
          'This includes copyrighted artwork, trademarks, logos, celebrity images, characters and sports team branding — all of which require permission from the rights holder before they can be printed.',
        ],
      },
      {
        heading: 'Manual review',
        body: [
          'Every custom design is manually reviewed by AYUM before production. We do not automatically forward every upload to print.',
          'We may decline to print designs that appear to infringe on third-party rights, or that contain offensive or illegal content.',
        ],
      },
      {
        heading: 'File retention',
        body: ['Uploaded artwork is retained for 30–90 days after a completed order and then deleted, in line with our Privacy Policy.'],
      },
      {
        heading: 'Print accuracy',
        body: ['The on-screen preview is a visual reference. Actual print colour and placement may vary slightly from the preview.'],
      },
    ],
  },
};
