import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00bcd4]/5 rounded-full blur-[128px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-2">Página no encontrada</h2>
        <p className="text-[#94a3b8] mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary">
              <Home className="w-4 h-4 mr-2" /> Ir al inicio
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
