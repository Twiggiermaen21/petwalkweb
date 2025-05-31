
import { create } from 'zustand'
import { API_URL } from "../lib/api"
import { setCookie, getCookie, removeCookie } from "@/lib/cookies";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    singup: async (username, email, password) => {

        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username, email, password
                })
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            console.log("Signup response:", data);
            setCookie("session", { token: data.token, user: data.user }, 1);

            set({ token: data.token, user: data.user, isLoading: false });

            return { success: true };

        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    authReady: false,
    checkAuth: async () => {
        try {
            const session = getCookie("session");
            console.log(session);

            const token = session?.token || null;
            const userJson = session?.user || null;
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user, authReady: true });
        } catch (error) {
            console.log("Auth check failed", error);
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            setCookie("session", { token: data.token, user: data.user }, 1);

            set({ token: data.token, user: data.user, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    logout: async () => {
        removeCookie("session");
        set({ token: null, user: null });

    },

    updateUser: async (token, updateData) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/update-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }
            set({ isLoading: false });
            return { success: true, };
        } catch (error) {
            set({ isLoading: false });
            console.error('Error updating user:', error);
            return { success: false, error: error.message };
        }
    },
}));