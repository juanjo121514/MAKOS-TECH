import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../../../../lib/supabase';
import { Button, Input } from '../../../../../components/ui';
import type { Competitor } from '../../../../../types';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Competitor | null>(null);
  const [form, setForm] = useState({ name: '', type: '', description: '' });

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    setLoading(true);
    const { data } = await supabase.from('competitors').select('*').order('created_at', { ascending: false });
    setCompetitors((data as Competitor[]) || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: '', type: '', description: '' });
    setShowModal(true);
  }

  function openEdit(c: Competitor) {
    setEditing(c);
    setForm({ name: c.name, type: c.type, description: c.description || '' });
    setShowModal(true);
  }

  async function handleSave() {
    const payload = { name: form.name, type: form.type, description: form.description };
    if (editing) {
      await supabase.from('competitors').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('competitors').insert(payload);
    }
    setShowModal(false);
    fetchList();
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminar competidor?')) return;
    await supabase.from('competitors').delete().eq('id', id);
    fetchList();
  }

  return (
    <main className="min-h-screen">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">Competidores</h2>
            <p className="text-sm text-[#94a3b8]">Listado y gestión de competidores</p>
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
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Tipo</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Descripción</th>
                  <th className="text-right text-xs font-medium text-[#94a3b8] px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-sm text-[#94a3b8]">Cargando competidores...</td>
                  </tr>
                )}
                {competitors.map((c) => (
                  <tr key={c.id} className="border-b border-[#1e293b]/50 hover:bg-[#111827]/50">
                    <td className="px-5 py-3 text-sm text-[#F5F5F5]">{c.name}</td>
                    <td className="px-5 py-3 text-sm text-[#94a3b8]">{c.type}</td>
                    <td className="px-5 py-3 text-sm text-[#94a3b8]">{c.description}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#00bcd4]"><Pencil className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#ef4444]"><Trash2 className="w-4 h-4"/></button>
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
                <h3 className="text-lg font-semibold text-[#F5F5F5]">{editing ? 'Editar' : 'Nuevo'} competidor</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#F5F5F5]"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3">
                <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                <Input label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
