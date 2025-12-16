import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Search,
  CheckCircle,
  X,
  Clock,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { Loader } from '../ui/loader';
import { Report } from '@/types/community';
import { formatRelativeTime } from '@/shared/lib/timeUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'open' | 'reviewed' | 'resolved' | 'all'>('open');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [actionTaken, setActionTaken] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getReports(filterStatus, pagination.page, pagination.pageSize);
      if (response.data && response.data.data) {
        setReports(response.data.data.reports || []);
        setPagination(prev => ({ ...prev, ...(response.data.data.pagination || {}) }));
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [pagination.page, filterStatus]);

  const handleResolve = (report: Report) => {
    setSelectedReport(report);
    setResolveModalOpen(true);
  };

  const handleResolveSubmit = async () => {
    if (!selectedReport || !actionTaken.trim()) {
      toast.error('Please select an action taken');
      return;
    }

    try {
      await adminService.resolveReport(selectedReport._id, actionTaken.trim());
      toast.success('Report resolved successfully');
      setResolveModalOpen(false);
      setSelectedReport(null);
      setActionTaken('');
      fetchReports();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resolve report');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading && reports.length === 0) {
    return <Loader className="min-h-[400px]" />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reports Management</h1>
        <p className="text-gray-600">Review and resolve content reports</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reported Content</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <Badge variant="outline" className="mb-1">
                            {report.resourceType === 'post' ? 'Post' : 'Comment'}
                          </Badge>
                          {report.resourceType === 'post' && report.resource && 'title' in report.resource && (
                            <p className="text-sm font-medium truncate">{report.resource.title}</p>
                          )}
                          {report.resourceType === 'comment' && report.resource && 'body' in report.resource && (
                            <p className="text-sm text-gray-600 line-clamp-2">{report.resource.body}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{report.reporter.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{report.reporter.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{report.reason}</p>
                          {report.details && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{report.details}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatRelativeTime(report.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'resolved'
                              ? 'default'
                              : report.status === 'reviewed'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {report.status === 'open' && <Clock className="mr-1 h-3 w-3" />}
                          {report.status === 'reviewed' && <Eye className="mr-1 h-3 w-3" />}
                          {report.status === 'resolved' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                        {report.actionTaken && (
                          <p className="text-xs text-gray-600 mt-1">Action: {report.actionTaken}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === 'open' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleResolve(report)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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

      {/* Resolve Report Modal */}
      <Dialog open={resolveModalOpen} onOpenChange={setResolveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Select the action taken for this report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedReport && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Report Reason:</p>
                <p className="font-medium">{selectedReport.reason}</p>
                {selectedReport.details && (
                  <p className="text-sm text-gray-600 mt-2">{selectedReport.details}</p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="actionTaken">Action Taken *</Label>
              <Select value={actionTaken} onValueChange={setActionTaken}>
                <SelectTrigger id="actionTaken">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deleted">Deleted Content</SelectItem>
                  <SelectItem value="warning">Warning Issued</SelectItem>
                  <SelectItem value="hidden">Hidden from Public</SelectItem>
                  <SelectItem value="none">No Action Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setResolveModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleResolveSubmit}
                disabled={!actionTaken}
                style={{ backgroundColor: '#007BFF' }}
              >
                Resolve Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



