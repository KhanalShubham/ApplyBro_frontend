import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CalendarDays,
  Plus,
  Bell,
  Bookmark,
  ExternalLink,
  Calendar as CalendarIcon,
  Clock,
  Filter,
} from "lucide-react";
import { motion } from "motion/react";

interface ScholarshipDeadline {
  id: number;
  scholarshipName: string;
  country: string;
  countryFlag: string;
  deadline: Date;
  status: "Applied" | "Bookmarked" | "Upcoming";
  daysLeft: number;
  urgency: "urgent" | "soon" | "normal";
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [filterStatus, setFilterStatus] = useState<"all" | "applied" | "bookmarked" | "upcoming">(
    "all"
  );
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] =
    useState<ScholarshipDeadline | null>(null);

  const [deadlines, setDeadlines] = useState<ScholarshipDeadline[]>([
    {
      id: 1,
      scholarshipName: "Fulbright Scholarship",
      country: "USA",
      countryFlag: "🇺🇸",
      deadline: new Date(2025, 11, 15), // Dec 15, 2025
      status: "Bookmarked",
      daysLeft: 15,
      urgency: "urgent",
    },
    {
      id: 2,
      scholarshipName: "DAAD Scholarship",
      country: "Germany",
      countryFlag: "🇩🇪",
      deadline: new Date(2025, 10, 30), // Nov 30, 2025
      status: "Applied",
      daysLeft: 30,
      urgency: "soon",
    },
    {
      id: 3,
      scholarshipName: "Chevening Scholarship",
      country: "UK",
      countryFlag: "🇬🇧",
      deadline: new Date(2025, 11, 7), // Dec 7, 2025
      status: "Bookmarked",
      daysLeft: 7,
      urgency: "urgent",
    },
    {
      id: 4,
      scholarshipName: "Australia Awards",
      country: "Australia",
      countryFlag: "🇦🇺",
      deadline: new Date(2026, 0, 15), // Jan 15, 2026
      status: "Upcoming",
      daysLeft: 45,
      urgency: "normal",
    },
    {
      id: 5,
      scholarshipName: "MEXT Scholarship",
      country: "Japan",
      countryFlag: "🇯🇵",
      deadline: new Date(2025, 11, 20), // Dec 20, 2025
      status: "Upcoming",
      daysLeft: 20,
      urgency: "soon",
    },
    {
      id: 6,
      scholarshipName: "Erasmus Mundus",
      country: "Europe",
      countryFlag: "🇪🇺",
      deadline: new Date(2025, 10, 25), // Nov 25, 2025
      status: "Applied",
      daysLeft: 25,
      urgency: "soon",
    },
  ]);

  const filteredDeadlines = deadlines.filter((deadline) => {
    if (filterStatus === "all") return true;
    return deadline.status.toLowerCase() === filterStatus;
  });

  const sortedDeadlines = [...filteredDeadlines].sort(
    (a, b) => a.daysLeft - b.daysLeft
  );

  const upcomingDeadline = sortedDeadlines[0];

  const deadlineDates = deadlines.map((d) => d.deadline);

  const handleAddReminder = (scholarship: ScholarshipDeadline) => {
    setSelectedScholarship(scholarship);
    setReminderDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">🗓️ Scholarship Calendar</h1>
          <p className="text-gray-600">
            Track and manage all your scholarship deadlines
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
            style={
              viewMode === "month" ? { backgroundColor: "#007BFF" } : undefined
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Monthly
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            style={
              viewMode === "list" ? { backgroundColor: "#007BFF" } : undefined
            }
          >
            <Clock className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Upcoming Deadline Alert */}
      {upcomingDeadline && upcomingDeadline.urgency === "urgent" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-red-900">
                      Next deadline: {upcomingDeadline.scholarshipName}
                    </h3>
                    <p className="text-sm text-red-700">
                      {upcomingDeadline.countryFlag} {upcomingDeadline.country} •{" "}
                      {upcomingDeadline.daysLeft} days left
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 hover:bg-red-100"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {viewMode === "month" ? (
            /* Calendar View */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Calendar View</span>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Sync to Google Calendar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    deadline: deadlineDates,
                  }}
                  modifiersStyles={{
                    deadline: {
                      backgroundColor: "#007BFF",
                      color: "white",
                      borderRadius: "50%",
                    },
                  }}
                />
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span>Urgent (≤7 days)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span>Upcoming (≤30 days)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* List View */
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Deadlines</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="bookmarked">Bookmarked</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">
                      {sortedDeadlines.length} deadline{sortedDeadlines.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {sortedDeadlines.map((deadline, index) => (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`hover:shadow-lg transition-all border-l-4 ${
                      deadline.urgency === "urgent"
                        ? "border-l-red-500"
                        : deadline.urgency === "soon"
                        ? "border-l-blue-500"
                        : "border-l-gray-300"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{deadline.countryFlag}</span>
                            <h3 className="text-lg">{deadline.scholarshipName}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {deadline.deadline.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <Badge
                              className={
                                deadline.urgency === "urgent"
                                  ? "bg-red-500 text-white"
                                  : deadline.urgency === "soon"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-500 text-white"
                              }
                            >
                              {deadline.daysLeft} days left
                            </Badge>
                            <Badge
                              variant={
                                deadline.status === "Applied"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {deadline.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddReminder(deadline)}
                            >
                              <Bell className="mr-2 h-4 w-4" />
                              Add Reminder
                            </Button>
                            {deadline.status === "Bookmarked" && (
                              <Button
                                size="sm"
                                style={{ backgroundColor: "#007BFF" }}
                              >
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Deadlines</span>
                <Badge variant="secondary">{deadlines.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Applied</span>
                <Badge style={{ backgroundColor: "#007BFF" }} className="text-white">
                  {deadlines.filter((d) => d.status === "Applied").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bookmarked</span>
                <Badge variant="outline">
                  {deadlines.filter((d) => d.status === "Bookmarked").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Urgent (≤7 days)</span>
                <Badge variant="destructive">
                  {deadlines.filter((d) => d.urgency === "urgent").length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* This Week's Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines
                .filter((d) => d.daysLeft <= 7)
                .map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">
                        {deadline.scholarshipName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {deadline.daysLeft} days left
                      </div>
                    </div>
                    <Badge variant="destructive" className="ml-2">
                      {deadline.countryFlag}
                    </Badge>
                  </div>
                ))}
              {deadlines.filter((d) => d.daysLeft <= 7).length === 0 && (
                <p className="text-sm text-gray-600 text-center py-4">
                  No urgent deadlines this week
                </p>
              )}
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">📥 Export Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Google Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Apple Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Outlook Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
            <DialogDescription>
              Set a reminder for {selectedScholarship?.scholarshipName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm mb-2 block">Reminder Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm mb-2 block">Notification Type</label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Note (Optional)</label>
              <Textarea placeholder="Add a note..." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setReminderDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#007BFF" }}
                onClick={() => setReminderDialogOpen(false)}
              >
                Set Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
