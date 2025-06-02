"use client";

// --- Importy hooków, store'ów, komponentów i ikon ---
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingStore";
import { useLeagueStore } from "@/store/leagueStore";
import LeagueText from "@/assets/lang/League.text";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

/**
 * Komponent ligi użytkowników.
 * Wyświetla ranking użytkowników w różnych poziomach (np. Emerald, Gold).
 * Umożliwia przełączanie tierów oraz odświeżanie danych.
 */
export default function LeagueScreen() {
    // --- Stan lokalny ---
    const [selectedTier, setSelectedTier] = useState("Emerald"); // Aktualnie wybrany poziom ligi

    // --- Dane globalne i tłumaczenia ---
    const { lang } = useSettingsStore();
    const t = LeagueText[lang];

    const { token } = useAuthStore();
    const { getLeague, users, isLoading } = useLeagueStore();

    /**
     * Pobiera dane o lidze z backendu po załadowaniu tokenu
     */
    const fetchData = async () => {
        const result = await getLeague(token);
        if (!result.success) alert("Error: " + result.error);
    };

    useEffect(() => {
        if (token) fetchData();
        // eslint-disable-next-line
    }, [token]);

    /**
     * Renderuje pojedynczego użytkownika w danym tierze
     */
    const renderUser = (user, index) => (
        <Card key={user._id} className="flex items-center gap-4 p-4 mb-2">
            {/* Miejsce w rankingu */}
            <span className="text-lg font-semibold w-6 text-right">
                {index + 1}.
            </span>

            {/* Awatar użytkownika */}
            <Avatar>
                <AvatarImage
                    src={user.profileImage || "/default-user.jpg"}
                    alt={user.username}
                />
                <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
            </Avatar>

            {/* Dane użytkownika */}
            <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium truncate">{user.username}</span>
                <span className="text-gray-500 text-xs">
                    {user.rank} {t.point}
                </span>
            </div>
        </Card>
    );

    return (
        <div className="w-full max-w-2xl mx-auto py-8">
            {/* Nagłówek */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                🏆 {t.leagueName}
            </h2>

            {/* Lista poziomów ligi (przyciski zmiany tiera) */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {t.levels.map((tier) => (
                    <button
                        key={tier.name}
                        onClick={() => setSelectedTier(tier.name)}
                        className={
                            "flex flex-col items-center p-2 rounded-xl transition-all border-2 focus:outline-none min-w-[90px] " +
                            (selectedTier === tier.name
                                ? "bg-primary/10 border-primary"
                                : "bg-muted border-transparent hover:border-muted-foreground")
                        }
                    >
                        <div className={selectedTier === tier.name ? "scale-110" : ""}>
                            <Trophy size={36} color={tier.color} />
                        </div>
                        <span className="mt-1 font-semibold" style={{ color: tier.color }}>
                            {tier.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Lista użytkowników w wybranym tierze */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                </div>
            ) : (
                <div className="space-y-2">
                    {(users[selectedTier] && users[selectedTier].length > 0) ? (
                        users[selectedTier].map(renderUser)
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            {t.noUsers || "Brak użytkowników"}
                        </div>
                    )}
                </div>
            )}

            {/* Przycisk do ręcznego odświeżenia danych */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={fetchData}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-xl shadow transition-all disabled:bg-gray-400"
                >
                    {t.refresh || "Odśwież"}
                </button>
            </div>
        </div>
    );
}
