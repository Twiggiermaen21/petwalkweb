'use client';

import Link from "next/link";
import { User, Trophy, History, Image, Settings } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-center">
      <div className="text-xl font-bold pr-12">MojaApp</div>
      <div className="flex flex-row items-center gap-6">
        <Link href="/profil" className="flex items-center gap-2 hover:text-blue-600 transition">
          <User size={18} /> Profil
        </Link>
        <Link href="/liga" className="flex items-center gap-2 hover:text-blue-600 transition">
          <Trophy size={18} /> Liga
        </Link>
        <Link href="/historia" className="flex items-center gap-2 hover:text-blue-600 transition">
          <History size={18} /> Historia
        </Link>
        <Link href="/galeria" className="flex items-center gap-2 hover:text-blue-600 transition">
          <Image size={18} /> Galeria
        </Link>
        <Link href="/ustawienia" className="flex items-center gap-2 hover:text-blue-600 transition">
          <Settings size={18} /> Ustawienia
        </Link>
      </div>

    </nav>
  );
}
