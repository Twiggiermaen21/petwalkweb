'use client';

import Link from "next/link";
import { User, Trophy, History, Image, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function NavBar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="text-xl font-bold">MojaApp</div>
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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profil">Mój profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/ustawienia">Ustawienia</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Wylogowano!")}>Wyloguj</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
