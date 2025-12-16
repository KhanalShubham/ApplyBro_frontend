/**
 * Community service - API calls for posts and comments
 */

import { axiosClient } from '@/shared/lib/axiosClient';
import {
  Post,
  Comment,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  ReportRequest,
  PostsResponse,
  PostResponse,
  CommentsResponse,
  CommentResponse,
  LikeResponse,
  ReportsResponse
} from '@/types/community';

export const communityService = {
  // ========== POSTS ==========
  
  /**
   * Get all posts (approved only for non-admins)
   */
  getPosts: async (params?: {
    status?: string;
    category?: string;
    tag?: string;
    country?: string;
    sort?: 'latest' | 'popular';
    page?: number;
    pageSize?: number;
  }): Promise<PostsResponse> => {
    const response = await axiosClient.get<PostsResponse>('/posts', { params });
    return response.data;
  },

  /**
   * Get current user's posts (all statuses)
   */
  getMyPosts: async (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PostsResponse> => {
    const response = await axiosClient.get<PostsResponse>('/posts/me', { params });
    return response.data;
  },

  /**
   * Get single post by ID
   */
  getPost: async (id: string): Promise<PostResponse> => {
    const response = await axiosClient.get<PostResponse>(`/posts/${id}`);
    return response.data;
  },

  /**
   * Create a new post
   */
  createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
    const response = await axiosClient.post<PostResponse>('/posts', data);
    return response.data;
  },

  /**
   * Update a post (author only)
   */
  updatePost: async (id: string, data: UpdatePostRequest): Promise<PostResponse> => {
    const response = await axiosClient.put<PostResponse>(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a post (author or admin)
   */
  deletePost: async (id: string): Promise<{ status: 'success'; message: string }> => {
    const response = await axiosClient.delete(`/posts/${id}`);
    return response.data;
  },

  /**
   * Toggle like on a post
   */
  toggleLike: async (id: string): Promise<LikeResponse> => {
    const response = await axiosClient.post<LikeResponse>(`/posts/${id}/like`);
    return response.data;
  },

  /**
   * Report a post
   */
  reportPost: async (id: string, data: ReportRequest): Promise<{ status: 'success'; message: string; data: { reportId: string } }> => {
    const response = await axiosClient.post(`/posts/${id}/report`, data);
    return response.data;
  },

  // ========== COMMENTS ==========

  /**
   * Get comments for a post
   */
  getComments: async (postId: string, params?: {
    page?: number;
    pageSize?: number;
  }): Promise<CommentsResponse> => {
    const response = await axiosClient.get<CommentsResponse>(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: string, data: CreateCommentRequest): Promise<CommentResponse> => {
    const response = await axiosClient.post<CommentResponse>(`/posts/${postId}/comments`, data);
    return response.data;
  },

  /**
   * Update a comment (author only)
   */
  updateComment: async (id: string, data: CreateCommentRequest): Promise<CommentResponse> => {
    const response = await axiosClient.put<CommentResponse>(`/comments/${id}`, data);
    return response.data;
  },

  /**
   * Delete a comment (author or admin)
   */
  deleteComment: async (id: string): Promise<{ status: 'success'; message: string }> => {
    const response = await axiosClient.delete(`/comments/${id}`);
    return response.data;
  },

  /**
   * Toggle like on a comment
   */
  toggleCommentLike: async (id: string): Promise<LikeResponse> => {
    const response = await axiosClient.post<LikeResponse>(`/comments/${id}/like`);
    return response.data;
  },

  /**
   * Report a comment
   */
  reportComment: async (id: string, data: ReportRequest): Promise<{ status: 'success'; message: string; data: { reportId: string } }> => {
    const response = await axiosClient.post(`/comments/${id}/report`, data);
    return response.data;
  }
};



