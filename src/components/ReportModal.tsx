import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { communityService } from '@/services/communityService';
import { toast } from 'sonner';

interface ReportModalProps {
  resourceType: 'post' | 'comment';
  resourceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportSubmitted?: () => void;
}

const REPORT_REASONS = [
  'Spam or misleading content',
  'Harassment or bullying',
  'Inappropriate content',
  'False information',
  'Copyright violation',
  'Other',
];

export function ReportModal({
  resourceType,
  resourceId,
  open,
  onOpenChange,
  onReportSubmitted,
}: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please select a reason');
      return;
    }

    setIsSubmitting(true);

    try {
      if (resourceType === 'post') {
        await communityService.reportPost(resourceId, {
          reason: reason.trim(),
          details: details.trim() || undefined,
        });
      } else {
        await communityService.reportComment(resourceId, {
          reason: reason.trim(),
          details: details.trim() || undefined,
        });
      }

      toast.success('Report submitted successfully. Our moderators will review it.');
      setReason('');
      setDetails('');
      onOpenChange(false);
      onReportSubmitted?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report {resourceType === 'post' ? 'Post' : 'Comment'}</DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting content that violates our guidelines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="reason">Reason for reporting *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide more information about why you're reporting this..."
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{details.length}/500</p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason.trim() || isSubmitting}
              style={{ backgroundColor: '#007BFF' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


