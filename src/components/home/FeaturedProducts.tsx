import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useAnimations';
import { useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../store/cart';
import { useWishlistStore } from '../../store/wishlist';
import { Badge, Skeleton } from '../ui';

export function FeaturedProducts() {
  const { ref, isVisible } = useIntersectionObserver(0.1);
  const { products, loading } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const featured = products.filter((p) => p.is_featured).slice(0, 6);

  return (
    <section ref={ref} className="py-20 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
              Productos <span className="gradient-text">destacados</span>
            </h2>
            <p className="mt-3 text-[#94a3b8]">Lo mejor de nuestra selección</p>
          </div>
          <Link
            to="/productos"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#00bcd4] hover:text-[#0ea5a4] transition-colors"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product, i) => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card overflow-hidden group"
                >
                  <div className="relative h-48 bg-[#111827] overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <Badge variant="danger" className="absolute top-3 left-3">
                        -{discount}%
                      </Badge>
                    )}
                    <button
                      onClick={() => toggleItem(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#0f1720]/80 backdrop-blur-sm transition-all hover:bg-[#0f1720]"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isInWishlist(product.id) ? 'text-[#ef4444] fill-[#ef4444]' : 'text-[#94a3b8]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-[#94a3b8] mb-1">{product.category?.name || 'Tecnología'}</p>
                    <Link to={`/producto/${product.id}`}>
                      <h3 className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#00bcd4] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-[#00bcd4]">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-[#94a3b8] line-through">
                          ${product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00bcd4]/10 text-[#00bcd4] text-sm font-medium hover:bg-[#00bcd4]/20 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al carrito
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#00bcd4] hover:text-[#0ea5a4] transition-colors"
          >
            Ver todos los productos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
