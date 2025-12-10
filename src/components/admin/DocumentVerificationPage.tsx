import { useState } from "react";
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
  Filter,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function DocumentVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");

  // Mock document data
  const [documents, setDocuments] = useState([
    {
      id: "1",
      userId: "1",
      userName: "Pratik Shrestha",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik",
      documentName: "+2 Transcript",
      documentType: "Transcript",
      uploadedDate: "2024-11-01",
      status: "verified",
      thumbnail: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "2",
      userId: "1",
      userName: "Pratik Shrestha",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik",
      documentName: "Bachelor Transcript",
      documentType: "Transcript",
      uploadedDate: "2024-11-03",
      status: "pending",
      thumbnail: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "3",
      userId: "2",
      userName: "Sarah Khadka",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      documentName: "IELTS Certificate",
      documentType: "Certificate",
      uploadedDate: "2024-11-02",
      status: "rejected",
      thumbnail: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      rejectionReason: "Document quality is poor. Please upload a clear scan.",
    },
    {
      id: "4",
      userId: "3",
      userName: "Rohan Sharma",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      documentName: "Passport Copy",
      documentType: "Identity",
      uploadedDate: "2024-11-04",
      status: "pending",
      thumbnail: "https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (docId: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId ? { ...doc, status: "verified" } : doc
      )
    );
  };

  const handleReject = (docId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      setDocuments(
        documents.map((doc) =>
          doc.id === docId
            ? { ...doc, status: "rejected", rejectionReason: reason }
            : doc
        )
      );
    }
  };

  const stats = [
    {
      label: "Total Documents",
      value: documents.length,
      icon: FileCheck,
      color: "blue",
    },
    {
      label: "Pending Review",
      value: documents.filter((d) => d.status === "pending").length,
      icon: Clock,
      color: "orange",
    },
    {
      label: "Verified",
      value: documents.filter((d) => d.status === "verified").length,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Rejected",
      value: documents.filter((d) => d.status === "rejected").length,
      icon: X,
      color: "red",
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Document Verification</h1>
        <p className="text-gray-600">Review and verify user-uploaded documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
              </div>
            </CardContent>
          </Card>
        ))}
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
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={doc.thumbnail}
                        alt={doc.documentName}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{doc.documentName}</p>
                        <p className="text-sm text-gray-500">ID: {doc.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={doc.userAvatar} />
                        <AvatarFallback>{doc.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{doc.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.documentType}</Badge>
                  </TableCell>
                  <TableCell>{doc.uploadedDate}</TableCell>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {doc.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleVerify(doc.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Verify
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(doc.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}







