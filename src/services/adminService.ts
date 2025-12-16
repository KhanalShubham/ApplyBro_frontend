
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
        return axiosClient.get<DocumentsResponse>(`/admin/documents/all`, { params });
    },



    verifyDocument: async (docId: string, data: DocumentVerificationRequest) => {
        return axiosClient.put(`/admin/documents/${docId}/verify`, data);
    },

    // Post Moderation
    getPosts: async (page = 1, pageSize = 20, search = "", status?: string) => {
        const params: any = { page, pageSize };
        // For admins, use the regular posts endpoint which shows all posts when status is 'all' or undefined
        // Pass status only if it's a specific status (not 'all')
        if (status && status !== "all") {
            params.status = status;
        }
        // Use the regular posts endpoint which respects admin role and shows all posts when no status filter
        return axiosClient.get<PostsResponse>(`/posts`, { params });
    },

    getPendingPosts: async (page = 1, pageSize = 20) => {
        return axiosClient.get<PostsResponse>(`/admin/posts/pending`, {
            params: { page, pageSize }
        });
    },

    approvePost: async (postId: string, messageToUser?: string) => {
        return axiosClient.post(`/admin/posts/${postId}/approve`, { messageToUser });
    },

    declinePost: async (postId: string, declineReason: string, adminNote?: string) => {
        return axiosClient.post(`/admin/posts/${postId}/decline`, { declineReason, adminNote });
    },

    deletePost: async (postId: string) => {
        return axiosClient.delete(`/admin/posts/${postId}`);
    },

    moderatePost: async (postId: string, data: PostModerationRequest) => {
        // Backward compatibility - use new endpoints
        if (data.status === 'approved') {
            return adminService.approvePost(postId, data.adminNote);
        } else if (data.status === 'declined') {
            return adminService.declinePost(postId, data.adminNote || 'No reason provided', data.adminNote);
        }
        return axiosClient.put(`/admin/posts/${postId}/moderate`, data);
    },

    // Comment Moderation
    removeComment: async (commentId: string, reason?: string) => {
        return axiosClient.post(`/admin/comments/${commentId}/remove`, { reason });
    },

    // Reports
    getReports: async (status: 'open' | 'reviewed' | 'resolved' | 'all' = 'open', page = 1, pageSize = 20) => {
        return axiosClient.get(`/admin/reports`, {
            params: { status, page, pageSize }
        });
    },

    resolveReport: async (reportId: string, actionTaken: string, status: 'reviewed' | 'resolved' = 'resolved') => {
        return axiosClient.post(`/admin/reports/${reportId}/resolve`, { actionTaken, status });
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

    uploadFile: async (file: File, type: "image" | "video" | "document" = "image") => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        // Using local upload endpoint as per request for dev/local
        return axiosClient.post<{ status: "success", data: { url: string } }>(`/uploads/local`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
};
