"use client";

// Import komponentów UI i funkcjonalności
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/settingStore";
import SettingsText from "@/assets/lang/Settings.text";

/**
 * Komponent modalnego okna ustawień
 *
 * Umożliwia edycję danych użytkownika (nazwa, email, hasło, avatar) lub wyświetla informacje
 * o wersji aplikacji / o aplikacji. Treści są dostosowane językowo.
 *
 * @param {boolean} modalVisible - czy okno modalne jest widoczne
 * @param {Function} closeModal - funkcja zamykająca modal
 * @param {number} selectedFunction - numer akcji (1-4: edycja danych, 5: wersja, 6: info)
 * @param {string} selectedLabel - tytuł modala
 * @param {string} inputValue - aktualna wartość inputa
 * @param {Function} setInputValue - setter do inputa
 * @param {Function} updateButton - akcja po kliknięciu zapisz
 * @param {Function} handleLinkPress - akcja do przycisku generowania avatara
 */
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
  // Pobieramy język i tłumaczenia
  const { lang } = useSettingsStore();
  const t = SettingsText[lang];

  // Mapowanie na stałe teksty (wersja, o aplikacji)
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

        {/* Jeśli akcja jest mniejsza niż 5: edycja danych */}
        {selectedFunction < 5 ? (
          <div className="space-y-4">
            <label className="block font-medium">{t.info[selectedFunction]}</label>

            {/* Przycisk do avatara tylko w przypadku edycji zdjęcia (4) */}
            {selectedFunction === 4 && (
              <Button type="button" variant="link" onClick={handleLinkPress}>
                {t.avatarGenerator || "Kliknij tutaj, aby stworzyć awatara!"}
              </Button>
            )}

            {/* Pole do edycji (hasło ma typ password) */}
            <Input
              placeholder={t.namePlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type={selectedFunction === 3 ? "password" : "text"}
              autoFocus
            />
          </div>
        ) : (
          // Jeśli akcja to info/wersja: tylko tekst
          <div className="py-4">{textMap[selectedFunction] || null}</div>
        )}

        {/* Przyciski dolne modala */}
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            {t.cancel || "Anuluj"}
          </Button>

          {/* Przycisk zapisz tylko jeśli funkcja dotyczy edycji */}
          {selectedFunction < 5 && (
            <Button onClick={updateButton}>{t.save}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
