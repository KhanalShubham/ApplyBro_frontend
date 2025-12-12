import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { DocumentType } from '@/types/document';
import { validateFile, formatFileSize } from '@/shared/lib/fileValidation';
import { documentService } from '@/services/documentService';
import { toast } from 'sonner';

interface DocumentUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadSuccess?: () => void;
}

export function DocumentUploadModal({ open, onOpenChange, onUploadSuccess }: DocumentUploadModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<DocumentType>('+2');
    const [note, setNote] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (file: File) => {
        const validation = validateFile(file);

        if (!validation.valid) {
            setErrorMessage(validation.error || 'Invalid file');
            setUploadStatus('error');
            return;
        }

        setSelectedFile(file);
        setErrorMessage('');
        setUploadStatus('idle');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }

        try {
            setUploading(true);
            setUploadStatus('uploading');
            setUploadProgress(0);

            const response = await documentService.uploadDocument(
                selectedFile,
                documentType,
                note,
                (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                }
            );

            setUploadStatus('success');
            toast.success('Upload successful — parsing started');

            // Reset form after short delay
            setTimeout(() => {
                resetForm();
                onOpenChange(false);
                onUploadSuccess?.();
            }, 1500);

        } catch (error: any) {
            console.error('Upload failed:', error);
            setUploadStatus('error');
            setErrorMessage(error.response?.data?.message || 'Upload failed. Please try again.');
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setDocumentType('+2');
        setNote('');
        setUploadProgress(0);
        setUploadStatus('idle');
        setErrorMessage('');
    };

    const handleClose = () => {
        if (!uploading) {
            resetForm();
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Document Type Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="documentType">Document Type *</Label>
                        <Select
                            value={documentType}
                            onValueChange={(value: string) => setDocumentType(value as DocumentType)}
                            disabled={uploading}
                        >
                            <SelectTrigger id="documentType">
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+2">+2 Transcript</SelectItem>
                                <SelectItem value="Bachelor">Bachelor Transcript</SelectItem>
                                <SelectItem value="IELTS">IELTS Score Report</SelectItem>
                                <SelectItem value="SOP">Statement of Purpose</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Upload Area */}
                    <div className="space-y-2">
                        <Label>File *</Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : selectedFile
                                        ? 'border-green-500 bg-green-50'
                                        : errorMessage
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {selectedFile ? (
                                <div className="space-y-2">
                                    <FileText className="h-12 w-12 mx-auto text-green-600" />
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedFile(null)}
                                        disabled={uploading}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                                    <div>
                                        <p className="font-medium">Drag and drop your file here</p>
                                        <p className="text-sm text-gray-600">or</p>
                                    </div>
                                    <label htmlFor="file-input">
                                        <Button variant="outline" asChild>
                                            <span>Choose File</span>
                                        </Button>
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileInput}
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-gray-500">
                                        PDF, JPG, or PNG (max 5 MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        {errorMessage && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>

                    {/* Optional Note */}
                    <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                            id="note"
                            placeholder="Add any additional information about this document..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={uploading}
                            rows={3}
                        />
                    </div>

                    {/* Upload Progress */}
                    {uploadStatus === 'uploading' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    {/* Success Message */}
                    {uploadStatus === 'success' && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-green-800">
                                Upload successful! Document is being processed.
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading || uploadStatus === 'success'}
                        style={{ backgroundColor: '#007BFF' }}
                    >
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
