/**
 * File validation utilities
 */

export const ALLOWED_DOCUMENT_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const FILE_TYPE_MESSAGES = {
    invalid: `Unsupported file format. Upload PDF, JPG, or PNG`,
    tooLarge: `File too large — maximum allowed is ${MAX_FILE_SIZE_MB} MB`,
};

/**
 * Validate file type
 */
export const validateFileType = (file: File, allowedTypes: string[] = ALLOWED_DOCUMENT_TYPES): boolean => {
    const extension = getFileExtension(file.name);
    return allowedTypes.includes(extension.toLowerCase());
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (fileName: string): string => {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.substring(lastDot);
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file with detailed error message
 */
export const validateFile = (
    file: File,
    options: {
        allowedTypes?: string[];
        maxSizeMB?: number;
    } = {}
): { valid: boolean; error?: string } => {
    const { allowedTypes = ALLOWED_DOCUMENT_TYPES, maxSizeMB = MAX_FILE_SIZE_MB } = options;

    // Check file type
    if (!validateFileType(file, allowedTypes)) {
        return {
            valid: false,
            error: FILE_TYPE_MESSAGES.invalid,
        };
    }

    // Check file size
    if (!validateFileSize(file, maxSizeMB)) {
        return {
            valid: false,
            error: FILE_TYPE_MESSAGES.tooLarge,
        };
    }

    return { valid: true };
};
