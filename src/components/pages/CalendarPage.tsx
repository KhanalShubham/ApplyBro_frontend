import { useState, useEffect } from "react";
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
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { calendarService, CalendarEvent } from "@/services/calendarService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [filterStatus, setFilterStatus] = useState<"all" | "deadline" | "reminder" | "event">("all");
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [reminderDate, setReminderDate] = useState("");
  const [reminderType, setReminderType] = useState("email");
  const [reminderNote, setReminderNote] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await calendarService.getEvents();
      if ((response as any).success) {
        setEvents((response as any).data);
      }
    } catch (error) {
      console.error("Failed to fetch calendar events", error);
      toast.error("Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateReminder = async () => {
    if (!reminderDate || !newEventTitle) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await calendarService.createEvent({
        title: newEventTitle,
        date: new Date(reminderDate),
        type: 'reminder',
        reminderPreferences: {
          email: reminderType === 'email' || reminderType === 'both',
          push: reminderType === 'push' || reminderType === 'both',
          reminderDate: new Date(reminderDate)
        },
        note: reminderNote
      });
      toast.success("Reminder created successfully");
      setReminderDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Failed to create reminder", error);
      toast.error("Failed to create reminder");
    }
  };

  const handleDeleteEvent = async (id: string, isAuto: boolean) => {
    if (isAuto) {
      toast.error("Cannot delete auto-generated deadlines. Unsave the scholarship instead.");
      return;
    }

    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await calendarService.deleteEvent(id);
        toast.success("Event deleted");
        fetchEvents();
      } catch (error) {
        console.error("Failed to delete event", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const resetForm = () => {
    setNewEventTitle("");
    setReminderDate("");
    setReminderNote("");
    setReminderType("email");
    setSelectedEvent(null);
  };

  const openAddDialog = () => {
    resetForm();
    setReminderDialogOpen(true);
  };

  const filteredEvents = events.filter((event) => {
    if (filterStatus === "all") return true;
    return event.type === filterStatus;
  });

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find upcoming urgent deadline (within 7 days)
  const upcomingUrgent = sortedEvents.find(e => {
    const daysLeft = Math.ceil((new Date(e.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 7;
  });

  const eventDates = events.map((e) => new Date(e.date));

  if (isLoading) return <Loader className="min-h-[400px]" />;

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
          <Button onClick={openAddDialog} style={{ backgroundColor: "#007BFF" }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
            className={viewMode === "month" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Monthly
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
          >
            <Clock className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Upcoming Deadline Alert */}
      {upcomingUrgent && (
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
                    <h3 className="text-red-900 font-bold">
                      Upcoming: {upcomingUrgent.title}
                    </h3>
                    <p className="text-sm text-red-700">
                      due on {new Date(upcomingUrgent.date).toLocaleDateString()}
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
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-sm font-normal">
                      <div className="w-3 h-3 rounded-full bg-blue-500" /> Deadline
                      <div className="w-3 h-3 rounded-full bg-green-500" /> Reminder
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    event: eventDates
                  }}
                  modifiersStyles={{
                    event: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      color: '#007BFF'
                    }
                  }}
                />
                {/* Selected Date Events */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-2">Events on {selectedDate?.toLocaleDateString()}</h3>
                  {selectedDate && events.filter(e => new Date(e.date).toDateString() === selectedDate.toDateString()).length === 0 ? (
                    <p className="text-gray-500 text-sm">No events for this day.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDate && events
                        .filter(e => new Date(e.date).toDateString() === selectedDate.toDateString())
                        .map((e, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                            <div className="flex items-center gap-2">
                              <Badge className={e.type === 'deadline' ? 'bg-blue-500' : 'bg-green-500'}>
                                {e.type}
                              </Badge>
                              <span className="font-medium">{e.title}</span>
                            </div>
                            {!e.isAutoGenerated && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(e._id!, false)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  )}
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
                    <Select value={filterStatus} onValueChange={(val: any) => setFilterStatus(val)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="deadline">Deadlines</SelectItem>
                        <SelectItem value="reminder">Reminders</SelectItem>
                        <SelectItem value="event">General Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {sortedEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No events found.</div>
              ) : (
                sortedEvents.map((event, index) => {
                  const dateObj = new Date(event.date);
                  const daysLeft = Math.ceil((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isPast = daysLeft < 0;

                  return (
                    <motion.div
                      key={event._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`hover:shadow-lg transition-all border-l-4 ${event.type === 'deadline' ? 'border-l-blue-500' : 'border-l-green-500'
                          } ${isPast ? 'opacity-60 grayscale' : ''}`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold">{event.title}</h3>
                                {isPast && <Badge variant="secondary">Past</Badge>}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-4 w-4" />
                                  {dateObj.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {!isPast && (
                                  <Badge variant="outline">
                                    {daysLeft === 0 ? "Today" : `${daysLeft} days left`}
                                  </Badge>
                                )}
                                <Badge
                                  className={event.type === 'deadline' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                                >
                                  {event.type}
                                </Badge>
                              </div>
                              {event.note && (
                                <p className="text-sm text-gray-500 italic mb-2">"{event.note}"</p>
                              )}
                            </div>

                            {!event.isAutoGenerated && (
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event._id!, false)}>
                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
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
                <span className="text-sm text-gray-600">Total Events</span>
                <Badge variant="secondary">{events.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Scholarship Deadlines</span>
                <Badge className="bg-blue-500 text-white">
                  {events.filter((d) => d.type === "deadline").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Custom Reminders</span>
                <Badge className="bg-green-500 text-white">
                  {events.filter((d) => d.type === "reminder").length}
                </Badge>
              </div>
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

      {/* Add/Edit Event Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a custom reminder or event for your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm mb-2 block font-medium">Event Title</label>
              <Input
                placeholder="e.g., Submit Application, IELTS Exam"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm mb-2 block font-medium">Date</label>
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm mb-2 block font-medium">Notification Type</label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block font-medium">Note (Optional)</label>
              <Textarea
                placeholder="Add a note..."
                rows={3}
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
              />
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
                onClick={handleCreateReminder}
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
