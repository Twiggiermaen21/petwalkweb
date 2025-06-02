'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuthStore } from '@/store/authStore';
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const { isLoading, singup, } = useAuthStore();
  const onSubmit = async (data) => {
    const result = await singup(data.username, data.email, data.password);
    if (!result.success) setError(result.error);
    else {
      setError(null);
      // Redirect or show success message
      router.push("/profil"); // Redirect to login page after successful registration
    }

  };

  return (
    <div className="max-w-md mx-auto mt-16 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Zarejestruj się</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("username")}
          placeholder="Nazwa użytkownika"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Hasło (min. 8 znaków)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}
