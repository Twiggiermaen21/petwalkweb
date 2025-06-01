"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
    const { logout } = useAuthStore();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setOpen(false);
        toast.success("Wylogowano pomyślnie");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
