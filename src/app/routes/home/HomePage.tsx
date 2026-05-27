import { HeroSection } from '../../../components/home/HeroSection';
import { BenefitsSection } from '../../../components/home/BenefitsSection';
import { CategoriesSection } from '../../../components/home/CategoriesSection';
import { FeaturedProducts } from '../../../components/home/FeaturedProducts';
import { TestimonialsSection } from '../../../components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TestimonialsSection />
    </main>
  );
}
