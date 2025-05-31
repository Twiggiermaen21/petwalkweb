import { create } from 'zustand'
import { API_URL } from "@/lib/api"

export const usePhotoStore = create((set) => ({
    isLoading: false,
    photos: [],
    page: null,
    totalPages: null,
    isLoading: null,
    isLoadingMore: null,
    pageNumber: 1,
    refreshing: false,
    getPhotos: async (pageNumber, refreshing, token) => {
        if (refreshing) set({ refreshing: true });
        else if (pageNumber > 1) set({ isLoadingMore: true });
        else set({ isLoading: true });

        try {
            const response = await fetch(`${API_URL}/photo?page=${pageNumber}&limit=18`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch walks");

            set((state) => ({
                photos: pageNumber === 1 ? data.photos : [...(state.photos || []), ...data.photos],
                page: data.currentPage,
                totalPages: data.totalPages,
                isLoading: false,
                refreshing: false,
                isLoadingMore: false,
            }));

            return { success: true };

        } catch (error) {
            set({ isLoading: false, isLoadingMore: false, refreshing: false });
            return { success: false, error: error.message };
        }
    },
    uploadImage: async (token, res, user) => {
        set({ isLoading: true, });
        try {
            console.log("Image w store:", res.uri);
            console.log("Image64 w store:", res.base64);

            const image = res.uri;
            const imageBase64 = res.base64;
            let imageDataUrl = null;
            if (image && imageBase64) {
                const uriParts = image.split(".");
                const fileType = uriParts[uriParts.length - 1];
                const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
                imageDataUrl = `data:${imageType};base64,${imageBase64}`;
            }


            const response = await fetch(`${API_URL}/photo/upload-image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body:
                    JSON.stringify({
                        image: imageDataUrl,
                        user
                    })
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");
            set({ isLoading: false });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }

    },
    deletePhoto: async (id, token) => {
        set({ isLoading: true, });
        try {
            const response = await fetch(`${API_URL}/photo/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ isLoading: false });
            const data = await response.json();
            return { success: response.ok, error: data.message };
        } catch (err) {
            set({ isLoading: false });
            return { success: false, error: err.message };
        }
    }
}));