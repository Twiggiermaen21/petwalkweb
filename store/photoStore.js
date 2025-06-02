import { create } from 'zustand'
import { API_URL } from "@/lib/api"

// Store Zustand do zarządzania zdjęciami
export const usePhotoStore = create((set) => ({

    isLoading: false,       // Flaga głównego ładowania (np. początkowego)
    photos: [],             // Tablica zdjęć pobranych z serwera
    page: null,             // Aktualna strona danych
    totalPages: null,       // Całkowita liczba stron
    isLoadingMore: null,    // Flaga ładowania kolejnych stron (np. przy paginacji)
    pageNumber: 1,          // Numer aktualnej strony
    refreshing: false,      // Flaga odświeżania (np. pull-to-refresh)

    // Pobieranie zdjęć z API z uwzględnieniem paginacji i odświeżania
    getPhotos: async (pageNumber, refreshing, token) => {
        if (refreshing) set({ refreshing: true }); // Użytkownik odświeża
        else if (pageNumber > 1) set({ isLoadingMore: true }); // Ładowanie kolejnej strony
        else set({ isLoading: true }); // Domyślne ładowanie (pierwsza strona)

        try {
            const response = await fetch(`${API_URL}/photo?page=${pageNumber}&limit=18`, {
                headers: { Authorization: `Bearer ${token}` }, // Token w nagłówku
            });

            const data = await response.json(); // Parsowanie danych JSON
            if (!response.ok) throw new Error(data.message || "Failed to fetch walks");

            set((state) => ({
                photos: pageNumber === 1
                    ? data.photos // Jeśli to pierwsza strona — nadpisz zdjęcia
                    : [...(state.photos || []), ...data.photos], // Inaczej — doklej kolejne
                page: data.currentPage,
                totalPages: data.totalPages,
                isLoading: false,
                refreshing: false,
                isLoadingMore: false,
            }));

            return { success: true };

        } catch (error) {
            set({ isLoading: false, isLoadingMore: false, refreshing: false });
            return { success: false, error: error.message }; // Zwrócenie błędu
        }
    },

    // Przesyłanie zdjęcia (base64) do API
    uploadImage: async (token, res, user) => {
        set({ isLoading: true });

        try {
            console.log("Image w store:", res.uri);        // Ścieżka pliku
            console.log("Image64 w store:", res.base64);   // Obraz zakodowany w base64

            const image = res.uri;
            const imageBase64 = res.base64;

            let imageDataUrl = null;

            if (image && imageBase64) {
                const uriParts = image.split("."); // Pobierz rozszerzenie pliku
                const fileType = uriParts[uriParts.length - 1];
                const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
                imageDataUrl = `data:${imageType};base64,${imageBase64}`; // Zakoduj jako DataURL
            }

            // Wyślij zdjęcie do API
            const response = await fetch(`${API_URL}/photo/upload-image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    image: imageDataUrl,
                    user
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            set({ isLoading: false });
            return { success: true };

        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Usuwanie zdjęcia z serwera
    deletePhoto: async (id, token) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`${API_URL}/photo/${id}`, {
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
    }

}));
