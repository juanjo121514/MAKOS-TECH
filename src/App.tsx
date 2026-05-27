import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { useAuthStore } from './store/auth';

const HomePage = lazy(() => import('./app/routes/home/HomePage'));
const ProductsPage = lazy(() => import('./app/routes/productos/ProductsPage'));
const ProductManagerPage = lazy(() => import('./app/routes/gestionar-productos/ProductManagerPage'));
const ProductDetailPage = lazy(() => import('./app/routes/producto/ProductDetailPage'));
const OffersPage = lazy(() => import('./app/routes/ofertas/OffersPage'));
const ContactPage = lazy(() => import('./app/routes/contacto/ContactPage'));
const NetworkPage = lazy(() => import('./app/routes/red-logistica/NetworkPage'));
const AuthPage = lazy(() => import('./app/routes/auth/AuthPage'));
const DashboardPage = lazy(() => import('./app/routes/dashboard/DashboardPage'));
const CompetitorsPage = lazy(() => import('./app/routes/dashboard/commercial/competitors/CompetitorsPage'));
const ProvidersPage = lazy(() => import('./app/routes/dashboard/commercial/providers/ProvidersPage'));
const PlansPublicPage = lazy(() => import('./app/routes/plans/PlansPage'));
const PlansAdminPage = lazy(() => import('./app/routes/dashboard/PlansAdminPage'));
const NotFoundPage = lazy(() => import('./app/not-found'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] animate-pulse" />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#060a0d] text-[#F5F5F5]">
        <Header onCartOpen={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Global cart shortcut */}
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] text-white shadow-lg shadow-[#00bcd4]/20 flex items-center justify-center hover:scale-110 transition-transform lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/gestionar-productos" element={<ProductManagerPage />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/ofertas" element={<OffersPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/red-logistica" element={<NetworkPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/commercial/competitors" element={<CompetitorsPage />} />
              <Route path="/dashboard/commercial/providers" element={<ProvidersPage />} />
              <Route path="/planes" element={<PlansPublicPage />} />
              <Route path="/dashboard/planes" element={<PlansAdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
