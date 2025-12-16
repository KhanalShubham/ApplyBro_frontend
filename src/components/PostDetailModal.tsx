import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { Post, Comment } from '@/types/community';
import { communityService } from '@/services/communityService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelativeTime } from '@/shared/lib/timeUtils';
import { CommentItem } from './CommentItem';
import { ReportModal } from './ReportModal';
import { getImageUrl } from '@/shared/lib/imageUtils';

interface PostDetailModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated?: () => void;
}

export function PostDetailModal({ post: initialPost, open, onOpenChange, onPostUpdated }: PostDetailModalProps) {
  const { user } = useAuth();
  const [post, setPost] = useState<Post>(initialPost);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [reportPost, setReportPost] = useState<Post | null>(null);
  const [reportComment, setReportComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (open) {
      setPost(initialPost);
      fetchComments();
      fetchPostDetails();
    }
  }, [open, initialPost._id]);

  const fetchPostDetails = async () => {
    try {
      const response = await communityService.getPost(initialPost._id);
      setPost(response.data.post);
    } catch (error) {
      console.error('Failed to fetch post details:', error);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await communityService.getComments(initialPost._id);
      setComments(response.data.comments);
    } catch (error: any) {
      console.error('Failed to fetch comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    const newIsLiked = !post.isLiked;
    const newLikesCount = newIsLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1);
    
    setPost(prev => ({ ...prev, isLiked: newIsLiked, likesCount: newLikesCount }));
    setIsLiking(true);

    try {
      const response = await communityService.toggleLike(post._id);
      setPost(prev => ({ ...prev, isLiked: response.data.isLiked, likesCount: response.data.likesCount }));
    } catch (error: any) {
      setPost(prev => ({ ...prev, isLiked: !newIsLiked, likesCount: post.likesCount }));
      toast.error(error.response?.data?.message || 'Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await communityService.addComment(post._id, { body: newComment.trim() });
      setComments(prev => [...prev, response.data.comment]);
      setPost(prev => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
    setPost(prev => ({ ...prev, commentsCount: Math.max(0, (prev.commentsCount || 0) - 1) }));
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(prev => prev.map(c => c._id === updatedComment._id ? updatedComment : c));
  };

  const isAuthor = user?.id === post.author._id;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">{post.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="h-8 w-8">
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
                </DialogDescription>
              </div>
              {user && !isAuthor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReportPost(post)}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Post Body */}
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{post.body}</p>
              </div>

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {post.images.map((image, idx) => (
                    <div key={idx} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))}
                {post.country && <Badge variant="outline">📍 {post.country}</Badge>}
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Comments ({post.commentsCount || 0})
                </h3>

                {isLoadingComments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment._id}
                        comment={comment}
                        onDeleted={handleCommentDeleted}
                        onUpdated={handleCommentUpdated}
                        onReport={() => setReportComment(comment)}
                      />
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {user && (
                  <div className="mt-6 space-y-3 pt-4 border-t">
                    <Textarea
                      placeholder="Write a comment..."
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{newComment.length}/1000</p>
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                        style={{ backgroundColor: '#007BFF' }}
                      >
                        {isSubmittingComment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          'Post Comment'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Actions Footer */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.isLiked
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-600'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp className={`h-5 w-5 ${post.isLiked ? 'fill-blue-600' : ''}`} />
              <span>{post.likesCount || 0}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="h-5 w-5" />
              <span>{post.commentsCount || 0}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Modals */}
      {reportPost && (
        <ReportModal
          resourceType="post"
          resourceId={reportPost._id}
          open={!!reportPost}
          onOpenChange={(open) => {
            if (!open) setReportPost(null);
          }}
          onReportSubmitted={() => {
            setReportPost(null);
            toast.success('Report submitted successfully');
          }}
        />
      )}

      {reportComment && (
        <ReportModal
          resourceType="comment"
          resourceId={reportComment._id}
          open={!!reportComment}
          onOpenChange={(open) => {
            if (!open) setReportComment(null);
          }}
          onReportSubmitted={() => {
            setReportComment(null);
            toast.success('Report submitted successfully');
          }}
        />
      )}
    </>
  );
}



