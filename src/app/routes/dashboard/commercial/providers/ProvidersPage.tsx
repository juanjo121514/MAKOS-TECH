import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../../../../lib/supabase';
import { Button, Input } from '../../../../../components/ui';
import type { Provider } from '../../../../../types';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [form, setForm] = useState({ name: '', service: '', notes: '' });

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    setLoading(true);
    const { data } = await supabase.from('providers').select('*').order('created_at', { ascending: false });
    setProviders((data as Provider[]) || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: '', service: '', notes: '' });
    setShowModal(true);
  }

  function openEdit(p: Provider) {
    setEditing(p);
    setForm({ name: p.name, service: p.service, notes: p.notes || '' });
    setShowModal(true);
  }

  async function handleSave() {
    const payload = { name: form.name, service: form.service, notes: form.notes };
    if (editing) {
      await supabase.from('providers').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('providers').insert(payload);
    }
    setShowModal(false);
    fetchList();
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminar proveedor?')) return;
    await supabase.from('providers').delete().eq('id', id);
    fetchList();
  }

  return (
    <main className="min-h-screen">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">Proveedores</h2>
            <p className="text-sm text-[#94a3b8]">Listado y gestión de proveedores</p>
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
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Servicio</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Notas</th>
                  <th className="text-right text-xs font-medium text-[#94a3b8] px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-sm text-[#94a3b8]">Cargando proveedores...</td>
                  </tr>
                )}
                {providers.map((p) => (
                  <tr key={p.id} className="border-b border-[#1e293b]/50 hover:bg-[#111827]/50">
                    <td className="px-5 py-3 text-sm text-[#F5F5F5]">{p.name}</td>
                    <td className="px-5 py-3 text-sm text-[#94a3b8]">{p.service}</td>
                    <td className="px-5 py-3 text-sm text-[#94a3b8]">{p.notes}</td>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg glass-strong rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#F5F5F5]">{editing ? 'Editar' : 'Nuevo'} proveedor</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#F5F5F5]"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3">
                <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Servicio" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
                <Input label="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
                  <Button onClick={handleSave} className="flex-1">Guardar</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
