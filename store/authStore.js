import { create } from 'zustand'
import { API_URL } from "../lib/api"
import { setCookie, getCookie, removeCookie } from "@/lib/cookies";

// Tworzenie store'a Zustand do zarządzania autoryzacją
export const useAuthStore = create((set) => ({
    user: null, // Dane użytkownika
    token: null, // Token autoryzacyjny
    isLoading: false, // Flaga ładowania

    // Rejestracja nowego użytkownika
    singup: async (username, email, password) => {
        set({ isLoading: true }); // Włączenie trybu ładowania
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username, email, password // Dane do rejestracji
                })
            })

            const data = await response.json(); // Odpowiedź z serwera
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            // Zapis sesji do ciasteczka
            setCookie("session", { token: data.token, user: data.user }, 1);

            // Ustawienie danych użytkownika w stanie
            set({ token: data.token, user: data.user, isLoading: false });

            return { success: true };

        } catch (error) {
            set({ isLoading: false }); // Wyłączenie ładowania w razie błędu
            return { success: false, error: error.message }; // Zwrócenie błędu
        }
    },

    authReady: false, // Flaga informująca, czy uwierzytelnienie zostało sprawdzone

    // Sprawdzenie uwierzytelnienia przy starcie aplikacji
    checkAuth: async () => {
        try {
            const session = getCookie("session"); // Pobranie sesji z ciasteczka
            console.log(session);

            const token = session?.token || null;
            const user = session?.user || null;

            // Aktualizacja stanu z danymi z ciasteczka
            set({ token, user, authReady: true });
        } catch (error) {
            console.log("Auth check failed", error); // Obsługa błędu
        }
    },

    // Logowanie użytkownika
    login: async (email, password) => {
        set({ isLoading: true }); // Włączenie ładowania
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password // Dane logowania
                })
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            // Zapis sesji do ciasteczka
            setCookie("session", { token: data.token, user: data.user }, 1);

            // Aktualizacja stanu
            set({ token: data.token, user: data.user, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false }); // Wyłączenie ładowania
            return { success: false, error: error.message }; // Zwrócenie błędu
        }
    },

    // Wylogowanie użytkownika
    logout: async () => {
        removeCookie("session"); // Usunięcie ciasteczka sesji
        set({ token: null, user: null }); // Wyczyszczenie stanu użytkownika
    },

    // Aktualizacja danych użytkownika
    updateUser: async (token, updateData) => {
        set({ isLoading: true }); // Włączenie trybu ładowania
        try {
            const response = await fetch(`${API_URL}/auth/update-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // Token w nagłówku
                },
                body: JSON.stringify(updateData) // Nowe dane użytkownika
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }

            set({ isLoading: false }); // Wyłączenie ładowania
            return { success: true, };
        } catch (error) {
            set({ isLoading: false });
            console.error('Error updating user:', error); // Log błędu
            return { success: false, error: error.message }; // Zwrócenie błędu
        }
    },
}));
