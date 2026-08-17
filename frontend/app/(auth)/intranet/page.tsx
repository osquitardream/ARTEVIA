'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function IntranetLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setAuth(response.user, response.token);
      toast.success(`Bienvenido/a, ${response.user.name || response.user.email}`);
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Credenciales inválidas');
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950 bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&auto=format&fit=crop&q=80")',
      }}
    >
      {/* Dark luxury overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-in fade-in zoom-in-95 duration-300">
        {/* Header with New Official Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="group mb-2">
            <BrandLogo variant="dark" size="lg" />
          </Link>
          <span className="text-[10px] tracking-[0.28em] uppercase font-bold text-[#c89b5c] mt-2 font-sans">
            PANEL INTERNO
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-slate-600 uppercase mb-2">
              Correo Electrónico
            </label>
            <Input
              type="email"
              placeholder="ejemplo@artevia.pe"
              {...register('email')}
              className="bg-slate-50/80 border-slate-200 text-slate-900 rounded-lg h-12 px-4 focus:bg-white focus:border-[#c89b5c] transition-all text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-slate-600 uppercase mb-2">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="bg-slate-50/80 border-slate-200 text-slate-900 rounded-lg h-12 px-4 focus:bg-white focus:border-[#c89b5c] transition-all text-sm"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#c89b5c] hover:bg-[#b58a4b] text-white font-semibold tracking-[0.15em] text-xs uppercase h-12 rounded-lg transition-all shadow-md hover:shadow-lg mt-2"
          >
            {isSubmitting ? 'Verificando...' : 'Ingresar'}
          </Button>
        </form>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-[#c89b5c] transition-colors inline-flex items-center gap-1.5 font-light"
          >
            &larr; Volver a la web pública
          </Link>
        </div>
      </div>
    </div>
  );
}
