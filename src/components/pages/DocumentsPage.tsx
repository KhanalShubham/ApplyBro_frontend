import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Document {
  id: number;
  name: string;
  type: "+2 Transcript" | "Bachelor Transcript" | "Other";
  fileName: string;
  uploadDate: string;
  size: string;
  status: "Verified" | "Pending" | "Rejected";
  thumbnail?: string;
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: "+2 Transcript",
      type: "+2 Transcript",
      fileName: "grade_12_transcript.pdf",
      uploadDate: "Nov 1, 2025",
      size: "2.3 MB",
      status: "Verified",
      thumbnail: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      name: "Bachelor Transcript",
      type: "Bachelor Transcript",
      fileName: "bachelor_degree_transcript.pdf",
      uploadDate: "Nov 3, 2025",
      size: "3.1 MB",
      status: "Pending",
      thumbnail: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Add the new document
          const newDoc: Document = {
            id: documents.length + 1,
            name: "Other Document",
            type: "Other",
            fileName: file.name,
            uploadDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: "Pending",
          };
          setDocuments([...documents, newDoc]);
          setSelectedFile(null);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const verificationTimeline = [
    { step: "Submitted", status: "completed", date: "Nov 3, 2025" },
    { step: "Under Review", status: "active", date: "In Progress" },
    { step: "Approved", status: "pending", date: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">📁 My Documents</h1>
        <p className="text-gray-600">
          Upload and manage your academic documents for scholarship applications
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm">Uploading...</div>
                          <div className="text-xs text-gray-600">
                            {selectedFile?.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-blue-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Document Cards */}
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-2 ${
                    doc.status === "Verified"
                      ? "border-green-200 bg-green-50/50"
                      : doc.status === "Pending"
                      ? "border-orange-200 bg-orange-50/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      {doc.thumbnail && (
                        <ImageWithFallback
                          src={doc.thumbnail}
                          alt={doc.name}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                      )}

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="mb-1">{doc.name}</h3>
                            <p className="text-sm text-gray-600 truncate">
                              {doc.fileName}
                            </p>
                          </div>
                          <Badge
                            className={
                              doc.status === "Verified"
                                ? "bg-green-600 text-white"
                                : doc.status === "Pending"
                                ? "bg-orange-600 text-white"
                                : "bg-red-600 text-white"
                            }
                          >
                            {doc.status === "Verified" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {doc.status === "Pending" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {doc.status === "Rejected" && (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {doc.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span>📅 {doc.uploadDate}</span>
                          <span>💾 {doc.size}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(doc.id)}
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

          {/* Upload New Document */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-8">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#E9F2FF" }}
                >
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2">Upload New Document</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your file here or click to browse
                </p>
                <label htmlFor="file-upload">
                  <Button
                    style={{ backgroundColor: "#007BFF" }}
                    className="cursor-pointer"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </div>
            </CardContent>
          </Card>

          {/* Verification Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Verification Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationTimeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === "completed"
                            ? "bg-green-600"
                            : item.status === "active"
                            ? "bg-blue-600 animate-pulse"
                            : "bg-gray-300"
                        }`}
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : item.status === "active" ? (
                          <Clock className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      {index < verificationTimeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            item.status === "completed"
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="text-sm mb-1">{item.step}</div>
                      <div className="text-xs text-gray-600">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Upload Rules */}
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
    </div>
  );
}
