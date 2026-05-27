import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Truck, Shield, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { useProduct } from '../../../hooks/useProducts';
import { useCartStore } from '../../../store/cart';
import { useWishlistStore } from '../../../store/wishlist';
import { Button, Badge, Skeleton } from '../../../components/ui';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading } = useProduct(id || '');
  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">Producto no encontrado</h2>
          <Link to="/productos" className="text-[#00bcd4] hover:underline">Volver a productos</Link>
        </div>
      </main>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const images = [product.image_url, ...product.gallery].filter(Boolean);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#00bcd4] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a productos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card overflow-hidden h-80 sm:h-96 lg:h-[480px] bg-[#111827] mb-4">
              <img
                src={images[selectedImage] || product.image_url}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#00bcd4]' : 'border-[#1e293b] hover:border-[#00bcd4]/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-[#94a3b8] mb-2">{product.category?.name || 'Tecnología'}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#00bcd4]">
                ${product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg text-[#94a3b8] line-through">
                    ${product.original_price.toLocaleString()}
                  </span>
                  <Badge variant="danger">-{discount}% OFF</Badge>
                </>
              )}
            </div>

            <p className="text-[#94a3b8] leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1e293b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#00bcd4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Envío gratis</p>
                  <p className="text-xs text-[#94a3b8]">24-48 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#22c55e]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Garantía</p>
                  <p className="text-xs text-[#94a3b8]">{product.warranty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-[#00bcd4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Devoluciones</p>
                  <p className="text-xs text-[#94a3b8]">30 días</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${product.stock > 0 ? 'bg-[#22c55e]/10' : 'bg-[#ef4444]/10'}`}>
                  <Check className={`w-5 h-5 ${product.stock > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Stock</p>
                  <p className="text-xs text-[#94a3b8]">{product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#111827] rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-md text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#1e293b] transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium text-[#F5F5F5]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 rounded-md text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#1e293b] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => { for (let i = 0; i < quantity; i++) addItem(product); }}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
              </Button>

              <button
                onClick={() => toggleItem(product.id)}
                className={`p-3 rounded-lg border transition-all ${
                  isInWishlist(product.id)
                    ? 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]'
                    : 'border-[#1e293b] text-[#94a3b8] hover:border-[#ef4444]/30 hover:text-[#ef4444]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
