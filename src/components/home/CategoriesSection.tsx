import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Laptop, Smartphone, Gamepad2, Headphones, Cable, Monitor } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useAnimations';
import { CATEGORIES } from '../../constants';

const ICONS: Record<string, React.ElementType> = {
  Laptop, Smartphone, Gamepad2, Headphones, Cable, Monitor,
};

export function CategoriesSection() {
  const { ref, isVisible } = useIntersectionObserver(0.1);

  return (
    <section ref={ref} className="py-20 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
            Explora por <span className="gradient-text">categoría</span>
          </h2>
          <p className="mt-3 text-[#94a3b8] max-w-xl mx-auto">
            Encuentra exactamente lo que buscas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon] || Laptop;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={`/productos?category=${cat.slug}`}
                  className="card p-6 text-center group block"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#00bcd4]/10 to-[#0ea5a4]/10 flex items-center justify-center mb-4 group-hover:from-[#00bcd4]/20 group-hover:to-[#0ea5a4]/20 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-[#00bcd4]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#00bcd4] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#94a3b8] line-clamp-2">{cat.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
