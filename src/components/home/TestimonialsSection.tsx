import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useAnimations';
import { TESTIMONIALS } from '../../constants';

export function TestimonialsSection() {
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
            Lo que dicen nuestros <span className="gradient-text">clientes</span>
          </h2>
          <p className="mt-3 text-[#94a3b8] max-w-xl mx-auto">
            Miles de clientes satisfechos nos respaldan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < testimonial.rating ? 'text-[#00bcd4] fill-[#00bcd4]' : 'text-[#1e293b]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">{testimonial.name}</p>
                  <p className="text-xs text-[#94a3b8]">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
