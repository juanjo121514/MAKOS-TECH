import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Button, Input, Textarea } from '../../../components/ui';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    if (!form.email.trim()) errs.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Correo inválido';
    if (!form.message.trim()) errs.message = 'El mensaje es requerido';
    else if (form.message.trim().length < 10) errs.message = 'Mínimo 10 caracteres';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });

    setLoading(false);
    if (!error) {
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5]">
            Contáctanos
          </h1>
          <p className="mt-2 text-[#94a3b8]">
            Estamos aquí para ayudarte. Envíanos un mensaje.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {sent ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#22c55e]/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-[#22c55e]" />
                </div>
                <h3 className="text-xl font-semibold text-[#F5F5F5] mb-2">Mensaje enviado</h3>
                <p className="text-[#94a3b8] mb-6">Te responderemos lo antes posible.</p>
                <Button variant="secondary" onClick={() => setSent(false)}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                />
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />
                <Textarea
                  label="Mensaje"
                  placeholder="Escribe tu mensaje..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  error={errors.message}
                />
                <Button type="submit" loading={loading} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar mensaje
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-[#F5F5F5]">Información</h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#00bcd4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Correo</p>
                  <p className="text-sm text-[#94a3b8]">contacto@makostech.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#00bcd4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Teléfono</p>
                  <p className="text-sm text-[#94a3b8]">+52 55 1234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#00bcd4]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Dirección</p>
                  <p className="text-sm text-[#94a3b8]">Av. Reforma 500, CDMX</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Horario</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Lunes - Viernes</span>
                  <span className="text-[#F5F5F5]">9:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Sábado</span>
                  <span className="text-[#F5F5F5]">10:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Domingo</span>
                  <span className="text-[#F5F5F5]">Cerrado</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
