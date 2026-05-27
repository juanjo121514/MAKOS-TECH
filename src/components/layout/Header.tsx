import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/gestionar-productos', label: 'Gestionar' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/red-logistica', label: 'Red' },
  { to: '/contacto', label: 'Contacto' },
];

interface HeaderProps {
  onCartOpen: () => void;
}

export function Header({ onCartOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, isAdmin, signOut } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold text-[#F5F5F5] group-hover:text-[#00bcd4] transition-colors">
                Makos<span className="text-[#00bcd4]">Tech</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-[#00bcd4] bg-[#00bcd4]/10'
                      : 'text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#111827]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/productos"
                className="hidden sm:flex p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                to="/productos?wishlist=true"
                className="hidden sm:flex p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <button
                onClick={onCartOpen}
                className="relative p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#00bcd4] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 glass-strong rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-[#1e293b]">
                          <p className="text-sm font-medium text-[#F5F5F5]">{user.full_name || 'Usuario'}</p>
                          <p className="text-xs text-[#94a3b8]">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {isAdmin && (
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#111827] transition-all w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all"
                >
                  <User className="w-4 h-4" />
                  Ingresar
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-[#94a3b8] hover:text-[#F5F5F5] transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong"
            >
              <div className="p-6 pt-20 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.to
                        ? 'text-[#00bcd4] bg-[#00bcd4]/10'
                        : 'text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#111827]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    to="/auth"
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-[#00bcd4] hover:bg-[#00bcd4]/10 transition-all"
                  >
                    Ingresar
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
