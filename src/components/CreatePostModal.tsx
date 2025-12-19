import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Upload, X, Loader2 } from 'lucide-react';
import { communityService } from '@/services/communityService';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { Post, PostCategory, PostImage } from '@/types/community';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
  editingPost?: Post | null;
}

const DRAFT_STORAGE_KEY = 'applybro_post_draft';

export function CreatePostModal({ open, onOpenChange, onPostCreated, editingPost }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<PostCategory>('Other');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [country, setCountry] = useState('');
  const [images, setImages] = useState<PostImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!editingPost && open) {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setTitle(parsed.title || '');
          setBody(parsed.body || '');
          setCategory(parsed.category || 'Other');
          setTags(parsed.tags || []);
          setCountry(parsed.country || '');
          setImages(parsed.images || []);
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    } else if (editingPost) {
      setTitle(editingPost.title);
      setBody(editingPost.body);
      setCategory(editingPost.category);
      setTags(editingPost.tags || []);
      setCountry(editingPost.country || '');
      setImages(editingPost.images || []);
    }
  }, [open, editingPost]);

  // Auto-save draft
  useEffect(() => {
    if (!editingPost && open && (title || body)) {
      const draft = {
        title,
        body,
        category,
        tags,
        country,
        images,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [title, body, category, tags, country, images, open, editingPost]);

  const handleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      const fileId = `${Date.now()}-${Math.random()}`;
      setUploadingImages(prev => [...prev, fileId]);

      try {
        const response = await adminService.uploadFile(file, "image");
        if (response.data?.data?.url) {
          setImages(prev => [...prev, { url: response.data.data.url, alt: file.name }]);
          toast.success(`${file.name} uploaded successfully`);
        }
      } catch (error: any) {
        toast.error(`Failed to upload ${file.name}: ${error.response?.data?.message || 'Upload failed'}`);
      } finally {
        setUploadingImages(prev => prev.filter(id => id !== fileId));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Title and body are required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingPost) {
        await communityService.updatePost(editingPost._id, {
          title: title.trim(),
          body: body.trim(),
          category,
          tags,
          country: country.trim() || undefined,
          images,
        });
        toast.success('Post updated successfully');
      } else {
        await communityService.createPost({
          title: title.trim(),
          body: body.trim(),
          category,
          tags,
          country: country.trim() || undefined,
          images,
        });
        // Clear draft on successful submission
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        toast.success('Post created! It will be reviewed by an admin before being published.');
      }

      // Reset form
      setTitle('');
      setBody('');
      setCategory('Other');
      setTags([]);
      setCountry('');
      setImages([]);

      onOpenChange(false);
      onPostCreated?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (!editingPost) {
      // Don't clear draft on close, keep it for next time
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          <DialogDescription>
            Share your experience, ask questions, or help others in their scholarship journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Post Title *</Label>
            <Input
              id="title"
              placeholder="e.g., My DAAD Scholarship Experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/200</p>
          </div>

          {/* Body */}
          <div>
            <Label htmlFor="body">Description *</Label>
            <Textarea
              id="body"
              placeholder="Share your story, tips, or questions..."
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1">{body.length}/5000</p>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: PostCategory) => setCategory(value)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Success Story">Success Story</SelectItem>
                <SelectItem value="Tips">Tips</SelectItem>
                <SelectItem value="Guidance">Guidance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 10}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">{tags.length}/10 tags</p>
          </div>

          {/* Country */}
          <div>
            <Label htmlFor="country">Country (optional)</Label>
            <Input
              id="country"
              placeholder="e.g., Germany, USA, Canada"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Images (optional, max 5MB each)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop images here, or click to select
              </p>
              <label htmlFor="image-upload">
                <Button variant="outline" type="button" asChild>
                  <span>Choose Images</span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt || `Image ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadingImages.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">Uploading {uploadingImages.length} image(s)...</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !body.trim() || isSubmitting || uploadingImages.length > 0}
              style={{ backgroundColor: '#007BFF' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingPost ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                editingPost ? 'Update Post' : 'Submit Post'
              )}
            </Button>
          </div>

          {!editingPost && (
            <p className="text-xs text-gray-600 text-center">
              Note: Your post will be reviewed by an admin before appearing in the community feed
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}




