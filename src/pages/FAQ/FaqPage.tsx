import { Container } from '@/components/common/Container';
import { SeoHead } from '@/components/common/SeoHead';
import { StructuredData } from '@/components/common/StructuredData';
import { FAQAccordion } from '@/components/trust/FAQAccordion';
import { faqs } from '@/data/faq';

export function FaqPage() {
  return (
    <>
      <SeoHead title="FAQ" description="Answers to common questions about ordering, custom designs and delivery." />
      <StructuredData
        id="faq-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Frequently Asked Questions</h1>
          <div className="mt-10">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </Container>
    </>
  );
}
