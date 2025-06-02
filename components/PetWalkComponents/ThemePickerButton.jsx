"use client";

// Importy Reacta, Zustand store'ów oraz komponentów UI
import { useState } from "react";
import { useSettingsStore } from '@/store/settingStore';
import SettingsText from "@/assets/lang/Settings.text";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";

// Mapowanie kodów języków na pełne nazwy
const languageNames = {
    en: "English",
    pl: "Polski",
    cs: "Čeština",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    ua: "Українська",
    ru: "Русский",
    zh: "中文 (Chinese)",
    ja: "日本語 (Japanese)",
    pt: "Português"
};

/**
 * Komponent przycisku otwierającego modal do wyboru motywu lub języka
 *
 * @param {string} label - tekst przycisku (np. "Zmień język")
 * @param {Function} onConfirm - funkcja wywoływana po zapisaniu wyboru
 * @param {1|2} typ - 1 = wybór motywu kolorystycznego, 2 = wybór języka
 */
export default function ThemePickerButton({ label, onConfirm, typ }) {
    // Pobieramy dane z ustawień aplikacji (Zustand)
    const { color, lang } = useSettingsStore();
    const t = SettingsText[lang];

    // Wartość aktualnie zaznaczona (język lub kolor)
    const [selected, setSelected] = useState(typ === 1 ? color : lang);
    const [modalVisible, setModalVisible] = useState(false);

    // Lista opcji do wyboru
    const options = typ === 1
        ? ["blue", "violet", "green", "pink", "gray", "yellow"]
        : Object.keys(SettingsText); // Lista języków na podstawie dostępnych tłumaczeń

    // Potwierdzenie i zapis wyboru
    const handleConfirm = () => {
        onConfirm(selected);
        setModalVisible(false);
    };

    return (
        <>
            {/* Przycisk otwierający modal */}
            <Button
                variant="outline"
                className="justify-start w-full"
                onClick={() => setModalVisible(true)}
            >
                {label}
            </Button>

            {/* Okno modalne */}
            <Dialog open={modalVisible} onOpenChange={setModalVisible}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {typ === 1 ? t.selectTheme : t.selectLanguage}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Lista opcji do wyboru */}
                    <div className="max-h-60 overflow-y-auto my-4 flex flex-col gap-1">
                        {options.map(option => (
                            <Button
                                key={option}
                                variant={selected === option ? "secondary" : "ghost"}
                                className="justify-start w-full"
                                onClick={() => setSelected(option)}
                            >
                                {typ === 1
                                    ? option
                                    : languageNames[option] || option}
                            </Button>
                        ))}
                    </div>

                    {/* Przyciski w stopce modala */}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setModalVisible(false)}
                        >
                            {t.cancel || "Anuluj"}
                        </Button>
                        <Button onClick={handleConfirm}>
                            {t.save || "Zapisz"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
