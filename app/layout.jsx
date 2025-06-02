'use client';

// --- Importy globalne i zależności ---
import Cookies from 'js-cookie';
import '@/app/globals.css'; // MUSI być załadowany jako pierwszy – zawiera style globalne!
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import NavBar from "@/components/NavBar";

/**
 * Główny layout aplikacji klienckiej.
 * Sprawdza autoryzację użytkownika i warunkowo renderuje nawigację oraz główne treści.
 */
export default function RootLayout({ children }) {
  const router = useRouter();             // Hook do nawigacji
  const pathname = usePathname();         // Aktualna ścieżka URL

  const { authReady, checkAuth, user, token } = useAuthStore(); // Dane z autoryzacji
  const isSignedIn = !!user && !!token;   // Czy użytkownik jest zalogowany?

  /**
   * Po zamontowaniu komponentu – wywołaj `checkAuth`, aby sprawdzić status logowania (np. na podstawie cookies).
   */
  useEffect(() => {
    checkAuth(); // Sprawdzenie tokenu, danych usera itp.
  }, []);

  /**
   * Po zmianie stanu autoryzacji lub ścieżki:
   * - jeśli użytkownik NIE jest zalogowany i NIE jest na stronie logowania → przekieruj na `/`
   */
  useEffect(() => {
    if (!authReady) return;

    const inAuthScreen = pathname.startsWith('/auth'); // Czy jesteśmy na stronie logowania/rejestracji?
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace('/'); // Przekieruj niezalogowanego użytkownika do strony głównej
    }
  }, [authReady, user, token, pathname]);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen"> {/* Tło aplikacji */}
        {/* Pasek nawigacyjny – pokazuje różne elementy w zależności od zalogowania */}
        <NavBar isSignedIn={isSignedIn} />

        {/* Główna zawartość dzieci przekazana do layoutu */}
        <main>{children}</main>
      </body>
    </html>
  );
}
