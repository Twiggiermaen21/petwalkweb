"use client";

// --- Importy bibliotek i komponentów ---
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

/**
 * Komponent przycisku do wylogowania użytkownika.
 * Po kliknięciu pojawia się dialog z potwierdzeniem.
 */
export default function LogoutButton() {
    const { logout } = useAuthStore(); // funkcja do wylogowania użytkownika ze stanu globalnego
    const [open, setOpen] = useState(false); // stan kontrolujący otwarcie modala

    /**
     * Funkcja wykonująca wylogowanie.
     * Zamykany jest modal i wyświetlane powiadomienie.
     */
    const handleLogout = () => {
        logout(); // wylogowanie użytkownika
        setOpen(false); // zamknięcie modala
        toast.success("Wylogowano pomyślnie"); // komunikat sukcesu
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger otwierający dialog */}
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="mt-6 w-full flex items-center gap-2"
                    aria-label="Wyloguj"
                >
                    <LogOut size={18} />
                    Wyloguj
                </Button>
            </DialogTrigger>

            {/* Treść modala potwierdzającego wylogowanie */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Wylogowanie</DialogTitle>
                </DialogHeader>
                <p className="py-2">Czy na pewno chcesz się wylogować?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Anuluj
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                        Wyloguj
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
