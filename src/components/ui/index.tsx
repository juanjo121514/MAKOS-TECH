import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
};

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#060a0d] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-[#00bcd4] to-[#0ea5a4] text-white hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] hover:-translate-y-0.5 focus:ring-[#00bcd4]',
    secondary: 'border border-[#1e293b] text-[#F5F5F5] hover:border-[#00bcd4] hover:text-[#00bcd4] focus:ring-[#00bcd4]',
    ghost: 'text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827] focus:ring-[#00bcd4]',
    danger: 'bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 focus:ring-[#ef4444]',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-[#94a3b8]">{label}</label>}
      <input
        className={`input-field ${error ? 'border-[#ef4444]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-[#94a3b8]">{label}</label>}
      <textarea
        className={`input-field resize-none ${error ? 'border-[#ef4444]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#1e293b]/50 ${className}`} />
  );
}

export function Badge({ children, variant = 'primary', className = '' }: { children: React.ReactNode; variant?: 'primary' | 'danger' | 'success'; className?: string }) {
  const variants: Record<string, string> = {
    primary: 'badge-primary',
    danger: 'badge-danger',
    success: 'badge-success',
  };
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>;
}

export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
        type === 'success' ? 'bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e]' : 'bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#ef4444]'
      }`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">&times;</button>
    </motion.div>
  );
}
