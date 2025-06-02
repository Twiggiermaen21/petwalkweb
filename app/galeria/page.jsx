"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingStore";
import { usePhotoStore } from "@/store/photoStore";
import { useAuthStore } from "@/store/authStore";
import GalleryText from "@/assets/lang/Gallery.text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Download, ChevronLeft } from "lucide-react";

export default function GalleryScreen() {
  const { lang, color } = useSettingsStore();
  const t = GalleryText[lang];
  const { token } = useAuthStore();
  const { photos, page, totalPages, isLoadingMore, refreshing, getPhotos, deletePhoto } = usePhotoStore();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async (pageNumber = 1, refreshing = false) => {
    const result = await getPhotos(pageNumber, refreshing, token);
    if (!result.success) toast.error(result.error || t.error || "Błąd");
  };

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line
  }, [token]);

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      fetchData(page + 1);
    }
  };

  const handleRefresh = async () => {
    await fetchData(1, true);
  };

  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;
    if (!window.confirm(t.deleteMessage)) return;
    const result = await deletePhoto(selectedPhoto._id, token);
    if (!result.success) toast.error(result.error || t.error || "Błąd");
    else {
      toast.success(t.deletePhoto || "Zdjęcie usunięte!");
      setModalVisible(false);
      fetchData(1, true);
    }
  };

  const handleDownload = async () => {
    if (!selectedPhoto) return;
    try {
      // Pobierz plik jako BLOB – przeglądarka nie otworzy wtedy podglądu, tylko pobierze
      const response = await fetch(selectedPhoto.photo);
      if (!response.ok) throw new Error("Błąd pobierania zdjęcia.");
      const blob = await response.blob();

      // Stwórz tymczasowy URL do pobrania
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "photo.jpg"; // Możesz tu dynamicznie ustawić nazwę, np. extracted z URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t.downloadSuccess || "Zdjęcie pobrane!");
    } catch (error) {
      toast.error(t.downloadError || "Błąd pobierania zdjęcia.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">{t.galleryTitle}</h2>
      {/* Grid z obrazkami */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.length === 0 && !refreshing && (
          <div className="col-span-full text-gray-400 text-center py-8">{t.noPhoto}</div>
        )}
        {photos.map((item) => (
          <button
            key={item._id}
            className="aspect-square rounded-xl overflow-hidden relative group border-2 border-transparent hover:border-primary transition"
            onClick={() => {
              setSelectedPhoto(item);
              setModalVisible(true);
            }}
          >
            <img
              src={item.photo}
              alt="Zdjęcie"
              className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
              draggable={false}
            />
          </button>
        ))}
      </div>
      {/* Paginacja */}
      {photos.length > 0 && page < totalPages && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 rounded-xl shadow transition-all"
          >
            {t.loadMore || "Załaduj więcej"}
          </Button>
        </div>
      )}
      {/* Odświeżanie */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="secondary"
        >
          {t.refresh || "Odśwież"}
        </Button>
      </div>

      {/* MODAL z wybranym zdjęciem */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="max-w-lg w-full flex flex-col items-center p-0 bg-black">
          <DialogTitle className="sr-only">{t.photoDetails || "Szczegóły zdjęcia"}</DialogTitle>
          {selectedPhoto && (
            <>
              <div className="w-full flex justify-between p-4">
                <Button
                  variant="ghost"
                  onClick={() => setModalVisible(false)}
                  size="icon"
                  className="text-white"
                  aria-label={t.close || "Zamknij"}
                >
                  <ChevronLeft size={32} />
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleDownload}
                    size="icon"
                    className="text-white"
                    aria-label={t.download || "Pobierz"}
                  >
                    <Download size={28} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDeletePhoto}
                    size="icon"
                    className="text-red-400 hover:text-red-500"
                    aria-label={t.delete || "Usuń"}
                  >
                    <Trash2 size={28} />
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full flex items-center justify-center p-2">
                <img
                  src={selectedPhoto.photo}
                  alt="Full"
                  className="rounded-xl"
                  draggable={false}
                />
              </div>
            </>
          )}
        </DialogContent>
        <DialogFooter />
      </Dialog>
    </div>
  );
}
