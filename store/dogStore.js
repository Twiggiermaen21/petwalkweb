import { create } from 'zustand'
import { API_URL } from "@/lib/api"

// Tworzenie store'a Zustand do zarządzania danymi psów
export const useDogStore = create((set) => ({
    dogsFromDB: null, // Lista psów pobrana z bazy danych
    isLoading: false, // Flaga ładowania danych

    // Dodanie nowego psa do bazy
    addDog: async (token, name, age, breed, image, height, weight, imageBase64) => {
        set({ isLoading: true }); // Włączenie trybu ładowania

        try {
            let imageDataUrl = null; // Zmienna na zakodowany obrazek
            if (image && imageBase64) {
                const uriParts = image.split("."); // Próba wyciągnięcia rozszerzenia pliku (np. jpg, png)
                console.log("uriparts:", uriParts)
                
                // const fileType = uriParts[uriParts.length - 1]; // Nieaktywny kod
                const fileType = null; // Tymczasowo ustawione na null
                const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg"; // Domyślnie jpeg
                imageDataUrl = `data:${imageType};base64,${imageBase64}`; // Format: data:image/jpeg;base64,...
            }

            // Żądanie POST do API z danymi psa i opcjonalnie obrazkiem
            const response = await fetch(`${API_URL}/dogs/add-dog`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Token uwierzytelniający
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    breed,
                    weight,
                    age,
                    height,
                    image: imageDataUrl // Zakodowany obrazek base64
                })
            });

            const data = await response.json(); // Odpowiedź z serwera
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            set({ isLoading: false }); // Wyłączenie ładowania
            return { success: true };

        } catch (error) {
            set({ isLoading: false }); // Wyłączenie ładowania przy błędzie
            return { success: false, error: error.message }; // Zwrócenie komunikatu błędu
        }
    },

    // Pobranie listy psów z bazy danych
    getDogs: async (token) => {
        set({ isLoading: true }); // Włączenie trybu ładowania
        try {
            const response = await fetch(`${API_URL}/dogs/get-dog`, {
                headers: { Authorization: `Bearer ${token}` }, // Token w nagłówku
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            set({ dogsFromDB: data.dogs, isLoading: false }); // Zapis listy psów do stanu
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Oznaczenie psa jako usuniętego
    DeletedDogId: async (token, dogId) => {
        set({ isLoading: true }); // Włączenie ładowania
        try {
            const response = await fetch(`${API_URL}/dogs/${dogId}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }, // Token w nagłówku
                body: JSON.stringify({ isDeleted: true }) // Oznaczenie psa jako usuniętego
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            set({ isLoading: false }); // Wyłączenie ładowania
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message }; // Zwrócenie błędu
        }
    },

}));
