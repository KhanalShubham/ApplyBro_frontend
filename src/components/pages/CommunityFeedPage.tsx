import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PostCard } from '../PostCard';
import { CreatePostModal } from '../CreatePostModal';
import { PostDetailModal } from '../PostDetailModal';
import { ReportModal } from '../ReportModal';
import { Post } from '@/types/community';
import { communityService } from '@/services/communityService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '../ui/loader';
import {
  Plus,
  Search,
  TrendingUp,
  CheckCircle,
  Filter,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Removed unused import

export function CommunityFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reportPost, setReportPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        sort: sortBy,
      };
      
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedTag && selectedTag !== 'all') params.tag = selectedTag;
      if (selectedCountry) params.country = selectedCountry;
      
      const response = await communityService.getPosts(params);
      setPosts(response.data.posts);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (error: any) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, sortBy, selectedCategory, selectedTag, selectedCountry]);

  const handleLike = (postId: string, isLiked: boolean) => {
    setPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? { ...post, isLiked, likesCount: isLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1) }
          : post
      )
    );
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const handleReport = async (post: Post) => {
    setReportPost(post);
  };

  const handleReportSubmitted = () => {
    setReportPost(null);
    toast.success('Report submitted. Our moderators will review it.');
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setCreateModalOpen(true);
  };

  const handleView = (post: Post) => {
    setSelectedPost(post);
  };

  // Get unique tags and countries from posts
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  const allCountries = Array.from(new Set(posts.map(p => p.country).filter(Boolean)));

  // Top liked posts for sidebar
  const topLikedPosts = [...posts]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 3);

  if (isLoading && posts.length === 0) {
    return <Loader className="min-h-[400px]" />;
  }

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
        {user && (
          <Button
            onClick={() => {
              setEditingPost(null);
              setCreateModalOpen(true);
            }}
            style={{ backgroundColor: '#007BFF' }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Success Story">Success Story</SelectItem>
                <SelectItem value="Tips">Tips</SelectItem>
                <SelectItem value="Guidance">Guidance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: 'latest' | 'popular') => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory !== 'all' || (selectedTag && selectedTag !== 'all') || selectedCountry) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Category: {selectedCategory}
                  <X className="ml-2 h-3 w-3" />
                </Button>
              )}
              {selectedTag && selectedTag !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTag('all')}
                >
                  Tag: {selectedTag}
                  <X className="ml-2 h-3 w-3" />
                </Button>
              )}
              {selectedCountry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCountry('')}
                >
                  Country: {selectedCountry}
                  <X className="ml-2 h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {posts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-50">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2">No posts found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory !== 'all' || (selectedTag && selectedTag !== 'all') || selectedCountry
                    ? 'Try adjusting your filters'
                    : 'Be the first to share your story!'}
                </p>
                {user && (
                  <Button
                    style={{ backgroundColor: '#007BFF' }}
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                )}
              </Card>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleView}
                    onReport={handleReport}
                    onEdit={handleEdit}
                    onDelete={handlePostDeleted}
                    onView={handleView}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Liked Posts */}
          {topLikedPosts.length > 0 && (
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
                    key={post._id}
                    className="hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleView(post)}
                  >
                    <CardContent className="p-4">
                      <h4 className="text-sm mb-2 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>👍 {post.likesCount || 0}</span>
                        <span>💬 {post.commentsCount || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

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

      {/* Modals */}
      <CreatePostModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditingPost(null);
        }}
        onPostCreated={handlePostCreated}
        editingPost={editingPost}
      />

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          open={!!selectedPost}
          onOpenChange={(open) => {
            if (!open) setSelectedPost(null);
          }}
          onPostUpdated={fetchPosts}
        />
      )}

      {reportPost && (
        <ReportModal
          resourceType="post"
          resourceId={reportPost._id}
          open={!!reportPost}
          onOpenChange={(open) => {
            if (!open) setReportPost(null);
          }}
          onReportSubmitted={handleReportSubmitted}
        />
      )}
    </div>
  );
}




