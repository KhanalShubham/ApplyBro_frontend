
export interface AdminAction {
    _id: string;
    actionType: string;
    targetType: string;
    targetId: string;
    targetLabel: string;
    details?: Record<string, any> | string;
    metadata?: Record<string, any>;
    admin: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface AdminActionsResponse {
    status: "success";
    data: {
        actions: AdminAction[];
        pagination: Pagination;
    };
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: "student" | "admin";
    avatar?: string;
    createdAt: string;
    // Add other fields as per actual backend response if needed
    educationLevel?: string;
    major?: string;
    gpa?: number;
    preferredCountries?: string[];
}

export interface AdminUsersResponse {
    status: "success";
    data: {
        users: AdminUser[];
        pagination: Pagination;
    };
}

export interface DocumentVerificationRequest {
    status: "verified" | "rejected";
    adminNote?: string;
    userId?: string; // Optional userId for documents from User.documents array
}

export interface Document {
    _id: string;
    docId?: string; // Backend may return docId instead of _id
    userId?: string; // User ID for documents from User.documents array
    user: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    name: string;
    type: string;
    url: string; // or path
    status: "pending" | "verified" | "rejected";
    uploadedAt: string;
    rejectionReason?: string;
    adminNote?: string; // Backend returns adminNote
}

export interface DocumentsResponse {
    status: "success";
    data: {
        documents: Document[];
        pagination: Pagination;
    };
}

export interface PostModerationRequest {
    status: "approved" | "declined";
    adminNote?: string;
}

export interface Post {
    _id: string;
    author: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    title: string;
    body?: string; // Backend returns 'body'
    content?: string; // Keep for backward compatibility
    category: string;
    status: "pending" | "approved" | "declined" | "rejected" | "removed";
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    declineReason?: string;
    rejectionReason?: string; // Keep for backward compatibility
    tags?: string[];
    country?: string;
    images?: Array<{ url: string; alt?: string }>;
}

export interface PostsResponse {
    status: "success";
    data: {
        posts: Post[];
        pagination: Pagination;
    };
}

export interface AdminAnalyticsResponse {
    status: "success";
    data: {
        totalUsers: number;
        activeScholarships: number;
        documentsVerified: number;
        communityPosts: number;
        userGrowth: { month: string; users: number }[];
        documentStatus: { status: string; count: number }[];
        scholarshipApplications: { scholarship: string; applications: number }[];
        engagement: { day: string; posts: number; likes: number; comments: number }[];
        usersByCountry: { country: string; users: number; percentage: number }[];
    };
}
