"use client";

import { useState } from "react";
import { useSettingsStore } from '@/store/settingStore';
import SettingsText from "@/assets/lang/Settings.text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

export default function ThemePickerButton({ label, onConfirm, typ }) {
    const { color, lang } = useSettingsStore();
    const [selected, setSelected] = useState(typ === 1 ? color : lang);
    const [modalVisible, setModalVisible] = useState(false);
    const t = SettingsText[lang];

    const options = typ === 1
        ? ["blue", "violet", "green", "pink", "gray", "yellow"] // Możesz dynamicznie wczytać dostępne kolory
        : Object.keys(SettingsText);

    const handleConfirm = () => {
        onConfirm(selected);
        setModalVisible(false);
    };

    return (
        <>
            <Button variant="outline" className="justify-start w-full" onClick={() => setModalVisible(true)}>
                {label}
            </Button>
            <Dialog open={modalVisible} onOpenChange={setModalVisible}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{typ === 1 ? t.selectTheme : t.selectLanguage}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-60 overflow-y-auto my-4 flex flex-col gap-1">
                        {options.map(option => (
                            <Button
                                key={option}
                                variant={selected === option ? "secondary" : "ghost"}
                                className="justify-start w-full"
                                onClick={() => setSelected(option)}
                            >
                                {typ === 1 ? option : languageNames[option] || option}
                            </Button>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalVisible(false)}>{t.cancel || "Anuluj"}</Button>
                        <Button onClick={handleConfirm}>{t.save || "Zapisz"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
