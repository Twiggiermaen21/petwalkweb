"use client";

import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingStore";
import ProfileText from "@/assets/lang/Profile.text";
import noProfil from "@/assets/ImagesPetWalk/profil.jpg";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  const { lang } = useSettingsStore();
  const t = ProfileText[lang] || ProfileText.pl;

  if (!user) return null;

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Card className="flex items-center gap-6 p-6 shadow-lg rounded-2xl bg-white dark:bg-gray-900 w-full max-w-xl mx-auto mt-8">
      <Avatar className="w-20 h-20">
        <AvatarImage
          src={user.profileImage || noProfil.src}
          alt={user.username || "Profile"}
        />
        <AvatarFallback>
          {user.username?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
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
