'use client';

import Image from "next/image";
import DogForest from "@/assets/images/DogFOREST.png"; // lokalny import obrazka

/**
 * Strona główna aplikacji PetWalk.
 * Pokazuje logo, slogan i obraz psa z lokalnego pliku.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-yellow-50">
      {/* Karta główna */}
      <div className="bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full gap-6">

        {/* Obraz psa (lokalny plik) */}
        <Image
          src={DogForest}
          alt="Pies"
          width={208}
          height={208}
          className="rounded-full object-cover shadow-lg border-4 border-cyan-100"
        />

        {/* Tytuł */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-800 tracking-wide text-center">
          PetWalk
        </h1>

        {/* Slogan */}
        <p className="text-lg text-gray-500 text-center font-medium">
          Twój najlepszy asystent do opieki nad psem.<br />Śledź spacery, zdrowie i dobre chwile!
        </p>
      </div>
    </div>
  );
}
