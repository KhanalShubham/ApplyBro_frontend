
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
}

export interface Document {
    _id: string;
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
    content: string;
    category: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    rejectionReason?: string;
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
