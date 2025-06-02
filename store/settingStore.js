import { create } from 'zustand';

// Zustand store do przechowywania ustawień aplikacji (język, kolorystyka itp.)
export const useSettingsStore = create((set) => ({

    lang: 'pl', // Domyślny język aplikacji

    // Ustawienie nowego języka aplikacji
    setLang: async (newLang) => {
        set({ lang: newLang }); // Aktualizacja stanu języka
    },

    // Inicjalizacja ustawień przy starcie aplikacji (np. odczyt z pamięci)
    initializeSettings: async () => {
        try {
             if (storedLang) set({ lang: storedLang });
        } catch (error) {
            console.error('Failed to load settings from storage', error);
        }
    },

    // Przywracanie domyślnych ustawień
    resetSettings: async () => {
        set({ lang: 'pl' }); // Reset języka i koloru na wartości domyślne
    },

}));
