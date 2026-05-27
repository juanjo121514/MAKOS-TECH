import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import type { Plan } from '../../../types';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  async function fetchPlans() {
    setLoading(true);
    try {
      const { data } = await supabase.from('plans').select('*').order('price', { ascending: true });
      setPlans((data as Plan[]) || []);
    } catch (err) {
      console.warn('Error fetching plans (table may not exist yet)', err);
      setPlans([]);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Planes</h1>
        <p className="text-sm text-[#94a3b8] mb-6">Elige el plan que mejor se ajuste a tu negocio.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.length === 0 && !loading ? (
            <div className="card p-6 col-span-3 text-center text-[#94a3b8]">No hay planes configurados aún.</div>
          ) : (
            plans.map((p) => (
              <div key={p.id} className="card p-6">
                <h3 className="text-xl font-semibold text-[#F5F5F5]">{p.name}</h3>
                <p className="text-sm text-[#94a3b8]">{p.interval === 'monthly' ? 'Mensual' : 'Anual'}</p>
                <p className="text-2xl font-bold text-[#00bcd4] my-4">${p.price.toLocaleString()}</p>
                <div className="mb-4">
                  {p.features?.map((f: string, i: number) => (
                    <p key={i} className="text-sm text-[#94a3b8]">• {f}</p>
                  ))}
                </div>
                <Button onClick={() => alert('Integrar flujo de pago para este plan')}>Suscribirse</Button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
