"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from '@/store/settingStore';
import SettingsText from '@/assets/lang/Settings.text';

export default function SettingsModal({
    modalVisible,
    closeModal,
    selectedFunction,
    selectedLabel,
    inputValue,
    setInputValue,
    updateButton,
    handleLinkPress,
}) {
    const { lang } = useSettingsStore();
    const t = SettingsText[lang];
    const textMap = {
        6: t.about,
        5: t.version,
    };

    return (
        <Dialog open={modalVisible} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedLabel}</DialogTitle>
                </DialogHeader>
                {selectedFunction < 5 ? (
                    <div className="space-y-4">
                        <label className="block font-medium">{t.info[selectedFunction]}</label>
                        {selectedFunction === 4 && (
                            <Button type="button" variant="link" onClick={handleLinkPress}>
                                {t.avatarGenerator || "Kliknij tutaj, aby stworzyć awatara!"}
                            </Button>
                        )}
                        <Input
                            placeholder={t.namePlaceholder}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            type={selectedFunction === 3 ? "password" : "text"}
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="py-4">
                        {textMap[selectedFunction] || null}
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={closeModal}>{t.cancel || "Anuluj"}</Button>
                    {selectedFunction < 5 && (
                        <Button onClick={updateButton}>{t.save}</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
