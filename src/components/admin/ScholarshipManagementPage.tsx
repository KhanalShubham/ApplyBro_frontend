import { useState } from "react";
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
  Globe,
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

export function ScholarshipManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed" | "upcoming">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);

  // Mock scholarship data
  const [scholarships, setScholarships] = useState([
    {
      id: "1",
      name: "Fulbright Scholarship",
      country: "United States",
      countryFlag: "🇺🇸",
      degree: "Master",
      field: "All Fields",
      deadline: "2024-12-15",
      status: "open",
      amount: "Full Tuition",
      description: "Fully funded master's degree scholarship",
    },
    {
      id: "2",
      name: "DAAD Scholarship",
      country: "Germany",
      countryFlag: "🇩🇪",
      degree: "Bachelor",
      field: "Engineering",
      deadline: "2024-12-30",
      status: "open",
      amount: "€850/month",
      description: "Monthly stipend for engineering students",
    },
    {
      id: "3",
      name: "Chevening Scholarship",
      country: "United Kingdom",
      countryFlag: "🇬🇧",
      degree: "Master",
      field: "All Fields",
      deadline: "2024-11-15",
      status: "open",
      amount: "Full Funding",
      description: "UK government scholarship program",
    },
    {
      id: "4",
      name: "Australia Awards",
      country: "Australia",
      countryFlag: "🇦🇺",
      degree: "+2",
      field: "All Fields",
      deadline: "2025-01-22",
      status: "upcoming",
      amount: "Full Scholarship",
      description: "Australian government scholarship",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    countryFlag: "",
    degree: "",
    field: "",
    deadline: "",
    status: "open",
    amount: "",
    description: "",
  });

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || scholarship.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (editingScholarship) {
      // Edit existing
      setScholarships(
        scholarships.map((s) =>
          s.id === editingScholarship.id ? { ...s, ...formData } : s
        )
      );
    } else {
      // Create new
      const newScholarship = {
        id: String(scholarships.length + 1),
        ...formData,
      };
      setScholarships([...scholarships, newScholarship]);
    }
    setIsDialogOpen(false);
    setEditingScholarship(null);
    setFormData({
      name: "",
      country: "",
      countryFlag: "",
      degree: "",
      field: "",
      deadline: "",
      status: "open",
      amount: "",
      description: "",
    });
  };

  const handleEdit = (scholarship: any) => {
    setEditingScholarship(scholarship);
    setFormData(scholarship);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      setScholarships(scholarships.filter((s) => s.id !== id));
    }
  };

  const stats = [
    {
      label: "Total Scholarships",
      value: scholarships.length,
      icon: GraduationCap,
      color: "blue",
    },
    {
      label: "Open",
      value: scholarships.filter((s) => s.status === "open").length,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Upcoming",
      value: scholarships.filter((s) => s.status === "upcoming").length,
      icon: Clock,
      color: "orange",
    },
    {
      label: "Closed",
      value: scholarships.filter((s) => s.status === "closed").length,
      icon: X,
      color: "red",
    },
  ];

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
              setFormData({
                name: "",
                country: "",
                countryFlag: "",
                degree: "",
                field: "",
                deadline: "",
                status: "open",
                amount: "",
                description: "",
              });
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
                  <Label htmlFor="name">Scholarship Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
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
                  <Label htmlFor="countryFlag">Country Flag Emoji</Label>
                  <Input
                    id="countryFlag"
                    value={formData.countryFlag}
                    onChange={(e) =>
                      setFormData({ ...formData, countryFlag: e.target.value })
                    }
                    placeholder="🇺🇸"
                  />
                </div>
                <div>
                  <Label htmlFor="degree">Degree Level *</Label>
                  <Select
                    value={formData.degree}
                    onValueChange={(value) =>
                      setFormData({ ...formData, degree: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+2">+2</SelectItem>
                      <SelectItem value="Bachelor">Bachelor</SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    value={formData.field}
                    onChange={(e) =>
                      setFormData({ ...formData, field: e.target.value })
                    }
                    placeholder="e.g., All Fields, Engineering"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Scholarship Amount</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="e.g., Full Tuition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
          <CardTitle>Scholarships ({filteredScholarships.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholarship</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{scholarship.name}</p>
                      <p className="text-sm text-gray-500">ID: {scholarship.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{scholarship.countryFlag}</span>
                      <span>{scholarship.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{scholarship.degree}</Badge>
                  </TableCell>
                  <TableCell>{scholarship.field}</TableCell>
                  <TableCell>{scholarship.deadline}</TableCell>
                  <TableCell>{scholarship.amount}</TableCell>
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
                      {scholarship.status.charAt(0).toUpperCase() +
                        scholarship.status.slice(1)}
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
                        onClick={() => handleDelete(scholarship.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
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







