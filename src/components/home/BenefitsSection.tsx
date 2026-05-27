import { motion } from 'framer-motion';
import { Truck, Shield, BadgeCheck, Headset, Lock } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useAnimations';
import { BENEFITS } from '../../constants';

const ICONS: Record<string, React.ElementType> = {
  Truck, Shield, BadgeCheck, Headset, Lock,
};

export function BenefitsSection() {
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
            Por qué elegir <span className="gradient-text">MakosTech</span>
          </h2>
          <p className="mt-3 text-[#94a3b8] max-w-xl mx-auto">
            Experiencia premium en cada paso de tu compra
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {BENEFITS.map((benefit, i) => {
            const Icon = ICONS[benefit.icon] || Shield;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#00bcd4]/10 flex items-center justify-center mb-4 group-hover:bg-[#00bcd4]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#00bcd4]" />
                </div>
                <h3 className="text-sm font-semibold text-[#F5F5F5] mb-2">{benefit.title}</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
