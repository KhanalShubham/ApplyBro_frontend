import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Home,
  GraduationCap,
  Folder,
  Bookmark,
  BookOpen,
  MessageCircle,
  CalendarDays,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Upload,
  CheckCircle,
  Clock,
  FileText,
  Video,
  FileCheck,
  TrendingUp,
  Sparkles,
  LogOut,
  User,
  ChevronLeft,
  Bot,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScholarshipsPage } from "./pages/ScholarshipsPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { SavedItemsPage } from "./pages/SavedItemsPage";
import { GuidancePage } from "./pages/GuidancePage";
import { CommunityPage } from "./pages/CommunityPage";
import { CalendarPage } from "./pages/CalendarPage";
import { SettingsPage } from "./pages/SettingsPage";
import { RecommendationsPage } from "./RecommendationsPage";
import { Loader } from "./ui/loader";

import { useAuth } from "../contexts/AuthContext";
import { scholarshipService } from "../services/scholarshipService";
import { documentService } from "../services/documentService";
import { communityService } from "../services/communityService";
import { calendarService } from "../services/calendarService";
import { toast } from "sonner";
import { getImageUrl } from "../shared/lib/imageUtils";
import { ModeToggle } from "./mode-toggle";
import { ConfirmDialog } from "./ConfirmDialog";

interface DashboardProps {
  onLogout?: () => void;
  userName?: string;
}

export function Dashboard({ onLogout, userName }: DashboardProps) {
  const { user, logout } = useAuth();
  const displayName = userName || user?.name || "User";

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notificationCount, setNotificationCount] = useState(0);

  // Dynamic Data State
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState({
    savedCount: 0,
    verifiedDocs: 0,
    deadlines: 0,
    applicationProgress: 0
  });
  const [recommendedScholarships, setRecommendedScholarships] = useState<any[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeSection]);

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      // Parallel data fetching
      const [
        recResponse,
        docsResponse,
        postsResponse,
        eventsResponse
      ] = await Promise.all([
        scholarshipService.getRecommendations(5).catch(() => ({ data: { scholarships: [] } })),
        documentService.getMyDocuments().catch(() => ({ data: { documents: [] } })),
        communityService.getPosts({ sort: 'latest', pageSize: 3, status: 'approved' }).catch(() => ({ data: { posts: [] } })),
        calendarService.getEvents().catch(() => ({ success: false, data: [] }))
      ]);

      // Process Scholarships
      // @ts-ignore
      setRecommendedScholarships(recResponse.data?.scholarships || []);

      // Process Documents
      // @ts-ignore
      const allDocs = docsResponse.data?.documents || [];
      setRecentDocuments(allDocs.slice(0, 2));
      const verifiedCount = allDocs.filter((d: any) => d.status === 'verified').length;

      // Process Posts
      // @ts-ignore
      setCommunityPosts(postsResponse.data?.posts || []);

      // Process Events
      // @ts-ignore
      const allEvents = eventsResponse.data || [];
      setUpcomingEvents(allEvents);
      const upcomingDeadlines = allEvents.filter((e: any) => e.type === 'deadline' && new Date(e.date) > new Date()).length;

      // Calculate Stats
      const profileFields = ['name', 'email', 'profile.bio', 'profile.education', 'profile.interests'];
      // Simple mock profile completion
      const completion = 60 + (allDocs.length > 0 ? 20 : 0) + (user?.avatar ? 10 : 0);

      setStats({
        savedCount: user?.bookmarks?.length || 0,
        verifiedDocs: verifiedCount,
        deadlines: upcomingDeadlines,
        applicationProgress: Math.min(completion, 100)
      });

      // Set notifications count (events appearing in next 3 days)
      const urgentNotifications = allEvents.filter((e: any) => {
        const diff = new Date(e.date).getTime() - new Date().getTime();
        return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
      }).length;
      setNotificationCount(urgentNotifications);

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setDashboardLoading(false);
    }
  };

  const sidebarItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "scholarships", icon: GraduationCap, label: "Scholarships" },
    { id: "recommendations", icon: Target, label: "Recommendations" },
    { id: "documents", icon: Folder, label: "My Documents" },
    { id: "saved", icon: Bookmark, label: "Saved Items" },
    { id: "guidance", icon: BookOpen, label: "Guidance" },
    { id: "community", icon: MessageCircle, label: "Community" },
    { id: "calendar", icon: CalendarDays, label: "Calendar" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const achievements = [
    { icon: User, label: "Profile Created", unlocked: true },
    { icon: FileCheck, label: "Docs Verified", unlocked: stats.verifiedDocs > 0 },
    { icon: Target, label: "Scholarship Saver", unlocked: stats.savedCount > 0 },
  ];

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        background: "var(--background)",
      }}
    >
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#007BFF" }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl block" style={{ color: "#007BFF" }}>
                ApplyBro
              </span>
              <span className="text-xs text-muted-foreground -mt-1 block">Empowering Students</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships, posts, or colleges…"
                className="pl-10 bg-muted/50 border-input"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ChevronLeft className={`h-5 w-5 text-muted-foreground transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <ModeToggle />

            {/* Notifications */}
            <button className="relative p-2 hover:bg-accent rounded-lg transition-colors" onClick={() => setActiveSection('calendar')}>
              <Bell className="h-5 w-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-accent rounded-lg p-1 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getImageUrl(user?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                    <AvatarFallback>{displayName[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveSection("settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div
          aria-hidden
          className={`${sidebarCollapsed ? "hidden md:block w-16" : "hidden md:block w-64"}`}
        />

        <aside
          className={`fixed left-0 top-16 bottom-0 bg-background/80 backdrop-blur-lg border-r border-border transition-all duration-300 z-30 
            ${sidebarCollapsed ? "w-16" : "w-64"}
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 py-4">
              <nav className="space-y-1 px-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeSection === item.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </button>
                ))}
              </nav>
            </ScrollArea>

            {/* Collapse Toggle */}
            <div className="p-2 border-t border-border">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"
            } ml-0`}
        >
          <AnimatePresence mode="wait">
            {/* Render different pages based on active section */}
            {activeSection !== "dashboard" ? (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "scholarships" && <ScholarshipsPage />}
                {activeSection === "recommendations" && <RecommendationsPage onSectionChange={handleSectionChange} />}
                {activeSection === "documents" && <DocumentsPage />}
                {activeSection === "saved" && <SavedItemsPage />}
                {activeSection === "guidance" && <GuidancePage />}
                {activeSection === "community" && <CommunityPage />}
                {activeSection === "calendar" && <CalendarPage />}
                {activeSection === "settings" && <SettingsPage />}
              </motion.div>
            ) : (
              /* Dashboard Home */
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {dashboardLoading ? (
                  <div className="flex h-[80vh] items-center justify-center">
                    <Loader className="h-12 w-12 text-blue-500" />
                  </div>
                ) : (
                  <div className="p-4 lg:p-8 max-w-[1800px] mx-auto">
                    <div className="grid lg:grid-cols-12 gap-6">
                      {/* Main Dashboard Column */}
                      <div className="lg:col-span-9 space-y-6">
                        {/* Welcome Header */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white border-0 overflow-hidden relative shadow-2xl shadow-blue-500/30 hover:shadow-3xl transition-shadow duration-500">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36 blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full -ml-28 -mb-28 blur-2xl" />
                            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                            <CardContent className="p-8 relative z-10">
                              <div className="flex items-start justify-between mb-6">
                                <div>
                                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Hi, {displayName} 👋</h1>
                                  <p className="text-white/90 text-base font-medium">
                                    Here's your scholarship journey overview
                                  </p>
                                </div>
                              </div>
                              <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-between text-sm mb-3">
                                  <span className="text-white/90 font-semibold">Profile Completion</span>
                                  <span className="text-white font-bold text-lg">{Math.round(stats.applicationProgress)}%</span>
                                </div>
                                <Progress value={stats.applicationProgress} className="h-3 bg-white/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-500" style={{ width: `${stats.applicationProgress}%` }} />
                                </Progress>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-6">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-transform duration-200 font-semibold shadow-lg"
                                  onClick={() => setActiveSection("documents")}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Documents
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all duration-200 font-semibold"
                                  onClick={() => setActiveSection("scholarships")}
                                >
                                  <Search className="mr-2 h-4 w-4" />
                                  Find Scholarships
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all duration-200 font-semibold"
                                  onClick={() => setActiveSection("guidance")}
                                >
                                  <Award className="mr-2 h-4 w-4" />
                                  Practice Test
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Quick Stats Cards */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                              whileHover={{ y: -4, scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              onClick={() => setActiveSection("saved")}
                            >
                              <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 overflow-hidden relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <CardContent className="p-6 relative z-10">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                      <Bookmark className="h-7 w-7 text-white" />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-3xl font-bold text-blue-900 tracking-tight">{stats.savedCount}</h3>
                                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Scholarships Saved</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                            <motion.div
                              whileHover={{ y: -4, scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              onClick={() => setActiveSection("calendar")}
                            >
                              <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <CardContent className="p-6 relative z-10">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                                      <CalendarDays className="h-7 w-7 text-white" />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-3xl font-bold text-green-900 tracking-tight">{stats.deadlines}</h3>
                                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Upcoming Events</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                            <motion.div
                              whileHover={{ y: -4, scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              onClick={() => setActiveSection("documents")}
                            >
                              <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 overflow-hidden relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <CardContent className="p-6 relative z-10">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                      <CheckCircle className="h-7 w-7 text-white" />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-3xl font-bold text-purple-900 tracking-tight">{stats.verifiedDocs}</h3>
                                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Verified Documents</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Achievement Badges */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <div className="flex items-center gap-4 overflow-x-auto pb-2">
                            {achievements.map((achievement, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 whitespace-nowrap ${achievement.unlocked
                                  ? "bg-blue-50 border-blue-200 text-blue-700"
                                  : "bg-gray-50 border-border text-muted-foreground"
                                  }`}
                              >
                                <achievement.icon className="h-4 w-4" />
                                <span className="text-sm">{achievement.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Recommended Scholarships */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="flex items-center gap-2 font-semibold text-lg">
                              🎯 Recommended For You
                            </h2>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveSection("scholarships")}
                            >
                              View All
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          {recommendedScholarships.length === 0 ? (
                            <div className="text-center py-8 bg-muted/50 rounded-xl border border-dashed text-muted-foreground">
                              No recommendations yet. Complete your profile to get matched!
                            </div>
                          ) : (
                            <ScrollArea className="w-full">
                              <div className="flex gap-5 pb-4">
                                {recommendedScholarships.map((scholarship, index) => (
                                  <motion.div
                                    key={scholarship._id || index}
                                    whileHover={{ scale: 1.03, y: -8 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="min-w-[320px]"
                                  >
                                    <Card className="hover:shadow-2xl transition-all duration-300 bg-card border-0 shadow-md hover:border-blue-300/50 overflow-hidden group cursor-pointer h-full">
                                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 transition-all duration-300" />
                                      <CardContent className="p-6 relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                          <span className="text-3xl">{scholarship.country === 'USA' ? '🇺🇸' : scholarship.country === 'UK' ? '🇬🇧' : scholarship.country === 'Germany' ? '🇩🇪' : '🌍'}</span>
                                          <Badge
                                            className={`${scholarship.status === 'open' ? 'bg-green-500' : 'bg-orange-500'} text-white font-semibold shadow-sm px-2.5 py-1 capitalize`}
                                          >
                                            {scholarship.status}
                                          </Badge>
                                        </div>
                                        <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-blue-600 transition-colors line-clamp-2">{scholarship.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap mt-auto">
                                          <Badge variant="outline" className="font-medium">{scholarship.level}</Badge>
                                          <span className="text-muted-foreground">•</span>
                                          <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="font-medium">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                                          </div>
                                        </div>
                                        <Button
                                          className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                          style={{ backgroundColor: "#007BFF" }}
                                          onClick={() => setActiveSection("scholarships")}
                                        >
                                          View Details
                                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                ))}
                              </div>
                            </ScrollArea>
                          )}
                        </motion.div>

                        {/* Document Status */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h2 className="mb-6 text-xl font-bold text-foreground">📁 Recent Documents</h2>
                          <div className="grid md:grid-cols-2 gap-6">
                            {recentDocuments.length === 0 ? (
                              <div className="col-span-2 text-center py-6 bg-muted/50 rounded-xl border border-dashed">
                                <p className="text-muted-foreground mb-2">No documents uploaded yet.</p>
                                <Button variant="outline" size="sm" onClick={() => setActiveSection("documents")}>Upload Now</Button>
                              </div>
                            ) : (
                              recentDocuments.map((doc, idx) => (
                                <motion.div
                                  key={doc._id || idx}
                                  whileHover={{ y: -4, scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Card className={`border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br overflow-hidden relative group cursor-pointer ${doc.status === 'verified' ? 'from-green-50 to-green-100/50' : 'from-orange-50 to-orange-100/50'
                                    }`}>
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${doc.status === 'verified' ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'
                                      }`} />
                                    <CardContent className="p-6 relative z-10">
                                      <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${doc.status === 'verified' ? 'bg-green-100' : 'bg-orange-100'
                                            }`}>
                                            {doc.status === 'verified' ? (
                                              <CheckCircle className="h-6 w-6 text-green-600" />
                                            ) : (
                                              <Clock className="h-6 w-6 text-orange-600" />
                                            )}
                                          </div>
                                          <Badge className={`font-semibold shadow-sm ${doc.status === 'verified' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                                            }`}>
                                            {doc.status === 'verified' ? 'Verified' : 'Pending'}
                                          </Badge>
                                        </div>
                                      </div>
                                      <h3 className="text-lg font-bold mb-2 text-foreground">{doc.name}</h3>
                                      <p className="text-sm text-muted-foreground font-medium">
                                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                                      </p>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))
                            )}
                          </div>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setActiveSection("documents")}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            View All Documents
                          </Button>
                        </motion.div>

                        {/* Community Feed Preview */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-xl">💬 Community Highlights</h2>
                            <Button variant="ghost" size="sm" onClick={() => setActiveSection("community")}>View Community</Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            {communityPosts.map((post, i) => (
                              <Card key={post._id || i} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveSection("community")}>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name}`} />
                                      <AvatarFallback>{post.author?.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-semibold">{post.author?.name}</p>
                                      <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <h3 className="font-bold text-md mb-1">{post.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          <Card className="mt-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} />
                                  <AvatarFallback>{displayName[0]}</AvatarFallback>
                                </Avatar>
                                <button
                                  onClick={() => setActiveSection("community")}
                                  className="flex-1 text-left px-4 py-3 bg-card rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all hover:shadow-md cursor-pointer"
                                >
                                  <p className="text-muted-foreground">Share your experience, ask questions, or help others...</p>
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      {/* Right Sidebar Column */}
                      <div className="lg:col-span-3 space-y-6">
                        {/* Upcoming Deadlines */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Clock className="w-5 h-5 text-blue-500" />
                              Upcoming
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {upcomingEvents.slice(0, 4).map((event, i) => (
                              <div key={event._id || i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${event.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                <div>
                                  <p className="text-sm font-medium">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                </div>
                              </div>
                            ))}
                            {upcomingEvents.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-2">No upcoming events.</p>
                            )}
                            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveSection("calendar")}>
                              View Calendar
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        description="Are you sure you want to logout? You'll need to sign in again to access your dashboard."
        confirmText="Logout"
        cancelText="Stay"
        variant="default"
      />
    </div>
  );
}
