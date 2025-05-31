'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useDogStore } from "@/store/dogStore";
import { useSettingsStore } from "@/store/settingStore";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import ProfileHeader from "@/components/PetWalkComponents/ProfileHeader";
import ProfileText from "@/assets/lang/Profile.text";
import noDog from "@/assets/ImagesPetWalk/noDog.jpeg";
import { toast } from "sonner";

export default function ProfileScreen() {
    const router = useRouter();
    const { token } = useAuthStore();
    const { lang } = useSettingsStore();
    const { dogsFromDB, getDogs, isLoading, DeletedDogId } = useDogStore();
    const t = ProfileText[lang];

    const [refreshing, setRefreshing] = useState(false);

    const GetDogsFromDataBase = async () => {
        const result = await getDogs(token);
        if (!result.success) toast.error(result.error || "Error");
    };

    useEffect(() => {
        if (token) GetDogsFromDataBase();
        // eslint-disable-next-line
    }, [token]);

    const handleDeleteDog = async (dogId) => {
        const result = await DeletedDogId(token, dogId);
        if (!result.success) toast.error(result.error || "Error");
        else toast.success(t.Success || "Sukces", { description: t.DeleteDog });
        handleRefresh();
    };

    const confirmDelete = (dogId) => {
        if (window.confirm(`${t.deleteMessage}\n\n${t.confirmDelete}?`)) {
            handleDeleteDog(dogId);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await GetDogsFromDataBase();
        setRefreshing(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <ProfileHeader />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-center tracking-tight">
                    {t.Yourpets || "Twoje zwierzaki"}
                </h2>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => router.push('/addDog')}
                >
                    <PlusCircle size={20} /> {t.addDog || "Dodaj psa"}
                </Button>
            </div>
            {/* Lista psów */}
            {isLoading || refreshing ? (
                <div className="flex justify-center my-12">
                    <Loader2 className="animate-spin text-primary" size={36} />
                </div>
            ) : !dogsFromDB || dogsFromDB.length === 0 ? (
                <div className="text-center text-gray-400 py-12 text-lg">
                    {t.noDogs || "Brak psów do wyświetlenia."}
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {dogsFromDB.map((item) => (
                        <li
                            key={item._id}
                            className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-md rounded-2xl flex flex-col sm:flex-row items-center gap-5 p-4 relative group hover:shadow-xl transition-shadow"
                        >
                            <div className="relative">
                                <Image
                                    src={item.dogImage || noDog}
                                    alt={item.name}
                                    width={88}
                                    height={88}
                                    className="rounded-lg object-cover border border-gray-200 dark:border-gray-700 aspect-square"
                                    style={{ width: 88, height: 88 }}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="font-semibold text-lg leading-tight mb-1">
                                    {item.name}
                                </h3>
                                <dl className="text-sm text-gray-600 dark:text-gray-300">
                                    <div><dt className="inline">{t.breed}:</dt> <dd className="inline ml-1">{item.breed || "---"}</dd></div>
                                    <div><dt className="inline">{t.age}:</dt> <dd className="inline ml-1">{item.age} {t.age2 || "lat(a)"}</dd></div>
                                    <div><dt className="inline">{t.weight}:</dt> <dd className="inline ml-1">{item.weight} kg</dd></div>
                                    <div><dt className="inline">{t.height}:</dt> <dd className="inline ml-1">{item.height} cm</dd></div>
                                </dl>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Usuń psa"
                                aria-label="Usuń psa"
                                className="text-red-600 hover:bg-red-50 absolute top-2 right-2 sm:static sm:ml-2 transition-opacity group-hover:opacity-100 opacity-70"
                                onClick={() => confirmDelete(item._id)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <Trash2 size={22} />
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex justify-end mt-10">
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <>
                            <Loader2 className="animate-spin" size={18} /> {t.refreshing || "Odświeżanie..."}
                        </>
                    ) : (
                        t.refresh || "Odśwież"
                    )}
                </Button>
            </div>
        </div>
    );
}
