import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../store/auth';
import { Button, Input } from '../../../components/ui';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
      else navigate('/');
    } else {
      if (!fullName.trim()) {
        setError('El nombre es requerido');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, fullName);
      if (err) setError(err);
      else navigate('/');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16 pb-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00bcd4]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#0ea5a4]/5 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#00bcd4] to-[#0ea5a4] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            {isLogin ? 'Ingresa a tu cuenta MakosTech' : 'Regístrate en MakosTech'}
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[#94a3b8] hover:text-[#F5F5F5] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 text-sm text-[#ef4444]">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#94a3b8]">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[#00bcd4] hover:underline font-medium"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
