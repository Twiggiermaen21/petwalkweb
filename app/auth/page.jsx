'use client';

// --- Importy hooków, komponentów i ikon ---
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuthStore } from '@/store/authStore';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";

/**
 * Komponent logowania użytkownika.
 * Pozwala na wpisanie e-maila i hasła oraz wykonuje akcję logowania przez store.
 */
export default function LoginPage() {
    const { register, handleSubmit } = useForm(); // Obsługa formularza
    const [error, setError] = useState(null); // Błąd logowania
    const { isLoading, login } = useAuthStore(); // Store logowania
    const router = useRouter(); // Nawigacja
    const [showPassword, setShowPassword] = useState(false); // Toggle widoczności hasła

    /**
     * Obsługuje przesłanie formularza logowania.
     * Przekazuje dane do store, ustawia błędy lub przekierowuje po sukcesie.
     */
    const onSubmit = async (data) => {
        const result = await login(data.email, data.password);
        if (!result.success) {
            setError(result.error); // Wyświetlenie błędu logowania
        } else {
            setError(null); // Wyczyść błąd
            router.push("/profil"); // Przejście do profilu
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
            <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-gray-100">

                {/* Nagłówek strony */}
                <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Zaloguj się</h1>

                {/* Komunikat błędu (jeśli jest) */}
                {error && (
                    <p className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center mb-4 animate-pulse">
                        {error}
                    </p>
                )}

                {/* Formularz logowania */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Email */}
                    <input
                        {...register("email", { required: true })}
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm text-lg transition"
                        autoComplete="email"
                    />

                    {/* Hasło + toggle widoczności */}
                    <div className="relative">
                        <input
                            {...register("password", { required: true })}
                            type={showPassword ? "text" : "password"}
                            placeholder="Hasło"
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm text-lg transition pr-12"
                            autoComplete="current-password"
                        />
                        {/* Przycisk pokaż/ukryj hasło */}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
                            tabIndex={-1}
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </button>
                    </div>

                    {/* Przycisk logowania */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-3 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} />
                        {isLoading ? "Logowanie..." : "Zaloguj się"}
                    </button>
                </form>

                {/* Link do rejestracji */}
                <div className="flex flex-col items-center mt-6 gap-2">
                    <span className="text-gray-500 text-sm">Nie masz konta?</span>
                    <Link href="/auth/register" className="w-full">
                        <Button variant="outline" className="w-full">
                            Zarejestruj się
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
