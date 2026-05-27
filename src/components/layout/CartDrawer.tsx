import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Wallet, Shield } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { name: 'Visa', description: 'Tarjetas de crédito y débito', icon: CreditCard },
  { name: 'Mastercard', description: 'Pago seguro y rápido', icon: CreditCard },
  { name: 'PayPal', description: 'Pago en línea fácil y confiable', icon: Wallet },
  { name: 'Mercado Pago', description: 'Método popular en Latinoamérica', icon: Shield },
  { name: 'Oxxo', description: 'Pago en efectivo en tienda', icon: Shield },
];

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, subtotal, tax, total } = useCartStore();
  const { user } = useAuthStore();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].name);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  async function handleConfirmPayment() {
    if (!user) {
      setCheckoutMessage('Debes iniciar sesión para completar la compra.');
      return;
    }

    if (items.length === 0) {
      setCheckoutMessage('Agrega productos al carrito antes de pagar.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutMessage('');

    const orderPayload = {
      user_id: user.id,
      total: total(),
      status: 'paid',
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select('*')
      .single();

    if (orderError || !orderData) {
      setCheckoutMessage('No se pudo crear la orden. Intenta de nuevo.');
      setCheckoutLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setCheckoutMessage('Error al guardar los productos de la orden.');
      setCheckoutLoading(false);
      return;
    }

    setCheckoutMessage(`Compra realizada con ${selectedMethod}. Orden #${orderData.id.slice(0, 8)} generada.`);
    setCheckoutLoading(false);
    setShowPaymentOptions(false);
    clearCart();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-strong flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#00bcd4]" />
                <h2 className="text-lg font-semibold text-[#F5F5F5]">Carrito</h2>
                <span className="badge-primary badge">{items.length}</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#111827] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-[#111827] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-[#94a3b8]" />
                </div>
                <p className="text-[#94a3b8] text-sm">Tu carrito está vacío</p>
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Explorar productos
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-3 rounded-xl bg-[#111827]/50 border border-[#1e293b]"
                    >
                      <div className="w-16 h-16 rounded-lg bg-[#1e293b] flex-shrink-0 overflow-hidden">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#F5F5F5] truncate">{item.product.name}</h3>
                        <p className="text-sm text-[#00bcd4] font-semibold mt-1">
                          ${item.product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded bg-[#1e293b] text-[#94a3b8] hover:text-[#F5F5F5] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium text-[#F5F5F5] w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded bg-[#1e293b] text-[#94a3b8] hover:text-[#F5F5F5] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 self-start rounded text-[#94a3b8] hover:text-[#ef4444] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-[#1e293b] space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a3b8]">Subtotal</span>
                    <span className="text-[#F5F5F5]">${subtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a3b8]">IVA (16%)</span>
                    <span className="text-[#F5F5F5]">${tax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-3 border-t border-[#1e293b]">
                    <span className="text-[#F5F5F5]">Total</span>
                    <span className="text-[#00bcd4]">${total().toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" size="sm" onClick={clearCart} className="flex-1">
                      Vaciar
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => setShowPaymentOptions(true)}>
                      Pagar
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {showPaymentOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute inset-0 z-50 bg-[#02050a]/95 p-6 overflow-y-auto"
                    >
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-xl font-semibold text-[#F5F5F5]">Selecciona tu forma de pago</h3>
                          <p className="text-sm text-[#94a3b8] mt-2">Elige uno de los métodos más usados para finalizar tu compra.</p>
                        </div>
                        <button
                          onClick={() => setShowPaymentOptions(false)}
                          className="p-2 rounded-lg text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#111827] transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon;
                          return (
                            <button
                              key={method.name}
                              type="button"
                              onClick={() => setSelectedMethod(method.name)}
                              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                selectedMethod === method.name
                                  ? 'border-[#00bcd4] bg-[#0f1720]'
                                  : 'border-[#1e293b] bg-[#111827] hover:border-[#00bcd4]'
                              }`}
                            >
                              <div className="w-12 h-12 rounded-2xl bg-[#0f1720] flex items-center justify-center text-[#00bcd4]">
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#F5F5F5]">{method.name}</p>
                                <p className="text-xs text-[#94a3b8]">{method.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={handleConfirmPayment}
                          loading={checkoutLoading}
                        >
                          Confirmar método de pago
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShowPaymentOptions(false)}>
                          Cancelar
                        </Button>
                      </div>

                      {checkoutMessage && (
                        <div className="mt-4 rounded-2xl border border-[#00bcd4] bg-[#0f1720] p-4 text-sm text-[#F5F5F5]">
                          {checkoutMessage}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
