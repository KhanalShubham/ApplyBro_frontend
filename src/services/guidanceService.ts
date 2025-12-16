import { axiosClient } from "@/shared/lib/axiosClient";

export interface GuidanceItem {
    _id: string; // Backend uses _id
    id?: string; // Frontend often uses id (map it)
    title: string;
    description: string;
    type: "article" | "video" | "test" | "faq";
    topic: string;
    thumbnail?: string;
    content?: string;
    videoUrl?: string;
    fileUrl?: string;
    duration?: string;
    readTime?: string;
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
    published: boolean;
    createdAt: string;
    isBookmarked?: boolean; // Hydrated by frontend sometimes
}

export interface SavedItem {
    _id: string;
    itemType: string;
    itemId: string;
    createdAt: string;
    details?: any; // Populated details
}

export const guidanceService = {
    // Public / User methods
    getAll: async (params?: { type?: string; topic?: string; search?: string; page?: number }) => {
        return axiosClient.get<{ status: string; data: GuidanceItem[]; total: number }>('/guidance', { params });
    },

    getById: async (id: string) => {
        return axiosClient.get<{ status: string; data: GuidanceItem }>(`/guidance/${id}`);
    },

    // Saved Items methods
    getSavedItems: async () => {
        return axiosClient.get<{ status: string; data: SavedItem[] }>('/saved');
    },

    saveItem: async (itemType: string, itemId: string) => {
        return axiosClient.post('/saved', { itemType, itemId });
    },

    unsaveItem: async (itemId: string) => {
        // Note: Backend might expect the content ID or the saved record ID. 
        // Our controller supports deletion by content ID if we pass it, but let's be sure.
        // The controller says: SavedItem.findOneAndDelete({ userId, itemId: itemId }) 
        // So yes, we pass the CONTENT ID (e.g. Guidance ID).
        return axiosClient.delete(`/saved/${itemId}`);
    },

    // Admin methods
    create: async (data: Partial<GuidanceItem>) => {
        return axiosClient.post('/guidance', data);
    },

    update: async (id: string, data: Partial<GuidanceItem>) => {
        return axiosClient.put(`/guidance/${id}`, data);
    },

    delete: async (id: string) => {
        return axiosClient.delete(`/guidance/${id}`);
    },

    // Admin specific list (for viewing unpublished)
    getAdminAll: async (params?: { type?: string; search?: string }) => {
        return axiosClient.get<{ status: string; data: GuidanceItem[] }>('/guidance/admin/all', { params });
    }
};
