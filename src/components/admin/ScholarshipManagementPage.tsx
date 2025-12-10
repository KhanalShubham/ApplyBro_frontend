import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

export function ScholarshipManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed" | "upcoming">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    level: "",
    deadline: "",
    status: "open",
    description: "",
  });

  const fetchScholarships = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getScholarships(
        pagination.page,
        pagination.pageSize,
        searchQuery,
        filterStatus === "all" ? undefined : filterStatus
      );
      // Assuming response structure based on other endpoints, but standard might be slightly different.
      // Adjusting based on standard response format { status: "success", data: { scholarships: [], pagination: {} } }
      // If backend uses different keys, this needs adjustment. 
      // Current assumption: data.data.scholarships
      if (response.data && (response.data as any).data) { // Use type assertion if type not fully updated
        const result = (response.data as any).data;
        setScholarships(result.scholarships || []);
        setPagination(prev => ({ ...prev, ...(result.pagination || {}) }));
      }
    } catch (error) {
      console.error("Failed to fetch scholarships", error);
      toast.error("Failed to fetch scholarships");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchScholarships();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchScholarships();
  }, [pagination.page, pagination.pageSize]);


  const handleCreate = async () => {
    try {
      if (editingScholarship) {
        await adminService.updateScholarship(editingScholarship._id || editingScholarship.id, formData);
        toast.success("Scholarship updated successfully");
      } else {
        await adminService.createScholarship(formData);
        toast.success("Scholarship created successfully");
      }
      setIsDialogOpen(false);
      setEditingScholarship(null);
      resetForm();
      fetchScholarships();
    } catch (error) {
      console.error(error);
      toast.error(editingScholarship ? "Failed to update scholarship" : "Failed to create scholarship");
    }
  };

  const handleEdit = (scholarship: any) => {
    setEditingScholarship(scholarship);
    setFormData({
      title: scholarship.title || scholarship.name, // Handle potential inconsistent naming
      country: scholarship.country,
      level: scholarship.level || scholarship.degree,
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
      status: scholarship.status,
      description: scholarship.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      try {
        await adminService.deleteScholarship(id);
        toast.success("Scholarship deleted");
        fetchScholarships();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete scholarship");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      country: "",
      level: "",
      deadline: "",
      status: "open",
      description: "",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading && scholarships.length === 0) {
    return <Loader className="min-h-[400px]" />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Scholarship Management</h1>
          <p className="text-gray-600">Manage all scholarships on the platform</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingScholarship(null);
              resetForm();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingScholarship ? "Edit Scholarship" : "Create New Scholarship"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Scholarship Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Fulbright Scholarship"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="e.g., United States"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="level">Degree Level *</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    placeholder="e.g., Master"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter scholarship description..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  {editingScholarship ? "Update" : "Create"} Scholarship
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Scholarships</p>
                <h3 className="text-2xl font-bold">{pagination.total}</h3>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
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
                  placeholder="Search by name or country..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scholarships List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholarships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No scholarships found
                    </TableCell>
                  </TableRow>
                ) : (
                  scholarships.map((scholarship) => (
                    <TableRow key={scholarship._id || scholarship.id}>
                      <TableCell>
                        <div className="font-medium">{scholarship.title || scholarship.name}</div>
                      </TableCell>
                      <TableCell>
                        {scholarship.country}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{scholarship.level || scholarship.degree}</Badge>
                      </TableCell>
                      <TableCell>
                        {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            scholarship.status === "open"
                              ? "default"
                              : scholarship.status === "closed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {scholarship.status === "open" && (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {scholarship.status === "upcoming" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {scholarship.status === "closed" && (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {scholarship.status ? scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1) : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(scholarship)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(scholarship._id || scholarship.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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







