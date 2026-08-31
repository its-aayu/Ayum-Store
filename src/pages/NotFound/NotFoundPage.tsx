import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { buttonClasses } from '@/components/common/Button';
import { SeoHead } from '@/components/common/SeoHead';

export function NotFoundPage() {
  return (
    <>
      <SeoHead title="Page Not Found" description="The page you're looking for doesn't exist." noIndex />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-7xl font-semibold text-brand-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Looks like this page wandered off.</h1>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className={buttonClasses('primary', 'md')}>
            Back to AYUM
          </Link>
          <Link to="/shop" className={buttonClasses('outline', 'md')}>
            Explore Designs
          </Link>
        </div>
      </Container>
    </>
  );
}
