import { create } from 'zustand'
import { API_URL } from "@/lib/api"

// Zustand store do zarządzania spacerami użytkownika
export const useWalkStore = create((set) => ({

    isLoading: false,       // Flaga ogólnego ładowania (np. wczytywania spacerów)
    walks: [],              // Lista spacerów pobranych z backendu
    page: null,             // Aktualna strona danych
    totalPages: null,       // Całkowita liczba dostępnych stron
    isLoadingMore: null,    // Flaga ładowania kolejnych stron (np. przy paginacji)
    pageNumber: 1,          // Numer aktualnej strony
    refreshing: false,      // Flaga odświeżania (np. pull-to-refresh)

    // Pobieranie spacerów z backendu (z paginacją)
    getWalks: async (pageNumber, refreshing, token) => {
        // Wybór odpowiedniego stanu ładowania w zależności od akcji
        if (refreshing) set({ refreshing: true });
        else if (pageNumber > 1) set({ isLoadingMore: true });
        else set({ isLoading: true });

        try {
            // Pobieranie danych spacerów z API z limitem 5 na stronę
            const response = await fetch(`${API_URL}/walks?page=${pageNumber}&limit=5`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch walks");

            // Aktualizacja stanu po pobraniu danych
            set((state) => ({
                walks: pageNumber === 1
                    ? data.walks // Nadpisanie jeśli to pierwsza strona
                    : [...(state.walks || []), ...data.walks], // Inaczej dodanie kolejnych spacerów
                page: data.currentPage,
                totalPages: data.totalPages,
                isLoading: false,
                refreshing: false,
                isLoadingMore: false,
            }));

            return { success: true };

        } catch (error) {
            // Obsługa błędu i wyłączenie wszystkich flag ładowania
            set({ isLoading: false, isLoadingMore: false, refreshing: false });
            return { success: false, error: error.message };
        }
    },

    // Zapis spaceru do backendu
    saveWalk: async (token, timeElapsed, averageSpeed, distance, path, selectedDogIds) => {
        set({ isLoading: true });
        try {
            // Wysyłanie danych spaceru metodą POST
            const response = await fetch(`${API_URL}/walks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    time: timeElapsed,
                    speed: averageSpeed,
                    distance,
                    path,
                    dogs: selectedDogIds,
                })
            });

            set({ isLoading: false });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Usuwanie spaceru po jego ID
    deleteWalk: async (id, token) => {
        set({ isLoading: true });
        try {
            // Żądanie DELETE na wskazany spacer
            const response = await fetch(`${API_URL}/walks/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            set({ isLoading: false });
            const data = await response.json();
            return {
                success: response.ok,
                error: data.message
            };
        } catch (err) {
            set({ isLoading: false });
            return {
                success: false,
                error: err.message
            };
        }
    },

}));
