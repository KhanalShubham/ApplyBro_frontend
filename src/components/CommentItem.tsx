import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  ThumbsUp,
  Flag,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';
import { Comment } from '@/types/community';
import { communityService } from '@/services/communityService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelativeTime } from '@/shared/lib/timeUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface CommentItemProps {
  comment: Comment;
  onDeleted?: (commentId: string) => void;
  onUpdated?: (comment: Comment) => void;
  onReport?: (comment: Comment) => void;
}

export function CommentItem({ comment, onDeleted, onUpdated, onReport }: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAuthor = user?.id === comment.author._id;

  const handleLike = async () => {
    if (isLiking) return;
    
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    setIsLiking(true);

    try {
      const response = await communityService.toggleCommentLike(comment._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);
    } catch (error: any) {
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      toast.error(error.response?.data?.message || 'Failed to like comment');
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditBody(comment.body);
  };

  const handleSave = async () => {
    if (!editBody.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const response = await communityService.updateComment(comment._id, { body: editBody.trim() });
      setIsEditing(false);
      onUpdated?.(response.data.comment);
      toast.success('Comment updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditBody(comment.body);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      await communityService.deleteComment(comment._id);
      toast.success('Comment deleted successfully');
      onDeleted?.(comment._id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  if (comment.status === 'removed') {
    return (
      <div className="p-3 bg-gray-100 rounded-lg text-gray-500 italic">
        This comment has been removed
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
              {comment.status === 'reported' && (
                <Badge variant="destructive" className="text-xs">Reported</Badge>
              )}
            </div>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAuthor && (
                    <>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isAuthor && (
                    <DropdownMenuItem onClick={() => onReport?.(comment)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={3}
                maxLength={1000}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!editBody.trim() || isSaving}
                  style={{ backgroundColor: '#007BFF' }}
                >
                  {isSaving ? 'Saving...' : <Check className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                isLiked ? 'text-blue-600' : ''
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp className={`h-3 w-3 ${isLiked ? 'fill-blue-600' : ''}`} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>
            {!isAuthor && user && (
              <button
                onClick={() => onReport?.(comment)}
                className="flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <Flag className="h-3 w-3" />
                Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

