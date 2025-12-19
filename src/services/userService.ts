import { axiosClient } from "../shared/lib/axiosClient";

export interface UserPreferences {
    language: string;
    notifications: {
        scholarshipUpdates: boolean;
        postStatus: boolean;
        reminders: boolean;
        emailNotifications: boolean;
        pushNotifications: boolean;
    };
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    profile: {
        educationLevel?: string;
        major?: string;
        gpa?: number;
        preferredCountries?: string[];
        country?: string;
        avatar?: string;
    };
    preferences?: UserPreferences;
    documents?: any[];
    bookmarks?: any[];
}

export const userService = {
    getProfile: async () => {
        const response = await axiosClient.get<{ data: { user: UserProfile } }>("/users/me");
        return response.data.data.user;
    },

    updateProfile: async (data: Partial<{
        name: string;
        phone: string;
        profile: any;
        preferences: any;
    }>) => {
        const response = await axiosClient.put<{ data: { user: UserProfile } }>("/users/me", data);
        return response.data.data.user;
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const response = await axiosClient.post("/users/me/change-password", {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    deleteAccount: async (password?: string) => {
        const response = await axiosClient.delete("/users/me", { data: { password } });
        return response.data;
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "image");

        const response = await axiosClient.post<{ status: "success", data: { url: string } }>("/uploads/local", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
};
