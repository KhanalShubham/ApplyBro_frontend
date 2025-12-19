import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { Post } from '@/types/community';
import { formatRelativeTime } from '@/shared/lib/timeUtils';
import { communityService } from '@/services/communityService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/shared/lib/imageUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, isLiked: boolean) => void;
  onComment?: (post: Post) => void;
  onReport?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onView?: (post: Post) => void;
}

export function PostCard({
  post,
  onLike,
  onComment,
  onReport,
  onEdit,
  onDelete,
  onView,
}: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const isAuthor = user?.id === post.author._id;

  const handleLike = async () => {
    if (isLiking) return;
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    setIsLiking(true);

    try {
      const response = await communityService.toggleLike(post._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);
      onLike?.(post._id, response.data.isLiked);
    } catch (error: any) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      toast.error(error.response?.data?.message || 'Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await communityService.deletePost(post._id);
      toast.success('Post deleted successfully');
      onDelete?.(post._id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const getStatusBadge = () => {
    if (post.status === 'approved') {
      return (
        <Badge className="bg-green-600 text-white">
          <CheckCircle className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    }
    if (post.status === 'pending') {
      return (
        <Badge className="bg-orange-600 text-white">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    }
    if (post.status === 'declined') {
      return (
        <Badge className="bg-red-600 text-white">
          <XCircle className="mr-1 h-3 w-3" />
          Declined
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-6">
        {/* Author Info & Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(post.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthor && getStatusBadge()}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor && (
                    <>
                      {post.status !== 'approved' && (
                        <DropdownMenuItem onClick={() => onEdit?.(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isAuthor && (
                    <DropdownMenuItem onClick={() => onReport?.(post)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Post Content */}
        <h3 className="text-lg font-semibold mb-2 cursor-pointer" onClick={() => onView?.(post)}>
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>

        {/* Images Preview */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {post.images.slice(0, 4).map((image, idx) => (
              <div
                key={idx}
                className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onView?.(post)}
              >
                <img
                  src={getImageUrl(image.url)}
                  alt={image.alt || `Post image ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', image.url);
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tags & Country */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && post.tags.length > 0 && (
            <>
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </>
          )}
          {post.country && (
            <Badge variant="outline">📍 {post.country}</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            onClick={handleLike}
            disabled={!user || isLiking}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-blue-600' : ''}`} />
            <span className="text-sm">{likesCount}</span>
          </button>
          <button
            onClick={() => onComment?.(post)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{post.commentsCount || 0}</span>
          </button>
          {user && !isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReport?.(post)}
              className="ml-auto"
            >
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(post)}
            className="ml-auto"
          >
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




