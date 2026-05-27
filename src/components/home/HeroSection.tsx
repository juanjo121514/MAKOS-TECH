import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00bcd4]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5a4]/5 rounded-full blur-[128px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/20 to-transparent" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#00bcd4 1px, transparent 1px), linear-gradient(90deg, #00bcd4 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="section-container relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00bcd4]/10 border border-[#00bcd4]/20 mb-8">
              <Sparkles className="w-4 h-4 text-[#00bcd4]" />
              <span className="text-sm font-medium text-[#00bcd4]">Nueva colección 2025</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            <span className="text-[#F5F5F5]">Tecnología que</span>
            <br />
            <span className="gradient-text">transforma el futuro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed"
          >
            Descubre productos premium de última generación. Experiencia de compra
            excepcional con garantía extendida y envío gratis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/productos">
              <Button size="lg">
                Explorar productos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/ofertas">
              <Button variant="secondary" size="lg">
                Ver ofertas
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '10K+', label: 'Clientes felices' },
              { value: '500+', label: 'Productos' },
              { value: '24h', label: 'Envío express' },
              { value: '99%', label: 'Satisfacción' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="mt-1 text-sm text-[#94a3b8]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060a0d] to-transparent" />
    </section>
  );
}
