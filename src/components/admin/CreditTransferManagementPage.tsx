import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../ui/tabs';
import {
    Building2,
    GraduationCap,
    Globe,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    Search,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface College {
    _id: string;
    name: string;
    location: string;
    affiliation: string;
    affiliatedUniversity: string;
    website?: string;
    logo?: string;
    programs: Array<{
        name: string;
        duration: string;
        totalCredits: number;
    }>;
    isActive: boolean;
}

interface ForeignUniversity {
    _id: string;
    name: string;
    country: string;
    city?: string;
    programName: string;
    totalCredits: number;
    tuitionRange?: {
        min: number;
        max: number;
        currency: string;
    };
    acceptsCreditTransfer: boolean;
    isVerified: boolean;
}

export function CreditTransferManagementPage() {
    const [activeTab, setActiveTab] = useState('colleges');
    const [colleges, setColleges] = useState<College[]>([]);
    const [universities, setUniversities] = useState<ForeignUniversity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
    const [isAddUniversityOpen, setIsAddUniversityOpen] = useState(false);
    const [isEditCollegeOpen, setIsEditCollegeOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState<College | null>(null);
    const [isEditUniversityOpen, setIsEditUniversityOpen] = useState(false);
    const [editingUniversity, setEditingUniversity] = useState<ForeignUniversity | null>(null);

    // Form states
    const [collegeForm, setCollegeForm] = useState({
        name: '',
        location: '',
        affiliation: 'UK',
        affiliatedUniversity: '',
        website: '',
        logo: '',
    });

    const [universityForm, setUniversityForm] = useState({
        name: '',
        country: 'UK',
        city: '',
        programName: '',
        totalCredits: 360,
        tuitionMin: 0,
        tuitionMax: 0,
        currency: 'GBP',
    });

    useEffect(() => {
        if (activeTab === 'colleges') {
            loadColleges();
        } else if (activeTab === 'universities') {
            loadUniversities();
        }
    }, [activeTab]);

    const loadColleges = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/credit-transfer/colleges');
            setColleges(response.data.data || []);
        } catch (error) {
            console.error('Failed to load colleges:', error);
            toast.error('Failed to load colleges');
        } finally {
            setIsLoading(false);
        }
    };

    const loadUniversities = async () => {
        setIsLoading(true);
        try {
            // This endpoint needs to be created in the backend
            const response = await api.get('/credit-transfer/admin/universities');
            setUniversities(response.data.data || []);
        } catch (error) {
            console.error('Failed to load universities:', error);
            toast.error('Failed to load universities');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCollege = async () => {
        try {
            await api.post('/credit-transfer/admin/colleges', collegeForm);
            toast.success('College added successfully!');
            setIsAddCollegeOpen(false);
            loadColleges();
            // Reset form
            setCollegeForm({
                name: '',
                location: '',
                affiliation: 'UK',
                affiliatedUniversity: '',
                website: '',
                logo: '',
            });
        } catch (error: any) {
            console.error('Failed to add college:', error);
            toast.error(error.response?.data?.message || 'Failed to add college');
        }
    };

    const handleAddUniversity = async () => {
        try {
            const data = {
                name: universityForm.name,
                country: universityForm.country,
                city: universityForm.city,
                programName: universityForm.programName,
                totalCredits: universityForm.totalCredits,
                tuitionRange: {
                    min: universityForm.tuitionMin,
                    max: universityForm.tuitionMax,
                    currency: universityForm.currency,
                },
                acceptsCreditTransfer: true,
                isVerified: false,
            };

            await api.post('/credit-transfer/admin/universities', data);
            toast.success('University added successfully!');
            setIsAddUniversityOpen(false);
            loadUniversities();
            // Reset form
            setUniversityForm({
                name: '',
                country: 'UK',
                city: '',
                programName: '',
                totalCredits: 360,
                tuitionMin: 0,
                tuitionMax: 0,
                currency: 'GBP',
            });
        } catch (error: any) {
            console.error('Failed to add university:', error);
            toast.error(error.response?.data?.message || 'Failed to add university');
        }
    };

    const handleEditCollege = (college: College) => {
        setEditingCollege(college);
        setCollegeForm({
            name: college.name,
            location: college.location,
            affiliation: college.affiliation,
            affiliatedUniversity: college.affiliatedUniversity,
            website: college.website || '',
            logo: college.logo || '',
        });
        setIsEditCollegeOpen(true);
    };

    const handleUpdateCollege = async () => {
        if (!editingCollege) return;

        try {
            await api.put(`/credit-transfer/admin/colleges/${editingCollege._id}`, collegeForm);
            toast.success('College updated successfully!');
            setIsEditCollegeOpen(false);
            setEditingCollege(null);
            loadColleges();
            // Reset form
            setCollegeForm({
                name: '',
                location: '',
                affiliation: 'UK',
                affiliatedUniversity: '',
                website: '',
                logo: '',
            });
        } catch (error: any) {
            console.error('Failed to update college:', error);
            toast.error(error.response?.data?.message || 'Failed to update college');
        }
    };

    const handleEditUniversity = (university: ForeignUniversity) => {
        setEditingUniversity(university);
        setUniversityForm({
            name: university.name,
            country: university.country,
            city: university.city || '',
            programName: university.programName,
            totalCredits: university.totalCredits,
            tuitionMin: university.tuitionRange?.min || 0,
            tuitionMax: university.tuitionRange?.max || 0,
            currency: university.tuitionRange?.currency || 'GBP',
        });
        setIsEditUniversityOpen(true);
    };

    const handleUpdateUniversity = async () => {
        if (!editingUniversity) return;

        try {
            const data = {
                ...universityForm,
                tuitionRange: {
                    min: universityForm.tuitionMin,
                    max: universityForm.tuitionMax,
                    currency: universityForm.currency,
                },
            };

            await api.put(`/credit-transfer/admin/universities/${editingUniversity._id}`, data);
            toast.success('University updated successfully!');
            setIsEditUniversityOpen(false);
            setEditingUniversity(null);
            loadUniversities();
            // Reset form
            setUniversityForm({
                name: '',
                country: 'UK',
                city: '',
                programName: '',
                totalCredits: 360,
                tuitionMin: 0,
                tuitionMax: 0,
                currency: 'GBP',
            });
        } catch (error: any) {
            console.error('Failed to update university:', error);
            toast.error(error.response?.data?.message || 'Failed to update university');
        }
    };

    const handleDeleteCollege = async (id: string) => {
        if (!confirm('Are you sure you want to delete this college?')) return;

        try {
            await api.delete(`/credit-transfer/admin/colleges/${id}`);
            toast.success('College deleted successfully!');
            loadColleges();
        } catch (error) {
            console.error('Failed to delete college:', error);
            toast.error('Failed to delete college');
        }
    };

    const handleDeleteUniversity = async (id: string) => {
        if (!confirm('Are you sure you want to delete this university?')) return;

        try {
            await api.delete(`/credit-transfer/admin/universities/${id}`);
            toast.success('University deleted successfully!');
            loadUniversities();
        } catch (error) {
            console.error('Failed to delete university:', error);
            toast.error('Failed to delete university');
        }
    };

    const filteredColleges = colleges.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUniversities = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Credit Transfer Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage Nepal colleges, foreign universities, and credit mappings
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="colleges">
                        <Building2 className="h-4 w-4 mr-2" />
                        Nepal Colleges
                    </TabsTrigger>
                    <TabsTrigger value="universities">
                        <Globe className="h-4 w-4 mr-2" />
                        Foreign Universities
                    </TabsTrigger>
                    <TabsTrigger value="mappings">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Credit Mappings
                    </TabsTrigger>
                </TabsList>

                {/* Nepal Colleges Tab */}
                <TabsContent value="colleges" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Nepal Colleges</CardTitle>
                                    <CardDescription>
                                        Manage colleges offering programs in Nepal
                                    </CardDescription>
                                </div>
                                <Dialog open={isAddCollegeOpen} onOpenChange={setIsAddCollegeOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-500 hover:bg-blue-600">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add College
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add New College</DialogTitle>
                                            <DialogDescription>
                                                Add a new Nepal college to the database
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">College Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={collegeForm.name}
                                                    onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                                                    placeholder="e.g., Softwarica College"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="location">Location *</Label>
                                                <Input
                                                    id="location"
                                                    value={collegeForm.location}
                                                    onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })}
                                                    placeholder="e.g., Dillibazar, Kathmandu"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="affiliation">Affiliation *</Label>
                                                    <Select
                                                        value={collegeForm.affiliation}
                                                        onValueChange={(value: string) => setCollegeForm({ ...collegeForm, affiliation: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="UK">UK</SelectItem>
                                                            <SelectItem value="USA">USA</SelectItem>
                                                            <SelectItem value="Australian">Australian</SelectItem>
                                                            <SelectItem value="Local">Local</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="affiliatedUniversity">Affiliated University *</Label>
                                                    <Input
                                                        id="affiliatedUniversity"
                                                        value={collegeForm.affiliatedUniversity}
                                                        onChange={(e) => setCollegeForm({ ...collegeForm, affiliatedUniversity: e.target.value })}
                                                        placeholder="e.g., Coventry University"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    id="website"
                                                    value={collegeForm.website}
                                                    onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                                                    placeholder="https://college.edu.np"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="logo">Logo URL</Label>
                                                <Input
                                                    id="logo"
                                                    value={collegeForm.logo}
                                                    onChange={(e) => setCollegeForm({ ...collegeForm, logo: e.target.value })}
                                                    placeholder="https://example.com/logo.png"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setIsAddCollegeOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleAddCollege} className="bg-blue-500 hover:bg-blue-600">
                                                Add College
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Edit College Dialog */}
                            <Dialog open={isEditCollegeOpen} onOpenChange={setIsEditCollegeOpen}>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit College</DialogTitle>
                                        <DialogDescription>
                                            Update college information
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-name">College Name *</Label>
                                            <Input
                                                id="edit-name"
                                                value={collegeForm.name}
                                                onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                                                placeholder="e.g., Softwarica College"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-location">Location *</Label>
                                            <Input
                                                id="edit-location"
                                                value={collegeForm.location}
                                                onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })}
                                                placeholder="e.g., Dillibazar, Kathmandu"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-affiliation">Affiliation *</Label>
                                                <Select
                                                    value={collegeForm.affiliation}
                                                    onValueChange={(value: string) => setCollegeForm({ ...collegeForm, affiliation: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="UK">UK</SelectItem>
                                                        <SelectItem value="USA">USA</SelectItem>
                                                        <SelectItem value="Australian">Australian</SelectItem>
                                                        <SelectItem value="Local">Local</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-affiliatedUniversity">Affiliated University *</Label>
                                                <Input
                                                    id="edit-affiliatedUniversity"
                                                    value={collegeForm.affiliatedUniversity}
                                                    onChange={(e) => setCollegeForm({ ...collegeForm, affiliatedUniversity: e.target.value })}
                                                    placeholder="e.g., Coventry University"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-website">Website</Label>
                                            <Input
                                                id="edit-website"
                                                value={collegeForm.website}
                                                onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                                                placeholder="https://college.edu.np"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-logo">Logo URL</Label>
                                            <Input
                                                id="edit-logo"
                                                value={collegeForm.logo}
                                                onChange={(e) => setCollegeForm({ ...collegeForm, logo: e.target.value })}
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsEditCollegeOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleUpdateCollege} className="bg-blue-500 hover:bg-blue-600">
                                            Update College
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search colleges..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            ) : (
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>College Name</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Affiliation</TableHead>
                                                <TableHead>Programs</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredColleges.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        No colleges found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredColleges.map((college) => (
                                                    <TableRow key={college._id}>
                                                        <TableCell className="font-medium">{college.name}</TableCell>
                                                        <TableCell>{college.location}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{college.affiliation}</Badge>
                                                        </TableCell>
                                                        <TableCell>{college.programs?.length || 0}</TableCell>
                                                        <TableCell>
                                                            {college.isActive ? (
                                                                <Badge className="bg-green-100 text-green-700 border-0">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Active
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-gray-100 text-gray-700 border-0">
                                                                    <XCircle className="h-3 w-3 mr-1" />
                                                                    Inactive
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditCollege(college)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteCollege(college._id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Foreign Universities Tab */}
                <TabsContent value="universities" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Foreign Universities</CardTitle>
                                    <CardDescription>
                                        Manage universities that accept credit transfers
                                    </CardDescription>
                                </div>
                                <Dialog open={isAddUniversityOpen} onOpenChange={setIsAddUniversityOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-500 hover:bg-blue-600">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add University
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Add Foreign University</DialogTitle>
                                            <DialogDescription>
                                                Add a university that accepts credit transfers
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="uniName">University Name *</Label>
                                                <Input
                                                    id="uniName"
                                                    value={universityForm.name}
                                                    onChange={(e) => setUniversityForm({ ...universityForm, name: e.target.value })}
                                                    placeholder="e.g., Coventry University"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="country">Country *</Label>
                                                    <Select
                                                        value={universityForm.country}
                                                        onValueChange={(value: string) => setUniversityForm({ ...universityForm, country: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="UK">UK</SelectItem>
                                                            <SelectItem value="USA">USA</SelectItem>
                                                            <SelectItem value="Australia">Australia</SelectItem>
                                                            <SelectItem value="Canada">Canada</SelectItem>
                                                            <SelectItem value="Europe">Europe</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={universityForm.city}
                                                        onChange={(e) => setUniversityForm({ ...universityForm, city: e.target.value })}
                                                        placeholder="e.g., Coventry"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="programName">Program Name *</Label>
                                                <Input
                                                    id="programName"
                                                    value={universityForm.programName}
                                                    onChange={(e) => setUniversityForm({ ...universityForm, programName: e.target.value })}
                                                    placeholder="e.g., BSc (Hons) Computing"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="totalCredits">Total Credits *</Label>
                                                    <Input
                                                        id="totalCredits"
                                                        type="number"
                                                        value={universityForm.totalCredits}
                                                        onChange={(e) => setUniversityForm({ ...universityForm, totalCredits: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="tuitionMin">Min Tuition</Label>
                                                    <Input
                                                        id="tuitionMin"
                                                        type="number"
                                                        value={universityForm.tuitionMin}
                                                        onChange={(e) => setUniversityForm({ ...universityForm, tuitionMin: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="tuitionMax">Max Tuition</Label>
                                                    <Input
                                                        id="tuitionMax"
                                                        type="number"
                                                        value={universityForm.tuitionMax}
                                                        onChange={(e) => setUniversityForm({ ...universityForm, tuitionMax: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setIsAddUniversityOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleAddUniversity} className="bg-blue-500 hover:bg-blue-600">
                                                Add University
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search universities..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            ) : (
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>University Name</TableHead>
                                                <TableHead>Country</TableHead>
                                                <TableHead>Program</TableHead>
                                                <TableHead>Credits</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUniversities.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        No universities found. Add your first university!
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUniversities.map((uni) => (
                                                    <TableRow key={uni._id}>
                                                        <TableCell className="font-medium">{uni.name}</TableCell>
                                                        <TableCell>{uni.country}</TableCell>
                                                        <TableCell>{uni.programName}</TableCell>
                                                        <TableCell>{uni.totalCredits}</TableCell>
                                                        <TableCell>
                                                            {uni.isVerified ? (
                                                                <Badge className="bg-blue-100 text-blue-700 border-0">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Verified
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-yellow-100 text-yellow-700 border-0">
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditUniversity(uni)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteUniversity(uni._id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* Edit University Dialog */}
                            <Dialog open={isEditUniversityOpen} onOpenChange={setIsEditUniversityOpen}>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit Foreign University</DialogTitle>
                                        <DialogDescription>
                                            Update university information
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-uniName">University Name *</Label>
                                            <Input
                                                id="edit-uniName"
                                                value={universityForm.name}
                                                onChange={(e) => setUniversityForm({ ...universityForm, name: e.target.value })}
                                                placeholder="e.g., Coventry University"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-country">Country *</Label>
                                                <Select
                                                    value={universityForm.country}
                                                    onValueChange={(value: string) => setUniversityForm({ ...universityForm, country: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="UK">UK</SelectItem>
                                                        <SelectItem value="USA">USA</SelectItem>
                                                        <SelectItem value="Australia">Australia</SelectItem>
                                                        <SelectItem value="Canada">Canada</SelectItem>
                                                        <SelectItem value="Europe">Europe</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-city">City</Label>
                                                <Input
                                                    id="edit-city"
                                                    value={universityForm.city}
                                                    onChange={(e) => setUniversityForm({ ...universityForm, city: e.target.value })}
                                                    placeholder="e.g., Coventry"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-programName">Program Name *</Label>
                                            <Input
                                                id="edit-programName"
                                                value={universityForm.programName}
                                                onChange={(e) => setUniversityForm({ ...universityForm, programName: e.target.value })}
                                                placeholder="e.g., BSc (Hons) Computing"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-totalCredits">Total Credits *</Label>
                                                <Input
                                                    id="edit-totalCredits"
                                                    type="number"
                                                    value={universityForm.totalCredits}
                                                    onChange={(e) => setUniversityForm({ ...universityForm, totalCredits: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-tuitionMin">Min Tuition</Label>
                                                <Input
                                                    id="edit-tuitionMin"
                                                    type="number"
                                                    value={universityForm.tuitionMin}
                                                    onChange={(e) => setUniversityForm({ ...universityForm, tuitionMin: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-tuitionMax">Max Tuition</Label>
                                                <Input
                                                    id="edit-tuitionMax"
                                                    type="number"
                                                    value={universityForm.tuitionMax}
                                                    onChange={(e) => setUniversityForm({ ...universityForm, tuitionMax: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsEditUniversityOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleUpdateUniversity} className="bg-blue-500 hover:bg-blue-600">
                                            Update University
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </CardContent >
                    </Card >
                </TabsContent >

                {/* Credit Mappings Tab */}
                < TabsContent value="mappings" className="space-y-4" >
                    <Card>
                        <CardHeader>
                            <CardTitle>Credit Mappings</CardTitle>
                            <CardDescription>
                                Map courses from Nepal colleges to foreign universities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-500">
                                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium mb-2">Credit Mapping Management</p>
                                <p className="text-sm">
                                    This feature will allow you to map courses between colleges and universities.
                                </p>
                                <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Mapping
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent >
            </Tabs >
        </div >
    );
}
