-- Comercial: Competitors, Providers, Potential Clients
-- Add new tables to store the commercial database described in the project document

-- Competitors
CREATE TABLE IF NOT EXISTS competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Competitors are publicly readable"
  ON competitors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage competitors"
  ON competitors FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Providers
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  service text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers are publicly readable"
  ON providers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage providers"
  ON providers FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Potential clients
CREATE TABLE IF NOT EXISTS potential_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commercial_name text NOT NULL,
  sector text DEFAULT '',
  status text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE potential_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Potential clients are publicly readable"
  ON potential_clients FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage potential clients"
  ON potential_clients FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed competitors (10)
INSERT INTO competitors (name, type) VALUES
('Shopify', 'SaaS Global - Tiendas independientes'),
('Mercado Libre', 'Marketplace masivo'),
('Tiendanube', 'SaaS LATAM - Tiendas independientes'),
('WooCommerce (WordPress)', 'Plugin Open Source'),
('Wix eCommerce', 'Website Builder genérico'),
('Jumpseller', 'SaaS E-commerce'),
('PrestaShop', 'Plataforma Open Source'),
('Magento (Adobe Commerce)', 'Plataforma Enterprise'),
('Squarespace', 'Website Builder'),
('Facebook / Instagram Shop', 'Social Commerce')
ON CONFLICT DO NOTHING;

-- Seed providers (20)
INSERT INTO providers (name, service) VALUES
('Amazon Web Services (AWS)', 'Infraestructura Cloud (Hosting)'),
('MongoDB Atlas', 'Base de datos NoSQL Cloud'),
('ePayco', 'Pasarela de pagos Colombia'),
('Wompi (Bancolombia)', 'Pasarela de pagos alternativa'),
('SendGrid', 'Servidor de correos transaccionales'),
('Twilio', 'Notificaciones SMS para pedidos'),
('Vercel', 'Despliegue de Frontend (React/Next)'),
('Cloudflare', 'Seguridad, DNS y CDN'),
('Namecheap', 'Registro de dominios'),
('Firebase', 'Notificaciones Push en tiempo real'),
('GitHub', 'Control de versiones del código'),
('Figma', 'Herramienta de diseño UI/UX'),
('Google Workspace', 'Correos corporativos administrativos'),
('Mensajeros Urbanos', 'API de Logística / Última milla'),
('Coordinadora', 'Envíos nacionales'),
('Slack', 'Comunicación interna del equipo'),
('Jira Software', 'Gestión de tareas y sprints'),
('Stripe', 'Pasarela de pagos (Plan expansión)'),
('Hostinger', 'Certificados SSL y dominios alternos'),
('Canva Pro', 'Material publicitario redes sociales')
ON CONFLICT DO NOTHING;

-- Seed potential clients (full list from project document)
INSERT INTO potential_clients (commercial_name, sector, status) VALUES
('Minimercado La 70', 'Abarrotes', 'Contacto Inicial'),
('Supermercado El Ahorro', 'Abarrotes', 'En negociación'),
('Súper Tienda Belén', 'Abarrotes', 'Contacto Inicial'),
('Víveres San Juan', 'Abarrotes', 'Interesado'),
('Mercados El Poblado', 'Abarrotes', 'Contacto Inicial'),
('Tienda La Esquina', 'Abarrotes', 'Interesado'),
('Supermercado Laureles', 'Abarrotes', 'En seguimiento'),
('Abastos Centrales', 'Abarrotes', 'Contacto Inicial'),
('Mercado Fresco SAS', 'Abarrotes', 'Interesado'),
('Tienda Mi Barrio', 'Abarrotes', 'En seguimiento'),
('Boutique Mia', 'Moda y Ropa', 'Interesado'),
('Ropa Moderna Medellín', 'Moda y Ropa', 'En negociación'),
('Jeans & Más', 'Moda y Ropa', 'Contacto Inicial'),
('Estilo Urbano', 'Moda y Ropa', 'Interesado'),
('Moda Íntima', 'Moda y Ropa', 'Contacto Inicial'),
('Zapatos El Paso', 'Calzado', 'En seguimiento'),
('Tenis Importados', 'Calzado', 'Interesado'),
('Bolsos y Accesorios', 'Accesorios', 'En seguimiento'),
('Deportes Total', 'Ropa Deportiva', 'Contacto Inicial'),
('Outlet Ropa', 'Moda y Ropa', 'Interesado'),
('Ferretería La 80', 'Ferretería', 'En negociación'),
('Materiales El Constructor', 'Ferretería', 'Interesado'),
('FerrePinturas', 'Ferretería', 'Contacto Inicial'),
('Tornillos y Más', 'Ferretería', 'Contacto Inicial'),
('Eléctricos Medellín', 'Material Eléctrico', 'Interesado'),
('Ferretería San Diego', 'Ferretería', 'En seguimiento'),
('FerreCentro', 'Ferretería', 'Contacto Inicial'),
('Herramientas Pro', 'Ferretería', 'Interesado'),
('Tubos y Conexiones', 'Ferretería', 'Contacto Inicial'),
('Pinturas El Color', 'Pinturas', 'En seguimiento'),
('Tech Store MDE', 'Tecnología', 'En negociación'),
('Celulares Monterrey', 'Tecnología', 'Interesado'),
('Accesorios Móviles', 'Tecnología', 'Contacto Inicial'),
('Computadores Centro', 'Informática', 'En seguimiento'),
('Mundo Gamer', 'Videojuegos', 'Interesado'),
('Zona Tech', 'Tecnología', 'Contacto Inicial'),
('Repuestos PC', 'Informática', 'Contacto Inicial'),
('Smart Home Accesorios', 'Domótica', 'Interesado'),
('Audio y Video Max', 'Tecnología', 'En seguimiento'),
('Reparaciones Celular', 'Servicios Tech', 'Contacto Inicial'),
('Panadería La Espiga', 'Alimentos', 'En negociación'),
('Dulces y Postres', 'Repostería', 'Interesado'),
('Carnicería Premium', 'Alimentos Frescos', 'Contacto Inicial'),
('Verduras Express', 'Alimentos Frescos', 'Interesado'),
('Quesos y Lácteos', 'Alimentos', 'En seguimiento'),
('Salsas Artesanales', 'Alimentos Empacados', 'Interesado'),
('Café Tostado Local', 'Bebidas', 'Contacto Inicial'),
('Snacks Saludables', 'Alimentos Empacados', 'Contacto Inicial'),
('Licorera 24/7', 'Licores', 'En seguimiento'),
('Helados Gourmet', 'Alimentos', 'Interesado'),
('Papelería Central', 'Papelería', 'En negociación'),
('Miscelánea La 33', 'Miscelánea', 'Contacto Inicial'),
('Útiles Escolares MDE', 'Papelería', 'Interesado'),
('Regalos y Detalles', 'Regalos', 'En seguimiento'),
('Librería Local', 'Librería', 'Contacto Inicial'),
('Arte y Manualidades', 'Papelería', 'Interesado'),
('Fotocopias Envigado', 'Servicios Impresión', 'Contacto Inicial'),
('Cacharrería Total', 'Miscelánea', 'En seguimiento'),
('Piñatería Fiesta', 'Artículos Fiesta', 'Interesado'),
('Empaques y Cajas', 'Insumos Comerciales', 'Contacto Inicial'),
('Cosméticos Bella', 'Belleza', 'En negociación'),
('Makeup Store MDE', 'Maquillaje', 'Interesado'),
('Barber Shop Insumos', 'Insumos Belleza', 'Contacto Inicial'),
('Perfumes Originales', 'Perfumería', 'Interesado'),
('Cuidado Capilar', 'Belleza', 'Contacto Inicial'),
('Spa en Casa', 'Bienestar', 'En seguimiento'),
('Nails Art Supplies', 'Insumos Uñas', 'Interesado'),
('Productos Naturales', 'Tienda Naturista', 'Contacto Inicial'),
('Suplementos Gym', 'Nutrición Deportiva', 'En seguimiento'),
('Accesorios Ciclismo', 'Deportes', 'Interesado')
ON CONFLICT DO NOTHING;
