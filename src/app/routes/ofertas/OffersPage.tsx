import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';
import { useProducts } from '../../../hooks/useProducts';
import { useDebounce, useCountdown } from '../../../hooks/useAnimations';
import { ProductGrid } from '../../../components/products/ProductGrid';
import { SearchBar } from '../../../components/products/SearchBar';

export default function OffersPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { products, loading } = useProducts({ offersOnly: true, search: debouncedSearch || undefined });

  const offerProducts = useMemo(
    () => products.filter((p) => p.original_price && p.original_price > p.price),
    [products]
  );

  const countdown = useCountdown(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#ef4444]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
              Ofertas <span className="text-[#ef4444]">especiales</span>
            </h1>
          </div>
          <p className="text-[#94a3b8]">
            Las mejores ofertas en tecnología premium. ¡No te las pierdas!
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#ef4444]" />
            <span className="text-sm font-medium text-[#F5F5F5]">Las ofertas terminan en:</span>
          </div>
          <div className="flex items-center gap-3">
            {[
              { value: countdown.days, label: 'Días' },
              { value: countdown.hours, label: 'Horas' },
              { value: countdown.minutes, label: 'Min' },
              { value: countdown.seconds, label: 'Seg' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-14 h-14 rounded-lg bg-[#111827] border border-[#1e293b] flex items-center justify-center">
                  <span className="text-xl font-bold text-[#F5F5F5]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] text-[#94a3b8] mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mb-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar ofertas..." />
        </div>

        <ProductGrid products={offerProducts} loading={loading} />
      </div>
    </main>
  );
}
