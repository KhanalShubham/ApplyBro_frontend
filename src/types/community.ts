/**
 * Community module type definitions
 */

export interface PostImage {
  url: string;
  alt?: string;
}

export type PostStatus = 'pending' | 'approved' | 'declined' | 'removed';
export type PostCategory = 'Success Story' | 'Tips' | 'Guidance' | 'Other';

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  title: string;
  body: string;
  images: PostImage[];
  tags: string[];
  country: string;
  category: PostCategory;
  status: PostStatus;
  declineReason?: string;
  adminNote?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  likesCount: number;
  commentsCount: number;
  reportedCount?: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean; // Client-side computed
}

export interface Comment {
  _id: string;
  postId: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  body: string;
  status: 'visible' | 'reported' | 'removed';
  reportedCount?: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean; // Client-side computed
  likesCount?: number;
}

export interface Report {
  _id: string;
  reporter: {
    _id: string;
    name: string;
    email: string;
  };
  resourceType: 'post' | 'comment';
  resourceId: string;
  reason: string;
  details?: string;
  status: 'open' | 'reviewed' | 'resolved';
  createdAt: string;
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  actionTaken?: 'deleted' | 'warning' | 'none' | 'hidden';
  resource?: Post | Comment; // Populated resource
}

export interface CreatePostRequest {
  title: string;
  body: string;
  images?: PostImage[];
  tags?: string[];
  country?: string;
  category?: PostCategory;
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  images?: PostImage[];
  tags?: string[];
  country?: string;
  category?: PostCategory;
}

export interface CreateCommentRequest {
  body: string;
}

export interface ReportRequest {
  reason: string;
  details?: string;
}

export interface PostsResponse {
  status: 'success';
  data: {
    posts: Post[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PostResponse {
  status: 'success';
  data: {
    post: Post;
  };
}

export interface CommentsResponse {
  status: 'success';
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CommentResponse {
  status: 'success';
  data: {
    comment: Comment;
  };
}

export interface ReportsResponse {
  status: 'success';
  data: {
    reports: Report[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface LikeResponse {
  status: 'success';
  message: string;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
}

