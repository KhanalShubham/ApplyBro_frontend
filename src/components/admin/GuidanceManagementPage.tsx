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
    FileText,
    Video,
    ClipboardCheck,
    HelpCircle,
    Search,
    Plus,
    Edit,
    Trash2,
    Loader2,
    Upload,
    CheckCircle,
    X,
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
import { guidanceService, GuidanceItem } from "@/services/guidanceService";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { ScrollArea } from "../ui/scroll-area";

interface Question {
    questionText: string;
    options: string[];
    correctOptionIndex: number;
    explanation?: string;
    imageUrl?: string;
}

export function GuidanceManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GuidanceItem | null>(null);
    const [items, setItems] = useState<GuidanceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "article",
        topic: "General",
        content: "",
        videoUrl: "",
        fileUrl: "",
        thumbnail: "",
        duration: "",
        readTime: "",
        difficulty: "Beginner",
        published: true,
        questions: [] as Question[]
    });

    const [sourceType, setSourceType] = useState<"link" | "file" | "manual">("link");

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const params: any = { role: 'admin' };
            if (filterType !== "all") params.type = filterType;
            if (searchQuery) params.search = searchQuery;

            const response = await guidanceService.getAdminAll(params);
            if (response.data && (response.data as any).data) {
                setItems((response.data as any).data || []);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch guidance items", error);
            toast.error("Failed to fetch guidance items");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, filterType]);

    const handleCreate = async () => {
        try {
            setIsSubmitting(true);

            // Validation
            if (!formData.title) throw new Error("Title is required");
            if (!formData.description) throw new Error("Description is required");

            const payload = { ...formData };

            // Clean up payload based on source type
            if (sourceType === "file") {
                // Ensure fileUrl is set
                if (!payload.fileUrl && !payload.videoUrl) throw new Error("Please upload a file");
            } else if (sourceType === "manual" && payload.type === "test") {
                if (payload.questions.length === 0) throw new Error("Please add at least one question");
            }

            if (editingItem) {
                await guidanceService.update(editingItem._id, payload as any);
                toast.success("Updated successfully");
            } else {
                await guidanceService.create(payload as any);
                toast.success("Created successfully");
            }

            setIsDialogOpen(false);
            resetForm();
            fetchItems();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item: GuidanceItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            type: item.type,
            topic: item.topic,
            content: item.content || "",
            videoUrl: item.videoUrl || "",
            fileUrl: item.fileUrl || "",
            thumbnail: item.thumbnail || "",
            duration: item.duration || "",
            readTime: item.readTime || "",
            difficulty: item.difficulty || "Beginner",
            published: item.published,
            questions: (item as any).questions || []
        });

        // Determine Source Type
        if ((item as any).questions && (item as any).questions.length > 0) {
            setSourceType("manual");
        } else if (item.fileUrl || (item.videoUrl && !item.videoUrl.startsWith('http'))) {
            // Heuristic: Local files often relative, but generic check
            setSourceType("file");
        } else {
            setSourceType("link");
        }

        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this item?")) {
            try {
                await guidanceService.delete(id);
                toast.success("Deleted successfully");
                fetchItems();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setSourceType("link");
        setFormData({
            title: "",
            description: "",
            type: "article",
            topic: "General",
            content: "",
            videoUrl: "",
            fileUrl: "",
            thumbnail: "",
            duration: "",
            readTime: "",
            difficulty: "Beginner",
            published: true,
            questions: []
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'videoUrl' | 'fileUrl' | 'thumbnail') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            let type: "image" | "video" | "document" = "document";
            if (field === "thumbnail") type = "image";
            else if (field === "videoUrl") type = "video";

            const res = await adminService.uploadFile(file, type);
            if (res.data?.data?.url) {
                setFormData(prev => ({ ...prev, [field]: res.data.data.url }));
                toast.success("Upload successful");
            }
        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    // --- Manual Test Builder Helpers ---
    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 }]
        }));
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...formData.questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...formData.questions];
        newQuestions.splice(index, 1);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "article": return <FileText className="h-4 w-4" />;
            case "video": return <Video className="h-4 w-4" />;
            case "test": return <ClipboardCheck className="h-4 w-4" />;
            case "faq": return <HelpCircle className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Guidance Management</h1>
                    <p className="text-gray-600">Manage articles, videos, and resources</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0" aria-describedby="management-dialog-desc">
                        <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle>
                                {editingItem ? "Edit Resource" : "Create New Resource"}
                            </DialogTitle>
                            <p id="management-dialog-desc" className="sr-only">
                                Form to {editingItem ? "edit existing" : "create new"} guidance resource.
                            </p>
                        </DialogHeader>

                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-6">
                                {/* Basic Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(v: string) => setFormData({ ...formData, type: v as any })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="article">Article</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="test">Test/Quiz</SelectItem>
                                                <SelectItem value="faq">FAQ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Topic</Label>
                                        <Select
                                            value={formData.topic}
                                            onValueChange={(v: string) => setFormData({ ...formData, topic: v })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="IELTS">IELTS</SelectItem>
                                                <SelectItem value="DAAD">DAAD</SelectItem>
                                                <SelectItem value="SOP">SOP</SelectItem>
                                                <SelectItem value="Visa">Visa</SelectItem>
                                                <SelectItem value="Motivation Letter">Motivation Letter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Resource Title"
                                    />
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Short description..."
                                        rows={2}
                                    />
                                </div>

                                {/* Source Selector */}
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                                    <Label className="text-base font-semibold">Content Source</Label>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant={sourceType === "link" ? "default" : "outline"}
                                            onClick={() => setSourceType("link")}
                                            className="flex-1"
                                        >
                                            External Link
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={sourceType === "file" ? "default" : "outline"}
                                            onClick={() => setSourceType("file")}
                                            className="flex-1"
                                        >
                                            Upload File
                                        </Button>
                                        {formData.type === "test" && (
                                            <Button
                                                type="button"
                                                variant={sourceType === "manual" ? "default" : "outline"}
                                                onClick={() => setSourceType("manual")}
                                                className="flex-1"
                                            >
                                                Manual Builder
                                            </Button>
                                        )}
                                    </div>

                                    {/* Link Input */}
                                    {sourceType === "link" && (
                                        <div className="mt-4">
                                            <Label>URL</Label>
                                            <Input
                                                value={formData.type === "video" ? formData.videoUrl : formData.fileUrl}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (formData.type === "video") setFormData({ ...formData, videoUrl: val });
                                                    else setFormData({ ...formData, fileUrl: val });
                                                }}
                                                placeholder={formData.type === "video" ? "https://youtube.com/..." : "https://example.com/doc.pdf"}
                                            />
                                        </div>
                                    )}

                                    {/* File Upload Input */}
                                    {sourceType === "file" && (
                                        <div className="mt-4 space-y-2">
                                            <Label>Upload {formData.type === "video" ? "Video" : "Document"}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="file"
                                                    accept={formData.type === "video" ? "video/*" : ".pdf,.doc,.docx"}
                                                    onChange={(e) => handleFileUpload(e, formData.type === "video" ? "videoUrl" : "fileUrl")}
                                                    disabled={isUploading}
                                                />
                                                {isUploading && <Loader2 className="animate-spin h-5 w-5 text-blue-600" />}
                                            </div>
                                            {(formData.fileUrl || formData.videoUrl) && (
                                                <p className="text-sm text-green-600 flex items-center mt-1">
                                                    <CheckCircle className="h-4 w-4 mr-1" /> File Uploaded
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Manual Test Builder */}
                                    {sourceType === "manual" && formData.type === "test" && (
                                        <div className="mt-4 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <Label>Quiz Questions ({formData.questions.length})</Label>
                                                <Button type="button" size="sm" onClick={addQuestion} variant="outline">
                                                    <Plus className="h-4 w-4 mr-1" /> Add Question
                                                </Button>
                                            </div>

                                            {formData.questions.map((q, qIndex) => (
                                                <Card key={qIndex} className="p-4 border-dashed relative">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                        onClick={() => removeQuestion(qIndex)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>

                                                    <div className="space-y-3 pr-8">
                                                        <div>
                                                            <Label className="text-xs">Question {qIndex + 1}</Label>
                                                            <Input
                                                                value={q.questionText}
                                                                onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                                                                placeholder="Enter question..."
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {q.options.map((opt, oIndex) => (
                                                                <div key={oIndex} className="flex gap-1 items-center">
                                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${q.correctOptionIndex === oIndex ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} onClick={() => updateQuestion(qIndex, "correctOptionIndex", oIndex)}>
                                                                        {q.correctOptionIndex === oIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                    </div>
                                                                    <Input
                                                                        className="h-8 text-sm"
                                                                        value={opt}
                                                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Article Content */}
                                {formData.type === "article" && sourceType !== "file" && (
                                    <div>
                                        <Label>Content (Markdown)</Label>
                                        <Textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="# Write your article here..."
                                            className="min-h-[200px] font-mono text-sm"
                                        />
                                    </div>
                                )}

                                {/* Common Metadata fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Thumbnail</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={formData.thumbnail}
                                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                                placeholder="Image URL"
                                            />
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    className="w-12 px-0 opacity-0 absolute inset-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, "thumbnail")}
                                                />
                                                <Button variant="outline" size="icon" type="button">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>Difficulty</Label>
                                                <Select
                                                    value={formData.difficulty}
                                                    onValueChange={(v: string) => setFormData({ ...formData, difficulty: v as any })}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Status</Label>
                                                <Select
                                                    value={formData.published ? "published" : "draft"}
                                                    onValueChange={(v: string) => setFormData({ ...formData, published: v === "published" })}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting || isUploading}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingItem ? "Update" : "Create"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    {/* ... Existing Search/Filter UI ... */}
                    <div className="flex items-center justify-between">
                        <CardTitle>Resources List</CardTitle>
                        <div className="flex gap-2">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="article">Articles</SelectItem>
                                    <SelectItem value="video">Videos</SelectItem>
                                    <SelectItem value="test">Tests</SelectItem>
                                    <SelectItem value="faq">FAQs</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Loader className="mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item._id || item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(item.type)}
                                                <span className="capitalize">{item.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-[300px] truncate" title={item.title}>
                                            {item.title}
                                        </TableCell>
                                        <TableCell><Badge variant="outline">{item.topic}</Badge></TableCell>
                                        <TableCell>{item.difficulty}</TableCell>
                                        <TableCell>
                                            {item.published ? (
                                                <Badge variant="default" className="bg-green-600">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)}>
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
