
import { axiosClient } from "@/shared/lib/axiosClient";
import { AdminActionsResponse, AdminUsersResponse, DocumentVerificationRequest, PostModerationRequest, DocumentsResponse, PostsResponse } from "@/types/admin";

export const adminService = {
    // Admin Actions (Audit Log)
    getActions: async (page = 1, pageSize = 20) => {
        return axiosClient.get<AdminActionsResponse>(`/admin/actions`, {
            params: { page, pageSize },
        });
    },

    // User Management
    getUsers: async (page = 1, pageSize = 20, search = "", role?: "student" | "admin" | "all") => {
        const params: any = { page, pageSize, search };
        if (role && role !== "all") {
            params.role = role;
        }
        return axiosClient.get<AdminUsersResponse>(`/admin/users`, {
            params,
        });
    },

    updateUserRole: async (userId: string, role: "student" | "admin") => {
        return axiosClient.put(`/admin/users/${userId}/role`, { role });
    },

    deleteUser: async (userId: string) => {
        return axiosClient.delete(`/admin/users/${userId}`);
    },

    // Document Verification
    getDocuments: async (page = 1, pageSize = 20, search = "", status?: string) => {
        const params: any = { page, pageSize, search };
        if (status && status !== "all") {
            params.status = status;
        }
        return axiosClient.get<DocumentsResponse>(`/admin/documents`, { params });
    },



    verifyDocument: async (docId: string, data: DocumentVerificationRequest) => {
        return axiosClient.put(`/admin/documents/${docId}/verify`, data);
    },

    // Post Moderation
    getPosts: async (page = 1, pageSize = 20, search = "", status?: string) => {
        const params: any = { page, pageSize, search };
        if (status && status !== "all") {
            params.status = status;
        }
        return axiosClient.get<PostsResponse>(`/admin/posts`, { params });
    },



    moderatePost: async (postId: string, data: PostModerationRequest) => {
        return axiosClient.put(`/admin/posts/${postId}/moderate`, data);
    },

    // Analytics
    getAnalytics: async () => {
        return axiosClient.get(`/admin/analytics`);
    },

    // Scholarship Management
    getScholarships: async (page = 1, pageSize = 20, search = "", status?: string, adminOnly: boolean = false) => {
        const params: any = { page, pageSize, search };
        if (status && status !== "all") {
            params.status = status;
        }
        if (adminOnly) {
            params.adminOnly = true;
        }
        return axiosClient.get(`/scholarships`, { params });
    },

    createScholarship: async (data: any) => {
        return axiosClient.post(`/scholarships`, data);
    },

    updateScholarship: async (id: string, data: any) => {
        return axiosClient.put(`/scholarships/${id}`, data);
    },

    deleteScholarship: async (id: string) => {
        return axiosClient.delete(`/scholarships/${id}`);
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "image"); // Backend only accepts "image", "document", or "profile"
        // Using local upload endpoint as per request for dev/local
        return axiosClient.post<{ status: "success", data: { url: string } }>(`/uploads/local`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
};
