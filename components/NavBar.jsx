'use client';

// --- Importy komponentów i ikon ---
import Link from "next/link";
import { User, Trophy, History, Image, Settings } from "lucide-react";

/**
 * Pasek nawigacyjny główny aplikacji.
 * Wyświetla dynamicznie różne opcje w zależności od tego, czy użytkownik jest zalogowany.
 * Zawiera linki do głównych ekranów aplikacji oraz przycisk logowania.
 */
export default function NavBar({ isSignedIn }) {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-center">

      {/* Logo aplikacji - prowadzi na stronę główną */}
      <Link href="/" className="font-bold text-lg">
        <div className="text-xl font-bold pr-12">PetWalk</div>
      </Link>

      {/* Widok dla zalogowanego użytkownika */}
      {isSignedIn && (
        <div className="flex flex-row items-center gap-6">
          {/* Link: Profil */}
          <Link href="/profil" className="flex items-center gap-2 hover:text-blue-600 transition">
            <User size={18} /> Profil
          </Link>

          {/* Link: Liga */}
          <Link href="/liga" className="flex items-center gap-2 hover:text-blue-600 transition">
            <Trophy size={18} /> Liga
          </Link>

          {/* Link: Historia spacerów */}
          <Link href="/historia" className="flex items-center gap-2 hover:text-blue-600 transition">
            <History size={18} /> Historia
          </Link>

          {/* Link: Galeria zdjęć */}
          <Link href="/galeria" className="flex items-center gap-2 hover:text-blue-600 transition">
            <Image size={18} /> Galeria
          </Link>

          {/* Link: Ustawienia */}
          <Link href="/ustawienia" className="flex items-center gap-2 hover:text-blue-600 transition">
            <Settings size={18} /> Ustawienia
          </Link>
        </div>
      )}

      {/* Widok dla niezalogowanego użytkownika */}
      {!isSignedIn && (
        <Link
          href="/auth"
          className="ml-auto px-4 py-2 rounded bg-blue-500 text-white"
        >
          Zaloguj się
        </Link>
      )}
    </nav>
  );
}
