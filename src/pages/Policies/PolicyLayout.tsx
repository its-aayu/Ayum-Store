import { Container } from '@/components/common/Container';
import { SeoHead } from '@/components/common/SeoHead';
import type { PolicyContent } from '@/data/policies';

export function PolicyLayout({ policy }: { policy: PolicyContent }) {
  return (
    <>
      <SeoHead title={policy.title} description={policy.summary} />
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{policy.title}</h1>
          <p className="mt-3 text-sm text-muted">{policy.summary}</p>

          <div className="mt-10 space-y-8">
            {policy.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-base font-semibold text-ink">{section.heading}</h2>
                <div className="mt-2 space-y-2">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
