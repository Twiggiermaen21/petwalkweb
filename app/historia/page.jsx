"use client";

// --- Importy hooków, komponentów, store'ów i narzędzi ---
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingStore";
import { useWalkStore } from "@/store/walkStore";
import HistoryText from "@/assets/lang/History.text";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import PathMap from "@/components/PetWalkComponents/PathMap";

// Ścieżka domyślnego obrazka, gdy pies nie ma zdjęcia
const noDogImg = "/noDog.jpg";

/**
 * Formatowanie czasu z sekund do postaci mm:ss
 */
function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}m ${seconds}s`;
}

/**
 * Komponent ekranu historii spacerów.
 * Pokazuje listę spacerów z mapką, czasem, dystansem i listą psów.
 * Umożliwia paginację, odświeżenie i usuwanie spacerów.
 */
export default function HistoryScreen() {
    // --- Store i tłumaczenia ---
    const { token } = useAuthStore();
    const {
        walks, page, totalPages,
        isLoadingMore, refreshing,
        getWalks, deleteWalk,
    } = useWalkStore();
    const { lang } = useSettingsStore();
    const t = HistoryText[lang];

    const [deleteId, setDeleteId] = useState(null); // ID spaceru do usunięcia

    /**
     * Pobranie spacerów z backendu (stronicowanie i odświeżanie)
     */
    const fetchData = async (pageNumber = 1, refreshing = false) => {
        const result = await getWalks(pageNumber, refreshing, token);
        if (!result.success) {
            toast.error(result.error || t.error || "Błąd");
        }
    };

    // Pobieranie danych po załadowaniu tokenu
    useEffect(() => {
        if (token) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [token]);

    /**
     * Odświeżenie danych (pierwsza strona)
     */
    const handleRefresh = async () => {
        await fetchData(1, true);
    };

    /**
     * Paginacja – ładowanie kolejnych stron
     */
    const handleLoadMore = () => {
        if (!isLoadingMore && page < totalPages) {
            fetchData(page + 1);
        }
    };

    /**
     * Przygotowanie do usunięcia spaceru
     */
    const handleDeleteWalk = (id) => {
        setDeleteId(id);
    };

    /**
     * Potwierdzenie i wykonanie usunięcia spaceru
     */
    const confirmDeleteWalk = async () => {
        if (deleteId) {
            const result = await deleteWalk(deleteId, token);
            setDeleteId(null);
            if (!result.success) {
                toast.error(result.error || t.error || "Błąd");
            } else {
                toast.success(t.deleted || "Spacer usunięty!");
                fetchData(); // Odśwież dane po usunięciu
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6">{t.historyTitle}</h2>

            {/* Lista spacerów */}
            <div className="space-y-4">
                {walks.length === 0 ? (
                    <div className="text-center text-gray-400">
                        {t.noWalks || "Brak spacerów"}
                    </div>
                ) : (
                    walks.map((item) => (
                        <Card key={item._id} className="p-4 flex gap-4 relative group">

                            {/* Podgląd trasy spaceru */}
                            <div className="w-32 h-32 overflow-hidden rounded-lg">
                                {item.path?.length > 1 ? (
                                    <PathMap
                                        path={item.path}
                                        zoom={12}
                                        options={{ strokeColor: "#0ea5e9" }}
                                        mapOptions={{
                                            disableDefaultUI: true,
                                            draggable: false,
                                            zoomControl: false,
                                            scrollwheel: false,
                                            disableDoubleClickZoom: true,
                                            gestureHandling: "none",
                                        }}
                                        containerStyle={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "0.75rem",
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                        {t.noPath}
                                    </div>
                                )}
                            </div>

                            {/* Szczegóły spaceru */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex flex-wrap gap-2 text-sm">
                                    <span>
                                        {t.date}{" "}
                                        <span className="font-semibold">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </span>
                                    <span>
                                        {t.time}{" "}
                                        <span className="font-semibold">
                                            {formatTime(item.time)}
                                        </span>
                                    </span>
                                    <span>
                                        {t.distance}{" "}
                                        <span className="font-semibold">
                                            {item.distance.toFixed(2)} km
                                        </span>
                                    </span>
                                    <span>
                                        {t.speed}{" "}
                                        <span className="font-semibold">
                                            {item.speed.toFixed(2)} km/h
                                        </span>
                                    </span>
                                </div>

                                {/* Pieski przypisane do spaceru */}
                                <div className="flex mt-3 gap-2">
                                    {item.dogs && item.dogs.length > 0
                                        ? item.dogs.map((dog, i) => (
                                            <Avatar key={dog?._id || `dog-${i}`}>
                                                <AvatarImage src={dog?.dogImage || noDogImg} alt={dog?.name || "Dog"} />
                                                <AvatarFallback>🐶</AvatarFallback>
                                            </Avatar>
                                        ))
                                        : (
                                            <span className="text-gray-400">
                                                {t.noDogs || "Brak psów"}
                                            </span>
                                        )}
                                </div>
                            </div>

                            {/* Przycisk usunięcia spaceru z potwierdzeniem */}
                            <AlertDialog open={deleteId === item._id} onOpenChange={open => !open && setDeleteId(null)}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
                                        size="sm"
                                        onClick={() => handleDeleteWalk(item._id)}
                                    >
                                        {t.delete || "Usuń"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
                                        <AlertDialogDescription>{t.deleteMessage}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                            {t.deleteCancel}
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmDeleteWalk}>
                                            {t.deleteConfirm}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </Card>
                    ))
                )}
            </div>

            {/* Paginacja */}
            {walks.length > 0 && page < totalPages && (
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-4 py-2 rounded-xl shadow transition-all"
                    >
                        {t.loadMore || "Załaduj więcej"}
                    </Button>
                </div>
            )}

            {/* Odświeżenie */}
            <div className="flex justify-center mt-6">
                <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="secondary"
                >
                    {t.refresh || "Odśwież"}
                </Button>
            </div>
        </div>
    );
}
