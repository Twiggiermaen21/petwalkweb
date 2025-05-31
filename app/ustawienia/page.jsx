"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingStore";
import { useAuthStore } from "@/store/authStore";
import SettingsText from "@/assets/lang/Settings.text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsScreen() {
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");
    const [inputValue, setInputValue] = useState("");
    const { lang, color, setLang, setColor, resetSettings } = useSettingsStore();
    const { updateUser, token } = useAuthStore();
    const t = SettingsText[lang];

    // Przypisz pole po numerze funkcji
    const fieldMap = {
        1: { username: inputValue },
        2: { email: inputValue },
        3: { password: inputValue },
        4: { profileImage: inputValue }
    };

    const openModal = (label, number) => {
        setSelectedLabel(label);
        setSelectedFunction(number);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedLabel("");
        setInputValue("");
        setSelectedFunction(null);
    };

    const handleLinkPress = () => {
        const url = 'https://www.dicebear.com/styles/avataaars/';
        window.open(url, "_blank", "noopener");
    };

    const confirmReset = () => {
        if (window.confirm("Are you sure you want to reset the app?")) {
            resetSettings();
            toast.success(t.resetToast || "App settings reset!");
        }
    };

    const updateButton = async () => {
        if (!fieldMap[selectedFunction]) {
            toast.error("Invalid selection");
            return;
        }
        const result = await updateUser(token, fieldMap[selectedFunction]);
        if (!result.success) {
            toast.error(result.error || "Update error");
        } else {
            toast.success("Profile updated successfully!");
            closeModal();
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6">{t.settingsTitle}</h2>
            <div className="space-y-8">
                <section>
                    <h3 className="font-semibold mb-2">{t.account}</h3>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" onClick={() => openModal(t.changeUsername, 1)}>{t.changeUsername}</Button>
                        <Button variant="outline" onClick={() => openModal(t.changeEmail, 2)}>{t.changeEmail}</Button>
                        <Button variant="outline" onClick={() => openModal(t.changePassword, 3)}>{t.changePassword}</Button>
                        <Button variant="outline" onClick={() => openModal(t.editProfilePicture, 4)}>{t.editProfilePicture}</Button>
                    </div>
                </section>
                <section>
                    <h3 className="font-semibold mb-2">{t.themeAppearance}</h3>
                    <div className="flex flex-col gap-2">
                        <ColorPicker onChange={setColor} value={color} label={t.colorScheme} />
                        <LanguagePicker onChange={setLang} value={lang} label={t.selectLanguage} />
                    </div>
                </section>
                <section>
                    <h3 className="font-semibold mb-2">{t.helpOther}</h3>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" onClick={() => openModal(t.appVersion, 5)}>{t.appVersion}</Button>
                        <Button variant="destructive" onClick={confirmReset}>{t.resetSettings}</Button>
                        <Button variant="outline" onClick={() => openModal(t.aboutApp, 6)}>{t.aboutApp}</Button>
                    </div>
                </section>
                <LogoutButton />
            </div>
            {/* MODAL */}
            <Dialog open={modalVisible} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedLabel}</DialogTitle>
                    </DialogHeader>
                    {(selectedFunction === 4) && (
                        <Button onClick={handleLinkPress} className="mb-4" variant="secondary">
                            {t.randomAvatar || "Generator avatara Dicebear"}
                        </Button>
                    )}
                    {selectedFunction >= 1 && selectedFunction <= 4 && (
                        <div>
                            <Label htmlFor="input" className="mb-2 block">{selectedLabel}</Label>
                            <Input
                                id="input"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                type={selectedFunction === 3 ? "password" : "text"}
                                autoFocus
                                placeholder={t.enterValue || "Enter value"}
                                className="mb-4"
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal}>{t.cancel || "Cancel"}</Button>
                        {(selectedFunction >= 1 && selectedFunction <= 4) &&
                            <Button onClick={updateButton}>{t.save || "Save"}</Button>
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- Dummy components ---

function LogoutButton() {
    // tu twoja logika wylogowania
    return <Button variant="destructive" className="mt-8 w-full">Wyloguj się</Button>
}

function ColorPicker({ onChange, value, label }) {
    return (
        <div className="flex items-center gap-2">
            <Label>{label}</Label>
            <select
                className="ml-2 border rounded p-1"
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                <option value="blue">Blue</option>
                <option value="violet">Violet</option>
                <option value="green">Green</option>
                {/* Dodaj swoje kolory */}
            </select>
        </div>
    );
}

function LanguagePicker({ onChange, value, label }) {
    return (
        <div className="flex items-center gap-2">
            <Label>{label}</Label>
            <select
                className="ml-2 border rounded p-1"
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                <option value="pl">Polski</option>
                <option value="en">English</option>
                {/* Dodaj swoje języki */}
            </select>
        </div>
    );
}
