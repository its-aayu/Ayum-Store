import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { SeoHead } from '@/components/common/SeoHead';
import { products } from '@/data/products';
import { categories, getCategoryBySlug } from '@/data/categories';
import { cn } from '@/utils/cn';
import { track } from '@/services/analytics/track';

export function ShopPage() {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const activeCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const visibleProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category === activeCategory.id);
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory) track({ name: 'category_view', category: activeCategory.id });
  }, [activeCategory]);

  return (
    <>
      <SeoHead
        title={activeCategory ? activeCategory.label : 'Shop'}
        description={
          activeCategory
            ? `${activeCategory.description} Shop AYUM ${activeCategory.label.toLowerCase()}.`
            : 'Browse the full AYUM catalog — original streetwear designed for everyday wear.'
        }
      />
      <Container className="py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">{activeCategory ? activeCategory.label : 'Shop'}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {activeCategory ? activeCategory.description : 'Original AYUM designs, made for everyday wear.'}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          <Link
            to="/shop"
            role="tab"
            aria-selected={!activeCategory}
            className={cn(
              'rounded-pill border px-4 py-2 text-sm font-medium',
              !activeCategory ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink hover:border-ink/40',
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.slug}`}
              role="tab"
              aria-selected={activeCategory?.id === cat.id}
              className={cn(
                'rounded-pill border px-4 py-2 text-sm font-medium',
                activeCategory?.id === cat.id
                  ? 'border-ink bg-ink text-white'
                  : 'border-ink/20 text-ink hover:border-ink/40',
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-muted">No products in this category yet.</p>
        )}
      </Container>
    </>
  );
}
