'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuthStore } from '@/store/authStore';
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const { isLoading, singup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const result = await singup(data.username, data.email, data.password);
    if (!result.success) setError(result.error);
    else {
      setError(null);
      router.push("/profil");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700">Zarejestruj się</h1>
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center mb-4 animate-pulse">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("username", { required: true })}
            placeholder="Nazwa użytkownika"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm text-lg transition"
            autoComplete="username"
          />
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm text-lg transition"
            autoComplete="email"
          />
          <div className="relative">
            <input
              {...register("password", { required: true, minLength: 8 })}
              type={showPassword ? "text" : "password"}
              placeholder="Hasło (min. 8 znaków)"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm text-lg transition pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-xl bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6 gap-2">
          <span className="text-gray-500 text-sm">Masz już konto?</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-green-700 font-medium border border-gray-200 hover:bg-green-50 hover:text-green-900 transition shadow-sm"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft size={18} />
            Powrót do logowania
          </button>
        </div>
      </div>
    </div>
  );
}
