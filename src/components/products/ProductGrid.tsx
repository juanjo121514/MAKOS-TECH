import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error?: string | null;
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <Skeleton className="h-52 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#111827] flex items-center justify-center mb-6">
          <PackageSearch className="w-10 h-10 text-[#ef4444]" />
        </div>
        <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">No se pudieron cargar los productos</h3>
        <p className="text-sm text-[#94a3b8] max-w-xl">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-[#111827] flex items-center justify-center mb-6">
          <PackageSearch className="w-10 h-10 text-[#94a3b8]" />
        </div>
        <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">No se encontraron productos</h3>
        <p className="text-sm text-[#94a3b8]">Intenta con otros filtros o búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
