// Importujemy komponenty React Native
import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

// Importujemy style bazowe i narzędzia do zarządzania stanem ustawień
import styles from '@/assets/styles/settings.styles';
import { useSettingsStore } from '@/store/settingStore';
import texture from "@/constants/colorsApp";

/**
 * Komponent przycisku ustawień wyświetlający etykietę tekstową.
 * Styl jest dynamiczny – zależny od aktualnie wybranego motywu kolorystycznego.
 *
 * @param {string} label - tekst do wyświetlenia na przycisku
 * @param {function} onPress - funkcja wywoływana po naciśnięciu przycisku
 */
export default function SettingButton({ label, onPress }) {
    // Pobranie aktualnego koloru motywu z globalnego stanu aplikacji
    const { color } = useSettingsStore();

    // Na podstawie koloru tworzymy paletę barw (np. ciemny, jasny, niebieski)
    const COLORS = texture[color];

    // Generujemy dynamiczny zestaw stylów oparty o aktywny motyw
    const dynamicStyles = styles(COLORS);

    return (
        // Dotykalny przycisk z przypisaną funkcją i stylami
        <TouchableOpacity style={dynamicStyles.settingButton} onPress={onPress}>
            <Text style={dynamicStyles.settingText}>{label}</Text>
        </TouchableOpacity>
    );
}
