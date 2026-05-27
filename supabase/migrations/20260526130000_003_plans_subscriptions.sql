-- Migration: Plans and Subscriptions
-- Creates `plans` and `subscriptions` tables with RLS and seeds default plans

-- Plans
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  interval text NOT NULL DEFAULT 'monthly', -- 'monthly' | 'yearly'
  features text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are publicly readable"
  ON plans FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage plans"
  ON plans FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES plans(id) ON DELETE SET NULL,
  status text DEFAULT 'active', -- active | past_due | cancelled | trialing
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plans_slug ON plans(slug);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- Seed default plans
INSERT INTO plans (name, slug, price, interval, features, active) VALUES
('Plan Estándar', 'estandar', 19900, 'monthly', ARRAY['Catálogo básico','Soporte email','Carrito integrado'], true),
('Plan Premium', 'premium', 49900, 'monthly', ARRAY['Personalización visual','Dominio propio','Reportes predictivos'], true)
ON CONFLICT (slug) DO NOTHING;
