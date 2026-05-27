import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../../hooks/useProducts';
import { useDebounce } from '../../../hooks/useAnimations';
import { useWishlistStore } from '../../../store/wishlist';
import { ProductGrid } from '../../../components/products/ProductGrid';
import { SearchBar } from '../../../components/products/SearchBar';
import { CategoryFilter } from '../../../components/products/CategoryFilter';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const wishlistMode = searchParams.get('wishlist') === 'true';
  const wishlistIds = useWishlistStore((s) => s.items);
  const debouncedSearch = useDebounce(search, 300);

  const { products, loading, error } = useProducts({
    search: debouncedSearch || undefined,
    category: category || undefined,
    wishlistIds: wishlistMode ? wishlistIds : undefined,
  });

  const filteredProducts = useMemo(() => {
    let result = products;
    if (category) {
      result = result.filter((p) => p.category?.slug === category);
    }
    return result;
  }, [products, category]);

  const handleCategoryChange = (slug: string) => {
    setCategory(slug);
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    if (wishlistMode) params.set('wishlist', 'true');
    setSearchParams(params);
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
            {wishlistMode ? 'Mis favoritos' : 'Nuestros'} <span className="gradient-text">productos</span>
          </h1>
          <p className="mt-2 text-[#94a3b8]">
            {wishlistMode
              ? 'Revisa los productos que guardaste en tu lista de deseos.'
              : 'Explora nuestra selección de tecnología premium.'}
          </p>
        </motion.div>

        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
              <SlidersHorizontal className="w-4 h-4" />
              {filteredProducts.length} productos
            </div>
          </div>

          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>

        <ProductGrid products={filteredProducts} loading={loading} error={error} />
      </div>
    </main>
  );
}
