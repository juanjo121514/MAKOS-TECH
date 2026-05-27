import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cart';
import { useWishlistStore } from '../../store/wishlist';
import { Badge } from '../ui';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card overflow-hidden group"
    >
      <div className="relative h-52 bg-[#111827] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <Badge variant="danger" className="absolute top-3 left-3">
            -{discount}% OFF
          </Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="success" className="absolute top-3 right-12">
            Últimas {product.stock}
          </Badge>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleItem(product.id); }}
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
          <h3 className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#00bcd4] transition-colors line-clamp-2 min-h-[2.5rem]">
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
}
