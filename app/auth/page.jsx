'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuthStore } from '@/store/authStore';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState(null);
    const { isLoading, login } = useAuthStore();
    const router = useRouter();
    const onSubmit = async (data) => {

        const result = await login(data.email, data.password);
        if (!result.success) setError(result.error);
        else {
            setError(null);
            router.push("/tabs");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Zaloguj się</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                <input
                    {...register("password")}
                    type="password"
                    placeholder="Hasło"
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Zaloguj się
                </button>
            </form>


            <Link href="/auth/register">
                <Button variant="outline">Register</Button>

            </Link>
        </div>
    );
}
