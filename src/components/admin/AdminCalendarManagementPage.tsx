import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Trash2, Bell } from "lucide-react";
import { toast } from "sonner";
import { calendarService, CalendarEvent } from "@/services/calendarService";
import { Loader } from "@/components/ui/loader";

export function AdminCalendarManagementPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        type: "event",
        note: "",
        isGlobal: true,
    });

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await calendarService.getEvents();
            // Filter for global events only for admin view
            if ((response as any).success) {
                const globalEvents = (response as any).data.filter((e: any) => e.isGlobal);
                setEvents(globalEvents);
            }
        } catch (error) {
            toast.error("Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async () => {
        if (!newEvent.title || !newEvent.date) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            await calendarService.createEvent({
                ...newEvent,
                type: newEvent.type as any,
                // @ts-ignore
                isGlobal: true
            });
            toast.success("Global event created successfully");
            setCreateDialogOpen(false);
            setNewEvent({ title: "", date: "", type: "event", note: "", isGlobal: true });
            fetchEvents();
        } catch (error) {
            toast.error("Failed to create event");
        }
    };

    const handleDeleteEvent = async (id: string, isAuto: boolean) => {
        if (confirm("Are you sure you want to delete this global event?")) {
            try {
                await calendarService.deleteEvent(id);
                toast.success("Event deleted");
                fetchEvents();
            } catch (error) {
                toast.error("Failed to delete event");
            }
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Calendar & Notifications</h1>
                    <p className="text-gray-600">Manage system-wide events and notifications for students</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Global Event
                </Button>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Global Event</DialogTitle>
                        <DialogDescription>
                            This event will appear on ALL student calendars.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Event Title</label>
                            <Input
                                placeholder="e.g. Scholarship Application Workshop"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Date</label>
                            <Input
                                type="date"
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Event Type</label>
                            <Select
                                value={newEvent.type}
                                onValueChange={(val) => setNewEvent({ ...newEvent, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="event">General Event</SelectItem>
                                    <SelectItem value="deadline">Deadline</SelectItem>
                                    <SelectItem value="reminder">Reminder</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description / Note</label>
                            <Textarea
                                rows={3}
                                placeholder="Details about the event..."
                                value={newEvent.note}
                                onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateEvent} className="bg-blue-600 text-white">
                                Create Event
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Global Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Loader className="h-40" />
                    ) : events.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No global events found. Create one to notify users.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event._id}>
                                        <TableCell>
                                            {new Date(event.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={event.type === 'deadline' ? 'destructive' : 'default'} className="capitalize">
                                                {event.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-gray-500">
                                            {event.note || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteEvent(event._id!, false)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
