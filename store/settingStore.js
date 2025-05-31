import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
    lang: 'pl',
    color: 'FOREST',

    setLang: async (newLang) => {
        set({ lang: newLang });
        // await AsyncStorage.setItem('lang', newLang);
    },

    setColor: async (newColor) => {
        set({ color: newColor });
        // await AsyncStorage.setItem('color', newColor);
    },

    initializeSettings: async () => {
        try {
            // const storedLang = await AsyncStorage.getItem('lang');
            // const storedColor = await AsyncStorage.getItem('color');

            if (storedLang) set({ lang: storedLang });
            if (storedColor) set({ color: storedColor });
        } catch (error) {
            console.error('Failed to load settings from storage', error);
        }
    },

    resetSettings: async () => {
        // await AsyncStorage.removeItem("lang");
        // await AsyncStorage.removeItem("color");
        set({ lang: 'pl', color: 'FOREST' });

    },

}));
