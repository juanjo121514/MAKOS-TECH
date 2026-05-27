import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const FOOTER_LINKS = {
  Productos: [
    { label: 'Laptops', to: '/productos?category=laptops' },
    { label: 'Smartphones', to: '/productos?category=smartphones' },
    { label: 'Gaming', to: '/productos?category=gaming' },
    { label: 'Audio', to: '/productos?category=audio' },
    { label: 'Monitores', to: '/productos?category=monitores' },
  ],
  Empresa: [
    { label: 'Sobre nosotros', to: '/contacto' },
    { label: 'Contacto', to: '/contacto' },
    { label: 'Ofertas', to: '/ofertas' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1e293b] bg-[#060a0d]">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold text-[#F5F5F5]">
                Makos<span className="text-[#00bcd4]">Tech</span>
              </span>
            </Link>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Tecnología premium para el mundo moderno. Productos originales con garantía y soporte excepcional.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#94a3b8] hover:text-[#00bcd4] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94a3b8]">
            &copy; {new Date().getFullYear()} MakosTech. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Ciudad de México, MX
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> +52 55 1234 5678
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
