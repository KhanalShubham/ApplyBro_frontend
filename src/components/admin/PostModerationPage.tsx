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
  MessageSquare,
  Search,
  CheckCircle,
  X,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function PostModerationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Mock post data
  const [posts, setPosts] = useState([
    {
      id: "1",
      userId: "2",
      userName: "Sarah Khadka",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      title: "My Germany Visa Journey 🇩🇪",
      content: "Just got my visa approved! Here's everything you need to know about the process...",
      status: "approved",
      createdAt: "2024-11-05",
      likes: 24,
      comments: 8,
      category: "Success Story",
    },
    {
      id: "2",
      userId: "3",
      userName: "Rohan Sharma",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      title: "Tips for IELTS Speaking Test",
      content: "Scored 8.5 in speaking. Sharing my preparation strategy...",
      status: "pending",
      createdAt: "2024-11-06",
      likes: 12,
      comments: 3,
      category: "Tips",
    },
    {
      id: "3",
      userId: "1",
      userName: "Pratik Shrestha",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik",
      title: "Scholarship Interview Experience",
      content: "Common questions asked during scholarship interviews...",
      status: "pending",
      createdAt: "2024-11-06",
      likes: 5,
      comments: 1,
      category: "Guidance",
    },
    {
      id: "4",
      userId: "5",
      userName: "Maya Gurung",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      title: "Spam Post - Ignore",
      content: "This is inappropriate content...",
      status: "rejected",
      createdAt: "2024-11-04",
      likes: 0,
      comments: 0,
      category: "Other",
      rejectionReason: "Inappropriate content",
    },
  ]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, status: "approved" } : post
      )
    );
  };

  const handleReject = (postId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, status: "rejected", rejectionReason: reason }
            : post
        )
      );
    }
  };

  const stats = [
    {
      label: "Total Posts",
      value: posts.length,
      icon: MessageSquare,
      color: "blue",
    },
    {
      label: "Pending Review",
      value: posts.filter((p) => p.status === "pending").length,
      icon: Clock,
      color: "orange",
    },
    {
      label: "Approved",
      value: posts.filter((p) => p.status === "approved").length,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Rejected",
      value: posts.filter((p) => p.status === "rejected").length,
      icon: X,
      color: "red",
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Post Moderation</h1>
        <p className="text-gray-600">Review and moderate community posts</p>
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
          <CardTitle>Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium mb-1">{post.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback>{post.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{post.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>{post.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "approved"
                          ? "default"
                          : post.status === "rejected"
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
                    {post.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">
                        {post.rejectionReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {post.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(post.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(post.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
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







