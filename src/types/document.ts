/**
 * Document type definitions for student document management
 */

export type DocumentType = '+2' | 'Bachelor' | 'IELTS' | 'SOP' | 'Other';

export type DocumentStatus = 'pending' | 'parsing' | 'parsed' | 'verified' | 'rejected' | 'error';

export interface ParsedData {
    // Academic transcript fields
    level?: string;
    gpa?: number;
    percentage?: number;
    stream?: string;
    major?: string;
    university?: string;
    graduationYear?: number;

    // IELTS fields
    ieltsOverall?: number;
    ieltsListening?: number;
    ieltsReading?: number;
    ieltsWriting?: number;
    ieltsSpeaking?: number;
    ieltsTestDate?: string;

    // SOP fields
    sopWordCount?: number;
    sopKeywords?: string[];

    // Common fields
    studentName?: string;
    dateIssued?: string;

    // Raw extracted text (for debugging)
    rawText?: string;
}

export interface Document {
    _id: string;
    userId: string;
    type: DocumentType;
    fileName: string;
    originalName: string;
    filePath: string;
    url?: string;
    fileSize?: number;
    mimeType?: string;
    status: DocumentStatus;
    parsedData?: ParsedData;
    parsingError?: string;
    note?: string;
    uploadedAt: string;
    updatedAt: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    rejectionReason?: string;
    adminNote?: string;
}

export interface DocumentUploadResponse {
    status: 'success';
    message: string;
    data: {
        document: Document;
        verificationStatus: string;
    };
}

export interface DocumentsResponse {
    status: 'success';
    data: {
        documents: Document[];
        pagination?: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface DocumentStatusResponse {
    status: 'success';
    data: {
        status: DocumentStatus;
        parsedData?: ParsedData;
        error?: string;
    };
}
