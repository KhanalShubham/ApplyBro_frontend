/**
 * Document management service
 * Handles document upload, retrieval, and status polling
 */

import { axiosClient } from '@/shared/lib/axiosClient';
import {
    Document,
    DocumentUploadResponse,
    DocumentsResponse,
    DocumentStatusResponse,
    DocumentType,
    ParsedData
} from '@/types/document';

export const documentService = {
    /**
     * Upload a document with progress tracking
     */
    uploadDocument: async (
        file: File,
        type: DocumentType,
        note?: string,
        onUploadProgress?: (progressEvent: any) => void
    ): Promise<DocumentUploadResponse> => {
        // Map document type to documentType category for backend
        const documentTypeMap: Record<DocumentType, string> = {
            '+2': 'transcript',
            'Bachelor': 'transcript',
            'IELTS': 'ielts',
            'SOP': 'sop',
            'Other': 'other'
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('documentType', documentTypeMap[type]);
        if (note) {
            formData.append('note', note);
        }

        const response = await axiosClient.post<DocumentUploadResponse>(
            '/documents/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            }
        );

        return response.data;
    },

    /**
     * Get all documents for the current user
     */
    getMyDocuments: async (): Promise<DocumentsResponse> => {
        const response = await axiosClient.get<DocumentsResponse>('/documents/my-documents');
        return response.data;
    },

    /**
     * Get a specific document by ID
     */
    getDocument: async (id: string): Promise<{ status: string; data: { document: Document } }> => {
        const response = await axiosClient.get(`/documents/${id}`);
        return response.data;
    },

    /**
     * Poll document parsing status (for async parsing)
     */
    getDocumentStatus: async (jobId: string): Promise<DocumentStatusResponse> => {
        const response = await axiosClient.get<DocumentStatusResponse>(`/documents/status/${jobId}`);
        return response.data;
    },

    /**
     * Update parsed data for a document
     */
    updateParsedData: async (
        docId: string,
        parsedData: Partial<ParsedData>
    ): Promise<{ status: string; data: { document: Document } }> => {
        const response = await axiosClient.patch(`/documents/${docId}`, { parsedData });
        return response.data;
    },

    /**
     * Delete a document
     */
    deleteDocument: async (docId: string): Promise<{ status: string; message: string }> => {
        const response = await axiosClient.delete(`/documents/${docId}`);
        return response.data;
    },

    /**
     * Get document file URL for viewing
     */
    getDocumentUrl: (document: Document): string => {
        if (document.url) {
            // If URL is absolute, return as-is
            if (document.url.startsWith('http')) {
                return document.url;
            }
            // If relative, prepend backend URL
            return `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4000'}${document.url}`;
        }
        // Fallback to filePath
        if (document.filePath) {
            return `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4000'}${document.filePath}`;
        }
        return '';
    },
};
