"use client";

// Importujemy hooki do przechowywania stanu autoryzacji i ustawień językowych
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingStore";

// Importujemy teksty lokalizacyjne oraz domyślny obraz profilowy
import ProfileText from "@/assets/lang/Profile.text";
import noProfil from "@/assets/ImagesPetWalk/profil.jpg";

// Komponenty do wyświetlania obrazów i stylizowanych kart
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHeader() {
  // Pobieramy dane zalogowanego użytkownika
  const { user } = useAuthStore();

  // Pobieramy wybrany język aplikacji
  const { lang } = useSettingsStore();

  // Dobieramy odpowiedni zestaw tłumaczeń na podstawie języka (z fallbackiem na PL)
  const t = ProfileText[lang] || ProfileText.pl;

  // Jeśli użytkownik nie jest zalogowany, nie renderujemy nic
  if (!user) return null;

  // Funkcja pomocnicza: zamienia datę ISO (np. 2023-01-01) na format dd.mm.yyyy
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    // Karta z danymi użytkownika
    <Card className="flex items-center gap-6 p-6 shadow-lg rounded-2xl bg-white dark:bg-gray-900 w-full max-w-xl mx-auto mt-8">
      {/* Awatar użytkownika – zdjęcie lub inicjał */}
      <Avatar className="w-20 h-20">
        <AvatarImage
          src={user.profileImage || noProfil.src}
          alt={user.username || "Profile"}
        />
        <AvatarFallback>
          {user.username?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Dane użytkownika: nazwa, e-mail i data dołączenia */}
      <CardContent className="flex flex-col gap-1 px-0">
        <div className="text-xl font-bold">{user.username}</div>
        <div className="text-gray-500">{user.email}</div>
        <div className="text-sm text-gray-400">
          {t.Joined} {formatDate(user.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
