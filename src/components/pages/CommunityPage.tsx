import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Flag,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  timestamp: string;
  likes: number;
  comments: number;
  status: "Approved" | "Pending" | "Declined";
  isLiked?: boolean;
}

interface Comment {
  id: number;
  postId: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "Sarah Khadka",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      title: "My Germany Visa Journey 🇩🇪",
      description:
        "Just got my visa approved! Here's everything you need to know about the process. I applied through the German Embassy in Kathmandu and it took exactly 3 weeks. Make sure you have all your documents ready...",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      status: "Approved",
      isLiked: false,
    },
    {
      id: 2,
      author: {
        name: "Rohan Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      },
      title: "Tips for IELTS Speaking Test",
      description:
        "Scored 8.5 in speaking! Sharing my preparation strategy and common mistakes to avoid. Practice speaking English daily, record yourself, and focus on fluency over accuracy...",
      timestamp: "5 hours ago",
      likes: 18,
      comments: 12,
      status: "Approved",
      isLiked: true,
    },
    {
      id: 3,
      author: {
        name: "Maya Gurung",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      },
      title: "Scholarship Interview Experience",
      description:
        "Common questions asked during scholarship interviews and how I prepared for them. They asked about my motivation, future goals, and how I plan to contribute to society...",
      timestamp: "1 day ago",
      likes: 31,
      comments: 15,
      status: "Approved",
      isLiked: false,
    },
    {
      id: 4,
      author: {
        name: "Pratik Shrestha",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik",
      },
      title: "Looking for DAAD Scholarship Tips",
      description:
        "I'm planning to apply for DAAD scholarship for Master's in Computer Science. Would love to hear from students who have successfully applied...",
      timestamp: "3 hours ago",
      likes: 5,
      comments: 3,
      status: "Pending",
      isLiked: false,
    },
    {
      id: 5,
      author: {
        name: "Anjali Thapa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
      },
      title: "Best Universities for Engineering in Germany",
      description:
        "After extensive research, here are my top 5 picks for engineering programs in Germany with high acceptance rates for international students...",
      timestamp: "2 days ago",
      likes: 42,
      comments: 20,
      status: "Approved",
      isLiked: true,
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      postId: 1,
      author: {
        name: "Bikash Rai",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bikash",
      },
      content: "Congratulations! How long did the whole process take?",
      timestamp: "1 hour ago",
    },
    {
      id: 2,
      postId: 1,
      author: {
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      },
      content: "This is so helpful! Did you need to show proof of funds?",
      timestamp: "30 minutes ago",
    },
  ]);

  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newComment, setNewComment] = useState("");

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostDescription) return;

    const newPost: Post = {
      id: posts.length + 1,
      author: {
        name: "Pratik Shrestha",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik",
      },
      title: newPostTitle,
      description: newPostDescription,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      status: "Pending",
      isLiked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostDescription("");
    setNewPostDialogOpen(false);
  };

  const handleAddComment = () => {
    if (!newComment || !selectedPost) return;

    const comment: Comment = {
      id: comments.length + 1,
      postId: selectedPost.id,
      author: {
        name: "Pratik Shrestha",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik",
      },
      content: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, comment]);
    setPosts(
      posts.map((post) =>
        post.id === selectedPost.id
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
    setNewComment("");
  };

  const openComments = (post: Post) => {
    setSelectedPost(post);
    setCommentDialogOpen(true);
  };

  const topLikedPosts = [...posts]
    .filter((p) => p.status === "Approved")
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">💬 Student Community</h1>
          <p className="text-gray-600">
            Share your experiences and learn from fellow students
          </p>
        </div>
        <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#007BFF" }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your experience, ask questions, or help others in their
                scholarship journey
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm mb-2 block">Post Title</label>
                <Input
                  placeholder="e.g., My DAAD Scholarship Experience"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Description</label>
                <Textarea
                  placeholder="Share your story, tips, or questions..."
                  rows={6}
                  value={newPostDescription}
                  onChange={(e) => setNewPostDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setNewPostDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  style={{ backgroundColor: "#007BFF" }}
                  onClick={handleCreatePost}
                  disabled={!newPostTitle || !newPostDescription}
                >
                  Submit Post
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Note: Your post will be reviewed before appearing in the community
                feed
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {posts.length === 0 ? (
              <Card className="p-12 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#E9F2FF" }}
                >
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2">No approved posts yet</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to share your story!
                </p>
                <Button
                  style={{ backgroundColor: "#007BFF" }}
                  onClick={() => setNewPostDialogOpen(true)}
                >
                  Create Post
                </Button>
              </Card>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      {/* Author Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>
                              {post.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{post.author.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {post.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              post.status === "Approved"
                                ? "bg-green-600 text-white"
                                : post.status === "Pending"
                                ? "bg-orange-600 text-white"
                                : "bg-red-600 text-white"
                            }
                          >
                            {post.status === "Approved" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {post.status === "Pending" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {post.status === "Declined" && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {post.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Flag className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <h3 className="mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.description}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            post.isLiked
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 ${
                              post.isLiked ? "fill-blue-600" : ""
                            }`}
                          />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button
                          onClick={() => openComments(post)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Liked Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Top Liked Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topLikedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-all cursor-pointer"
                >
                  <CardContent className="p-4">
                    <h4 className="text-sm mb-2 line-clamp-2">{post.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">📋 Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Be respectful and supportive</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Share genuine experiences</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>No spam or promotional content</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Help others in their journey</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
            <DialogDescription className="line-clamp-2">
              {selectedPost?.description}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {comments
                .filter((c) => c.postId === selectedPost?.id)
                .map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="mb-1">{comment.author.name}</div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{comment.timestamp}</span>
                        <button className="hover:text-blue-600">Like</button>
                        <button className="hover:text-blue-600">Reply</button>
                        <button className="hover:text-red-600">
                          <Flag className="h-3 w-3 inline mr-1" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
          <div className="space-y-3 pt-4 border-t">
            <Textarea
              placeholder="Write a comment..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                style={{ backgroundColor: "#007BFF" }}
                onClick={handleAddComment}
                disabled={!newComment}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
