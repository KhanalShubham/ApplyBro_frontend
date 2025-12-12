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
  MessageSquare,
  Search,
  CheckCircle,
  X,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { Post } from "@/types/admin";

export function PostModerationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      // Use getPendingPosts for pending filter, otherwise use getPosts with status
      const response = filterStatus === 'pending' || filterStatus === 'all'
        ? await adminService.getPendingPosts(pagination.page, pagination.pageSize)
        : await adminService.getPosts(
            pagination.page,
            pagination.pageSize,
            searchQuery,
            filterStatus === "all" ? undefined : filterStatus
          );
      if (response.data && response.data.data) {
        setPosts(response.data.data.posts || []);
        setPagination(prev => ({ ...prev, ...(response.data.data.pagination || {}) }));
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, pagination.pageSize]);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [selectedPostForDecline, setSelectedPostForDecline] = useState<Post | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const handleApprove = async (postId: string) => {
    try {
      await adminService.approvePost(postId);
      toast.success("Post approved successfully");
      fetchPosts();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to approve post");
    }
  };

  const handleReject = (post: Post) => {
    setSelectedPostForDecline(post);
    setDeclineModalOpen(true);
  };

  const handleDeclineSubmit = async () => {
    if (!selectedPostForDecline || !declineReason.trim()) {
      toast.error("Please provide a decline reason");
      return;
    }

    try {
      await adminService.declinePost(
        selectedPostForDecline._id,
        declineReason.trim(),
        adminNote.trim() || undefined
      );
      toast.success("Post declined successfully");
      setDeclineModalOpen(false);
      setSelectedPostForDecline(null);
      setDeclineReason('');
      setAdminNote('');
      fetchPosts();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to decline post");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading && posts.length === 0) {
    return <Loader className="min-h-[400px]" />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Post Moderation</h1>
        <p className="text-gray-600">Review and moderate community posts</p>
      </div>

      {/* Stats Cards - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                <h3 className="text-2xl font-bold">{pagination.total}</h3>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
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
                  placeholder="Search by post title or user..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Posts List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell>
                        <div className="max-w-[400px]">
                          <p className="font-medium mb-1 truncate" title={post.title}>{post.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author?.avatar} />
                            <AvatarFallback>{post.author?.name?.[0] || 'A'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{post.author?.name || 'Unknown Author'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likesCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.commentsCount}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "approved"
                              ? "default"
                              : post.status === "rejected" // Note: backend might use 'declined' or 'rejected'. Types say 'declined' for req, but maybe 'rejected' for response status. I assumed 'rejected' in interface.
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {post.status === "pending" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {post.status === "approved" && (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {post.status === "rejected" && (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                        {(post.declineReason || post.rejectionReason) && (
                          <p className="text-xs text-red-600 mt-1">
                            {post.declineReason || post.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Assuming some way to view post details */}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {post.status === "pending" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApprove(post._id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(post)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Decline
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
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

      {/* Decline Post Modal */}
      <Dialog open={declineModalOpen} onOpenChange={setDeclineModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Post</DialogTitle>
            <DialogDescription>
              Provide a reason for declining this post. The author will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedPostForDecline && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium mb-1">{selectedPostForDecline.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {selectedPostForDecline.body || selectedPostForDecline.content}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="declineReason">Decline Reason *</Label>
              <Textarea
                id="declineReason"
                placeholder="e.g., Contains inappropriate content, violates community guidelines..."
                rows={4}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="adminNote">Admin Note (optional, internal)</Label>
              <Textarea
                id="adminNote"
                placeholder="Internal notes (not visible to user)..."
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setDeclineModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeclineSubmit}
                disabled={!declineReason.trim()}
              >
                Decline Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}







