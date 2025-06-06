'use client';

// --- Importy hooków, komponentów, store'ów i narzędzi ---
import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingStore";
import { useAuthStore } from "@/store/authStore";
import SettingsText from "@/assets/lang/Settings.text";
import { Button } from "@/components/ui/button";
import SettingsModal from "@/components/PetWalkComponents/SettingsModal";
import ThemePickerButton from "@/components/PetWalkComponents/ThemePickerButton";
import LogoutButton from "@/components/PetWalkComponents/LogoutButton";

/**
 * Komponent ustawień aplikacji.
 * Umożliwia zmianę danych użytkownika, języka, reset ustawień, wylogowanie itd.
 */
export default function SettingsScreen() {
    // --- Lokalne stany do zarządzania modalem i edycją ---
    const [selectedFunction, setSelectedFunction] = useState(null); // numer pola do edycji
    const [modalVisible, setModalVisible] = useState(false);        // widoczność modala
    const [selectedLabel, setSelectedLabel] = useState("");         // etykieta wybranej opcji
    const [inputValue, setInputValue] = useState("");               // wpisany tekst w modal

    // --- Dane ze store'ów i tłumaczenia ---
    const { lang, color, setLang, setColor, resetSettings } = useSettingsStore();
    const { updateUser, token } = useAuthStore();
    const t = SettingsText[lang];

    /**
     * Otwiera modal edycji danego pola (np. email, hasło)
     * @param {string} label - etykieta pola
     * @param {number} number - identyfikator pola
     */
    const openModal = (label, number) => {
        setSelectedLabel(label);
        setSelectedFunction(number);
        setModalVisible(true);
    };

    /**
     * Zamknięcie modala i reset stanu edycji
     */
    const closeModal = () => {
        setModalVisible(false);
        setSelectedLabel("");
        setInputValue("");
        setSelectedFunction(null);
    };

    /**
     * Otwiera zewnętrzny link do generatora awatarów
     */
    const handleLinkPress = () => {
        window.open('https://www.dicebear.com/styles/avataaars/', "_blank");
    };

    /**
     * Resetuje wszystkie ustawienia aplikacji
     */
    const confirmReset = () => {
        if (window.confirm(t.confirmReset || "Are you sure you want to reset app?")) {
            resetSettings();
            toast.success(t.resetToast || "App settings reset!");
        }
    };

    /**
     * Mapowanie pola z modala na payload do API
     */
    const fieldMap = {
        1: { username: inputValue },
        2: { email: inputValue },
        3: { password: inputValue },
        4: { profileImage: inputValue }
    };

    /**
     * Aktualizuje dane użytkownika (np. email, hasło)
     */
    const updateButton = async () => {
        if (!fieldMap[selectedFunction]) {
            toast.error("Invalid selection");
            return;
        }
        const result = await updateUser(token, fieldMap[selectedFunction]);
        if (!result.success) {
            toast.error(result.error || "Update error");
        } else {
            toast.success(t.success || "Profile updated successfully!");
            closeModal();
        }
    };

    /**
     * Przycisk do ustawień – label + onClick
     */
    const SettingButton = ({ label, onClick }) => (
        <Button variant="outline" className="justify-start w-full" onClick={onClick}>
            {label}
        </Button>
    );

    return (
        <div className="w-full max-w-xl mx-auto py-8">
            {/* Nagłówek */}
            <h2 className="text-2xl font-bold mb-6">{t.settingsTitle}</h2>

            <div className="space-y-8">
                {/* Sekcja: Konto */}
                <section>
                    <h3 className="font-semibold mb-2">{t.account}</h3>
                    <div className="flex flex-col gap-2">
                        <SettingButton label={t.changeUsername} onClick={() => openModal(t.changeUsername, 1)} />
                        <SettingButton label={t.changeEmail} onClick={() => openModal(t.changeEmail, 2)} />
                        <SettingButton label={t.changePassword} onClick={() => openModal(t.changePassword, 3)} />
                        <SettingButton label={t.editProfilePicture} onClick={() => openModal(t.editProfilePicture, 4)} />
                    </div>
                </section>

                {/* Sekcja: Wygląd */}
                <section>
                    <h3 className="font-semibold mb-2">{t.themeAppearance}</h3>
                    <div className="flex flex-col gap-2">
                        <ThemePickerButton
                            label={t.selectLanguage}
                            typ={2}
                            onConfirm={setLang}
                        />
                        {/* Można tu też dodać ThemePickerButton do zmiany koloru */}
                    </div>
                </section>

                {/* Sekcja: Inne */}
                <section>
                    <h3 className="font-semibold mb-2">{t.helpOther}</h3>
                    <div className="flex flex-col gap-2">
                        <SettingButton label={t.appVersion} onClick={() => openModal(t.appVersion, 5)} />
                        <Button
                            variant="destructive"
                            className="justify-start w-full"
                            onClick={confirmReset}
                        >
                            {t.resetSettings}
                        </Button>
                        <SettingButton label={t.aboutApp} onClick={() => openModal(t.aboutApp, 6)} />
                    </div>
                </section>

                {/* Przycisk wylogowania */}
                <LogoutButton />
            </div>

            {/* Modal edycji (np. email, hasło, awatar) */}
            <SettingsModal
                modalVisible={modalVisible}
                closeModal={closeModal}
                selectedFunction={selectedFunction}
                selectedLabel={selectedLabel}
                inputValue={inputValue}
                setInputValue={setInputValue}
                updateButton={updateButton}
                handleLinkPress={handleLinkPress}
            />
        </div>
    );
}
