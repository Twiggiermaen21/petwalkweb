"use client";

// --- Hooki i zależności ---
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useDogStore } from "@/store/dogStore";
import { useSettingsStore } from "@/store/settingStore";
import AddDogText from "@/assets/lang/AddDog.text";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormItem,
    FormDescription,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Image as ImageIcon, ChevronLeft, PlusCircle } from "lucide-react";
import { useRef, useState } from "react";

// --- Schemat walidacji Zod ---
const dogSchema = z.object({
    name: z.string().min(1, "Podaj imię psa"),
    breed: z.string().optional(),
    weight: z.number().min(0).max(100),
    age: z.number().min(0).max(20),
    height: z.number().min(0).max(100),
    image: z.any().optional(),
});

export default function AddDog() {
    const { token } = useAuthStore(); // Token JWT użytkownika
    const { addDog } = useDogStore(); // Funkcja do dodania psa (z store'u Zustand)
    const { lang } = useSettingsStore(); // Wybrany język aplikacji
    const t = AddDogText[lang]; // Teksty przetłumaczone wg języka
    const router = useRouter(); // Hook nawigacyjny Next.js

    // --- Stan lokalny obrazu (podgląd i base64) ---
    const [image, setImage] = useState(null); // Lokalny URL dla podglądu
    const [imageBase64, setImageBase64] = useState(null); // Base64 do przesłania
    const fileInput = useRef(null); // Referencja do ukrytego inputa typu file

    // --- Inicjalizacja formularza z walidacją Zod ---
    const form = useForm({
        resolver: zodResolver(dogSchema),
        defaultValues: {
            name: "",
            breed: "",
            weight: 0,
            age: 0,
            height: 0,
            image: null,
        },
        mode: "onChange",
    });

    /**
     * Obsługuje wybór pliku obrazu i konwertuje go do base64.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Tworzenie podglądu
        setImage(URL.createObjectURL(file));

        // Konwersja na base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result.split(",")[1]);
            form.setValue("image", file); // Zapis do formularza
        };
        reader.readAsDataURL(file);
    };

    /**
     * Wywołuje kliknięcie ukrytego inputa pliku.
     */
    const triggerFileSelect = () => fileInput.current?.click();

    /**
     * Obsługuje wysyłkę formularza: waliduje dane, wysyła je, obsługuje komunikaty i resetuje stan.
     */
    const onSubmit = async (data) => {
        if (!data.name) {
            toast.error("Podaj imię psa!");
            return;
        }
        try {
            form.clearErrors();
            form.setError("root", { message: "" });

            const result = await addDog(
                token,
                data.name,
                data.age,
                data.breed,
                image, // URL do podglądu (tylko lokalnie)
                data.height,
                data.weight,
                imageBase64 // faktyczny plik do zapisu w bazie
            );

            if (!result.success) {
                toast.error(result.error || "Błąd dodawania psa");
            } else {
                toast.success("Twój pies został dodany!");
                form.reset();
                setImage(null);
                setImageBase64(null);
                router.push("/profil"); // przekierowanie do profilu
            }
        } catch (error) {
            toast.error(error.message || "Coś poszło nie tak");
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto py-8">
            {/* Powrót */}
            <Button
                variant="ghost"
                className="mb-3 flex items-center gap-2"
                onClick={() => router.back()}
            >
                <ChevronLeft size={20} /> {t.backButton}
            </Button>

            {/* Formularz */}
            <Form {...form}>
                <form
                    className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    {/* Nagłówek */}
                    <div>
                        <h2 className="text-2xl font-bold">{t.title}</h2>
                        <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
                    </div>

                    {/* Pole: imię */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.nameLabel}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder={t.namePlaceholder} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pole: rasa */}
                    <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.breedLabel}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder={t.breedPlaceholder} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Suwak: waga */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.weightLabel(field.value)}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={([val]) => field.onChange(val)}
                                    />
                                </FormControl>
                                <div className="text-right text-xs text-gray-500">{field.value} kg</div>
                            </FormItem>
                        )}
                    />

                    {/* Suwak: wiek */}
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.ageLabel(field.value)}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={20}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={([val]) => field.onChange(val)}
                                    />
                                </FormControl>
                                <div className="text-right text-xs text-gray-500">{field.value} {t.age2 || "lat"}</div>
                            </FormItem>
                        )}
                    />

                    {/* Suwak: wysokość */}
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.heightLabel(field.value)}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={([val]) => field.onChange(val)}
                                    />
                                </FormControl>
                                <div className="text-right text-xs text-gray-500">{field.value} cm</div>
                            </FormItem>
                        )}
                    />

                    {/* Upload zdjęcia */}
                    <FormItem>
                        <FormLabel>{t.imageLabel}</FormLabel>
                        <FormControl>
                            <div
                                className="border-dashed border-2 rounded-xl flex items-center justify-center py-6 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition min-h-[120px]"
                                onClick={triggerFileSelect}
                                tabIndex={0}
                                role="button"
                                aria-label={t.imagePlaceholder}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInput}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Podgląd zdjęcia"
                                        className="max-h-32 max-w-full rounded-lg object-cover shadow"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon size={40} className="text-gray-400 mb-2" />
                                        <span className="text-gray-500 text-sm">{t.imagePlaceholder}</span>
                                    </div>
                                )}
                            </div>
                        </FormControl>
                        <FormDescription>{t.imageDesc}</FormDescription>
                    </FormItem>

                    {/* Przycisk wysyłki */}
                    <Button
                        type="submit"
                        className="w-full flex items-center gap-2 justify-center"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <PlusCircle size={18} />
                        )}
                        {t.uploadButton}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
