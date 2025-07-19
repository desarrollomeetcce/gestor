'use client';

import { useActionState, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { loginAction } from '../../application/login';
import { useRouter } from 'next/navigation';
import { SUCCESS } from '@/utils/constants';

export default function LoginPage() {
    const [formState, formAction] = useActionState(loginAction, null);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (formState?.status === SUCCESS) {
            router.push('/home');
        }
    }, [formState]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 bg-moving-clouds" />
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="animate-pulse-particles absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl top-1/4 left-1/3" />
                <div className="animate-pulse-particles absolute w-56 h-56 bg-purple-500/10 rounded-full blur-2xl top-2/3 left-2/4" />
                <div className="animate-pulse-particles absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl top-1/3 left-2/5" />
            </div>
            {/* Tarjeta de login */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md bg-white/5 border border-white/15 text-white/90 p-8 sm:p-10 rounded-xl shadow-lg backdrop-blur-xl mx-4"
            >
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-white/90 tracking-wide">
                    Gestor
                </h1>

                <form action={formAction} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-200 mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm text-gray-200 mb-1">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-white hover:text-blue-300"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {formState?.status === 'error' && (
                        <p className="text-red-400 text-sm text-center">
                            {formState.message}
                            <span className="block opacity-60 text-xs">{formState.technicalMessage}</span>
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white border border-white/30 rounded-md hover:bg-white hover:text-black transition duration-200"

                    >
                        Iniciar sesión
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
