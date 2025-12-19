import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DocumentUploadModal } from "../DocumentUploadModal";
import { MatchResultsList } from "../MatchResultsList";
import { documentService } from "@/services/documentService";
import { scholarshipService } from "@/services/scholarshipService";
import { Document } from "@/types/document";
import { MatchedScholarship } from "@/types/scholarshipMatch";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { formatFileSize } from "@/shared/lib/fileValidation";
import { formatDeadline } from "@/shared/lib/dateUtils";
import { ConfirmDialog } from "../ConfirmDialog";

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [matches, setMatches] = useState<MatchedScholarship[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; docId: string | null }>({ open: false, docId: null });

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await documentService.getMyDocuments();
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (docId: string) => {
    try {
      await documentService.deleteDocument(docId);
      toast.success("Document deleted successfully");
      fetchDocuments();
      setDeleteConfirm({ open: false, docId: null });
    } catch (error) {
      console.error("Failed to delete document", error);
      toast.error("Failed to delete document");
    }
  };

  const handleView = (document: Document) => {
    const url = documentService.getDocumentUrl(document);
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("Document URL not available");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      verified: { color: "bg-green-600 text-white", icon: CheckCircle, label: "Verified" },
      pending: { color: "bg-orange-600 text-white", icon: Clock, label: "Pending" },
      parsing: { color: "bg-blue-600 text-white", icon: Clock, label: "Parsing" },
      parsed: { color: "bg-green-600 text-white", icon: CheckCircle, label: "Parsed" },
      rejected: { color: "bg-red-600 text-white", icon: AlertCircle, label: "Rejected" },
      error: { color: "bg-red-600 text-white", icon: AlertCircle, label: "Error" },
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleFindMatches = async () => {
    try {
      setIsLoadingMatches(true);
      const response = await scholarshipService.getMatchedScholarships();
      setMatches(response.data.matches || []);
      setShowMatches(true);
      toast.success(`Found ${response.data.matches?.length || 0} matching scholarships!`);
    } catch (error) {
      console.error("Failed to find matches", error);
      toast.error("Failed to find scholarship matches");
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const handleBookmark = (scholarshipId: string) => {
    setBookmarkedIds(prev =>
      prev.includes(scholarshipId)
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId]
    );
    toast.success(bookmarkedIds.includes(scholarshipId) ? "Bookmark removed" : "Scholarship bookmarked");
  };

  const handleBackToDocuments = () => {
    setShowMatches(false);
  };

  if (isLoading) {
    return <Loader className="min-h-[400px]" />;
  }

  // Show match results if user clicked "Find Matches"
  if (showMatches) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToDocuments}>
            ← Back to Documents
          </Button>
        </div>
        <MatchResultsList
          matches={matches}
          isLoading={isLoadingMatches}
          onBookmark={handleBookmark}
          bookmarkedIds={bookmarkedIds}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">📁 My Documents</h1>
          <p className="text-gray-600">
            Upload and manage your academic documents for scholarship applications
          </p>
        </div>
        <div className="flex gap-2">
          {documents.length > 0 && (
            <Button
              onClick={handleFindMatches}
              disabled={isLoadingMatches}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Target className="mr-2 h-4 w-4" />
              {isLoadingMatches ? "Finding Matches..." : "Find Matches"}
            </Button>
          )}
          <Button
            onClick={() => setUploadModalOpen(true)}
            style={{ backgroundColor: "#007BFF" }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Cards */}
          {documents.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2">No documents yet</h3>
                <p className="text-gray-600 mb-4">
                  Upload your academic documents to get started with scholarship matching.
                </p>
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  style={{ backgroundColor: "#007BFF" }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`border-2 ${doc.verificationStatus === "verified" || doc.status === "verified"
                      ? "border-green-200 bg-green-50/50"
                      : doc.verificationStatus === "pending" || doc.status === "pending"
                        ? "border-orange-200 bg-orange-50/50"
                        : doc.verificationStatus === "rejected" || doc.status === "rejected"
                          ? "border-red-200 bg-red-50/50"
                          : "border-blue-200 bg-blue-50/50"
                      }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Document Icon */}
                        <div className="w-16 h-16 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>

                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="mb-1">{doc.type}</h3>
                              <p className="text-sm text-gray-600 truncate">
                                {doc.fileName || doc.originalName}
                              </p>
                            </div>
                            {getStatusBadge(doc.verificationStatus || doc.status)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>📅 {formatDeadline(doc.uploadedAt)}</span>
                            {doc.fileSize && <span>💾 {formatFileSize(doc.fileSize)}</span>}
                          </div>

                          {/* Parsed Data Summary */}
                          {doc.parsedData && (
                            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">Extracted Information</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {doc.parsedData.level && (
                                  <div>
                                    <span className="text-gray-600">Level:</span>{" "}
                                    <span className="font-medium">{doc.parsedData.level}</span>
                                  </div>
                                )}
                                {doc.parsedData.gpa && (
                                  <div>
                                    <span className="text-gray-600">GPA:</span>{" "}
                                    <span className="font-medium">{doc.parsedData.gpa}</span>
                                  </div>
                                )}
                                {doc.parsedData.stream && (
                                  <div>
                                    <span className="text-gray-600">Stream:</span>{" "}
                                    <span className="font-medium">{doc.parsedData.stream}</span>
                                  </div>
                                )}
                                {doc.parsedData.ieltsOverall && (
                                  <div>
                                    <span className="text-gray-600">IELTS:</span>{" "}
                                    <span className="font-medium">{doc.parsedData.ieltsOverall}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {(doc.rejectionReason || doc.adminNote) && (
                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {doc.rejectionReason || doc.adminNote}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleView(doc)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteConfirm({ open: true, docId: doc._id })}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Upload Guidelines */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">📝 Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm mb-2">Supported Formats</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">PDF</Badge>
                  <Badge variant="secondary">JPG</Badge>
                  <Badge variant="secondary">JPEG</Badge>
                  <Badge variant="secondary">PNG</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm mb-2">File Size Limits</h3>
                <p className="text-sm text-gray-600">Maximum 5 MB per file</p>
              </div>

              <div>
                <h3 className="text-sm mb-2">Document Quality</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Clear and readable text
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Original or certified copies
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Complete document pages
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    No watermarks or stamps
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm mb-2">Verification Time</h3>
                <p className="text-sm text-gray-600">
                  Usually takes 2-3 business days
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm mb-2">Need Help?</h3>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadSuccess={fetchDocuments}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, docId: null })}
        onConfirm={() => deleteConfirm.docId && handleDelete(deleteConfirm.docId)}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
