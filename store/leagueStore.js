import { create } from 'zustand'
import { API_URL } from "@/lib/api"

// Store Zustand do obsługi ligi użytkowników
export const useLeagueStore = create((set) => ({

    isLoading: false, // Flaga informująca, czy dane są ładowane
    refreshing: false, // Flaga do np. pokazywania "pull to refresh"
    
    // Struktura użytkowników podzielonych na ligi
    users: {
        Emerald: [],   // Top 1–10
        Diament: [],   // Top 11–20
        Gold: [],      // Top 21–30
        Silver: [],    // Top 31–40
        Bronze: []     // Top 41–50
    },

    // Funkcja pobierająca dane ligi z API
    getLeague: async (token) => {
        set({ isLoading: true, refreshing: true }); // Ustawienie flag ładowania

        try {
            // Żądanie GET do API ligi z tokenem autoryzacyjnym
            const response = await fetch(`${API_URL}/league`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json(); // Parsowanie odpowiedzi
            if (!response.ok) throw new Error(data.message || "Failed to fetch user/walks");

            // Funkcja pomocnicza: dzieli top 50 użytkowników na 5 kategorii
            const splitTop50ToTiers = (users) => ({
                Emerald: users.slice(0, 10),     // Top 1–10
                Diamond: users.slice(10, 20),    // Top 11–20
                Gold: users.slice(20, 30),       // Top 21–30
                Silver: users.slice(30, 40),     // Top 31–40
                Bronze: users.slice(40, 50)      // Top 41–50
            });

            const grouped = splitTop50ToTiers(data.users); // Podział użytkowników na ligi

            // Zapisanie danych w stanie aplikacji
            set({ isLoading: false, users: grouped, refreshing: false });
            return { success: true };

        } catch (error) {
            // Obsługa błędów + reset flag
            set({ isLoading: false, refreshing: false });
            return { success: false, error: error.message };
        }
    }

}));
