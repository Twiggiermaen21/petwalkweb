import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
    lang: 'pl',
   

    setLang: async (newLang) => {
        set({ lang: newLang });
        // await AsyncStorage.setItem('lang', newLang);
    },

   
    initializeSettings: async () => {
        try {
            // const storedLang = await AsyncStorage.getItem('lang');
            // const storedColor = await AsyncStorage.getItem('color');

            if (storedLang) set({ lang: storedLang });
          
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
