import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  FileCheck,
  Search,
  CheckCircle,
  X,
  Clock,
  Eye,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { Document } from "@/types/admin";

export function DocumentVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDocuments(
        pagination.page,
        pagination.pageSize,
        searchQuery,
        filterStatus === "all" ? undefined : filterStatus
      );
      if (response.data && response.data.data) {
        setDocuments(response.data.data.documents || []);
        setPagination(prev => ({ ...prev, ...(response.data.data.pagination || {}) }));
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      toast.error("Failed to fetch documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchDocuments();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchDocuments();
  }, [pagination.page, pagination.pageSize]);

  const handleVerify = async (docId: string) => {
    try {
      await adminService.verifyDocument(docId, { status: "verified" });
      toast.success("Document verified successfully");
      fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify document");
    }
  };

  const handleReject = async (docId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        await adminService.verifyDocument(docId, { status: "rejected", adminNote: reason });
        toast.success("Document rejected");
        fetchDocuments();
      } catch (error) {
        console.error(error);
        toast.error("Failed to reject document");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const stats = [
    {
      label: "Total Documents",
      value: pagination.total,
      icon: FileCheck,
      color: "blue",
    },
    // Note: These specific counts might need separate API calls or be removed if backend doesn't return them in metadata
    // For now, I'll keep them but they might be inaccurate if only fetching one page. 
    // Ideally backend returns specific stats. I'll rely on what I have, or maybe just show the filtered count.
    // Given the current backend response structure, getting separate counts requires separate calls. 
    // I will simplify or remove "Pending/Verified/Rejected" breakdown if I can't get it easily, or just leave it based on current list length (which is wrong for pagination).
    // Better to remove or change to "Current View" counts.
  ];

  if (isLoading && documents.length === 0) {
    return <Loader className="min-h-[400px]" />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Document Verification</h1>
        <p className="text-gray-600">Review and verify user-uploaded documents</p>
      </div>

      {/* Stats Cards - Simplified as backend doesn't provide these counts in list response */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Documents</p>
                <h3 className="text-2xl font-bold">{pagination.total}</h3>
              </div>
              <FileCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by document name or user..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* Assuming doc.url is an image or we have a thumbnail. If not, use generic icon */}
                          <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                            <FileCheck className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">ID: {doc._id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={doc.user?.avatar} />
                            <AvatarFallback>{doc.user?.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{doc.user?.name || 'Unknown User'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.status === "verified"
                              ? "default"
                              : doc.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {doc.status === "pending" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {doc.status === "verified" && (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {doc.status === "rejected" && (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                        {doc.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1">
                            {doc.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.url && (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </a>
                          )}

                          {doc.status === "pending" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleVerify(doc._id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Verify
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(doc._id)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}







