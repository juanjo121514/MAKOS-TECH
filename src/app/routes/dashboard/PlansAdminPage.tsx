import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Button, Input } from '../../../components/ui';
import type { Plan } from '../../../types';

export default function PlansAdminPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', price: '', interval: 'monthly', features: '' });

  useEffect(() => { fetchPlans(); }, []);

  async function fetchPlans() {
    const { data } = await supabase.from('plans').select('*').order('created_at', { ascending: false });
    setPlans((data as Plan[]) || []);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: '', slug: '', price: '', interval: 'monthly', features: '' });
    setShowModal(true);
  }

  function openEdit(p: Plan) {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, price: String(p.price), interval: p.interval, features: (p.features || []).join('\n') });
    setShowModal(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      slug: form.slug,
      price: parseFloat(form.price || '0'),
      interval: form.interval as Plan['interval'],
      features: form.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
    };
    if (editing) {
      await supabase.from('plans').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('plans').insert(payload);
    }
    setShowModal(false);
    fetchPlans();
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminar plan?')) return;
    await supabase.from('plans').delete().eq('id', id);
    fetchPlans();
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">Planes (Admin)</h2>
            <p className="text-sm text-[#94a3b8]">Gestiona planes de suscripción</p>
          </div>
          <div>
            <Button onClick={openNew}><Plus className="w-4 h-4 mr-2"/>Nuevo</Button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Nombre</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Precio</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Intervalo</th>
                  <th className="text-right text-xs font-medium text-[#94a3b8] px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-b border-[#1e293b]/50 hover:bg-[#111827]/50">
                    <td className="px-5 py-3 text-sm text-[#F5F5F5]">{p.name}</td>
                    <td className="px-5 py-3 text-sm text-[#00bcd4]">${p.price?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-[#94a3b8]">{p.interval}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#00bcd4]"><Pencil className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#ef4444]"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-lg glass-strong rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#F5F5F5]">{editing ? 'Editar' : 'Nuevo'} plan</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#F5F5F5]"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3">
                <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <Input label="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <Input label="Intervalo (monthly|yearly)" value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} />
                <Input label="Características (una por línea)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
                  <Button onClick={handleSave} className="flex-1">Guardar</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
