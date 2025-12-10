import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
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

import { useAuth } from "../contexts/AuthContext";

interface DashboardProps {
  onLogout?: () => void;
  userName?: string;
}

export function Dashboard({ onLogout, userName }: DashboardProps) {
  const { user, logout } = useAuth();
  const displayName = userName || user?.name || "User";
  
  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAssistant, setShowAssistant] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false); // Close mobile menu when switching sections
  };

  const sidebarItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "scholarships", icon: GraduationCap, label: "Scholarships" },
    { id: "documents", icon: Folder, label: "My Documents" },
    { id: "saved", icon: Bookmark, label: "Saved Items" },
    { id: "guidance", icon: BookOpen, label: "Guidance" },
    { id: "community", icon: MessageCircle, label: "Community" },
    { id: "calendar", icon: CalendarDays, label: "Calendar" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const recommendedScholarships = [
    {
      name: "Fulbright Scholarship",
      country: "🇺🇸",
      degree: "Master",
      deadline: "15 days left",
      status: "Open",
      statusColor: "bg-green-500",
    },
    {
      name: "DAAD Scholarship",
      country: "🇩🇪",
      degree: "Bachelor",
      deadline: "30 days left",
      status: "Open",
      statusColor: "bg-green-500",
    },
    {
      name: "Chevening Scholarship",
      country: "🇬🇧",
      degree: "Master",
      deadline: "7 days left",
      status: "Closing Soon",
      statusColor: "bg-orange-500",
    },
    {
      name: "Australia Awards",
      country: "🇦🇺",
      degree: "+2",
      deadline: "45 days left",
      status: "Open",
      statusColor: "bg-green-500",
    },
  ];

  const guidanceResources = [
    {
      title: "How to Write a Motivation Letter",
      type: "Article",
      icon: FileText,
      progress: 60,
    },
    {
      title: "Top IELTS Tips",
      type: "Video",
      icon: Video,
      progress: 30,
    },
    {
      title: "DAAD Application Example",
      type: "PDF",
      icon: FileCheck,
      progress: 0,
    },
  ];

  const communityPosts = [
    {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      name: "Sarah Khadka",
      title: "My Germany Visa Journey 🇩🇪",
      preview: "Just got my visa approved! Here's everything you need to know...",
    },
    {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      name: "Rohan Sharma",
      title: "Tips for IELTS Speaking Test",
      preview: "Scored 8.5 in speaking. Sharing my preparation strategy...",
    },
    {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      name: "Maya Gurung",
      title: "Scholarship Interview Experience",
      preview: "Common questions asked during scholarship interviews...",
    },
  ];

  const achievements = [
    { icon: CheckCircle, label: "Profile Verified", unlocked: true },
    { icon: FileCheck, label: "First Scholarship Applied", unlocked: true },
    { icon: Target, label: "Active Learner", unlocked: false },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #E9F2FF 0%, #ffffff 100%)",
      }}
    >
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
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
              <span className="text-xs text-gray-500 -mt-1 block">Empowering Students</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search scholarships, posts, or colleges…"
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ChevronLeft className={`h-5 w-5 text-gray-600 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} />
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
                <DropdownMenuItem onClick={handleLogout}>
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
        {/* Reserve space for the fixed sidebar on md+ screens so it doesn't overlay content */}
        <div
          aria-hidden
          className={`${sidebarCollapsed ? "hidden md:block w-16" : "hidden md:block w-64"}`}
        />

        <aside
          className={`fixed left-0 top-16 bottom-0 bg-white/80 backdrop-blur-lg border-r border-gray-200 transition-all duration-300 z-30 
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
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
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
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          } ml-0`}
        >
          <AnimatePresence mode="wait">
            {/* Render different pages based on active section */}
            {activeSection === "scholarships" && (
              <motion.div
                key="scholarships"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ScholarshipsPage />
              </motion.div>
            )}
            {activeSection === "documents" && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentsPage />
              </motion.div>
            )}
            {activeSection === "saved" && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SavedItemsPage />
              </motion.div>
            )}
            {activeSection === "guidance" && (
              <motion.div
                key="guidance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <GuidancePage />
              </motion.div>
            )}
            {activeSection === "community" && (
              <motion.div
                key="community"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CommunityPage />
              </motion.div>
            )}
            {activeSection === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarPage />
              </motion.div>
            )}
            {activeSection === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsPage />
              </motion.div>
            )}

            {/* Dashboard Home */}
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
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
                          <span className="text-white font-bold text-lg">80%</span>
                        </div>
                        <Progress value={80} className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-500" style={{ width: '80%' }} />
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
                            <h3 className="text-3xl font-bold text-blue-900 tracking-tight">12</h3>
                            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Scholarships Saved</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                              <FileText className="h-7 w-7 text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-3xl font-bold text-green-900 tracking-tight">3</h3>
                            <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Applications in Progress</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
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
                            <h3 className="text-3xl font-bold text-purple-900 tracking-tight">5</h3>
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 whitespace-nowrap ${
                          achievement.unlocked
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-400"
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
                    <h2 className="flex items-center gap-2">
                      🎯 Recommended Scholarships for You
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
                  <ScrollArea className="w-full">
                    <div className="flex gap-5 pb-4">
                      {recommendedScholarships.map((scholarship, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03, y: -8 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="min-w-[320px]"
                        >
                          <Card className="hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-md hover:border-blue-300/50 overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 transition-all duration-300" />
                            <CardContent className="p-6 relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <span className="text-3xl">{scholarship.country}</span>
                                <Badge
                                  className={`${scholarship.statusColor} text-white font-semibold shadow-sm px-2.5 py-1`}
                                >
                                  {scholarship.status}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{scholarship.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
                                <Badge variant="outline" className="font-medium">{scholarship.degree}</Badge>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                                  <span className="font-medium">{scholarship.deadline}</span>
                                </div>
                              </div>
                              <Button
                                className="w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                style={{ backgroundColor: "#007BFF" }}
                              >
                                Apply Now
                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>

                {/* Document Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">📁 Document Verification</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden relative group cursor-pointer">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600" />
                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              </div>
                              <Badge className="bg-green-100 text-green-700 border border-green-200 font-semibold shadow-sm">
                                Verified
                              </Badge>
                            </div>
                            <ImageWithFallback
                              src="https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                              alt="Document"
                              className="w-14 h-14 rounded-lg object-cover border-2 border-green-200 shadow-sm"
                            />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900">+2 Transcript</h3>
                          <p className="text-sm text-gray-600 font-medium">
                            Uploaded on Nov 1, 2025
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 overflow-hidden relative group cursor-pointer">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Clock className="h-6 w-6 text-orange-600" />
                              </div>
                              <Badge className="bg-orange-100 text-orange-700 border border-orange-200 font-semibold shadow-sm">
                                Pending
                              </Badge>
                            </div>
                            <ImageWithFallback
                              src="https://images.unsplash.com/photo-1715173679369-18006e84d6a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMGRvY3VtZW50cyUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc2MjM2NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                              alt="Document"
                              className="w-14 h-14 rounded-lg object-cover border-2 border-orange-200 shadow-sm"
                            />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900">Bachelor Transcript</h3>
                          <p className="text-sm text-gray-600 font-medium">
                            Uploaded on Nov 3, 2025
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveSection("documents")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Document
                  </Button>
                </motion.div>

                {/* Guidance & Preparation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2>📚 Improve Your Application</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveSection("guidance")}
                    >
                      Explore All Guidance
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {guidanceResources.map((resource, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:border-blue-300"
                        onClick={() => handleSectionChange("guidance")}
                      >
                        <CardContent className="p-5">
                          <div
                            className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3"
                          >
                            <resource.icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="mb-2 bg-blue-100 text-blue-700"
                          >
                            {resource.type}
                          </Badge>
                          <h3 className="text-sm mb-3">{resource.title}</h3>
                          {resource.progress > 0 ? (
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-blue-600">
                                  {resource.progress}%
                                </span>
                              </div>
                              <Progress value={resource.progress} className="h-2" />
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" className="w-full mt-2">
                              <FileText className="mr-2 h-3 w-3" />
                              Start Learning
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>

                {/* Student Community - Share Your Journey */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2>💬 Student Community – Share Your Journey</h2>
                      <p className="text-sm text-gray-600">Connect with fellow students and share your experiences</p>
                    </div>
                  </div>

                  {/* Quick Post Creation Card */}
                  <Card className="mb-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} />
                          <AvatarFallback>{displayName[0]}</AvatarFallback>
                        </Avatar>
                        <button
                          onClick={() => handleSectionChange("community")}
                          className="flex-1 text-left px-4 py-3 bg-white rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all hover:shadow-md cursor-pointer"
                        >
                          <p className="text-gray-500">Share your experience, ask questions, or help others...</p>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3 ml-13 pl-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          onClick={() => handleSectionChange("community")}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Create Post
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-purple-600 border-purple-300 hover:bg-purple-50"
                          onClick={() => handleSectionChange("community")}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Share Success Story
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Community Posts */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {communityPosts.map((post, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-500"
                        onClick={() => handleSectionChange("community")}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback>{post.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{post.name}</div>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                          <h3 className="text-sm mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {post.preview}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>24</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>8</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => handleSectionChange("community")}
                  >
                    View All Posts
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                {/* Daily Quote */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
                    <CardContent className="p-5 text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm italic">
                        "Dream big. Study bigger."
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Insights */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm text-gray-600 mb-3">📊 Quick Insights</h3>
                  
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-100 mb-1">Total Scholarships</p>
                          <h3 className="text-white text-2xl">1,247</h3>
                          <p className="text-xs text-blue-100 mt-1">+24 this week</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-100 mb-1">New Articles</p>
                          <h3 className="text-white text-2xl">38</h3>
                          <p className="text-xs text-green-100 mt-1">Updated today</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-100 mb-1">Community Growth</p>
                          <h3 className="text-white text-2xl">2.4K</h3>
                          <p className="text-xs text-purple-100 mt-1">Active students</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Tip */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-2 border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        ⚡ AI Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        Based on your GPA, 3 new scholarships match your profile.
                        Check them out!
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        style={{ backgroundColor: "#007BFF" }}
                      >
                        View Matches
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Latest Updates */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-600" />
                        🔔 Latest Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">New scholarship added: MIT Fellowship</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">Your document was verified ✅</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">Deadline reminder: Fulbright</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mini Calendar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-orange-600" />
                        📅 Upcoming Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500 hover:shadow-md transition-all cursor-pointer">
                          <div>
                            <p className="text-sm">Fulbright Scholarship</p>
                            <p className="text-xs text-gray-500">7 days left</p>
                          </div>
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all cursor-pointer">
                          <div>
                            <p className="text-sm">DAAD Scholarship</p>
                            <p className="text-xs text-gray-500">22 days left</p>
                          </div>
                          <Badge className="text-xs bg-blue-500">Dec 30</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-all cursor-pointer">
                          <div>
                            <p className="text-sm">Chevening</p>
                            <p className="text-xs text-gray-500">45 days left</p>
                          </div>
                          <Badge className="text-xs bg-green-500">Jan 22</Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleSectionChange("calendar")}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        View Full Calendar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Need Help Widget */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                    <CardContent className="p-5 text-center">
                      <Bot className="h-10 w-10 mx-auto mb-3 text-white" />
                      <h3 className="text-white mb-2">Need Help?</h3>
                      <p className="text-sm text-white/90 mb-4">
                        Our AI assistant is here to guide you through your scholarship journey
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full bg-white text-indigo-600 hover:bg-gray-100"
                        onClick={() => setShowAssistant(true)}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ask ApplyBro AI
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-8 text-sm text-gray-600 mt-8 border-t border-gray-200">
              <p className="mb-1">© 2025 ApplyBro | Empowering Students in Nepal</p>
              <p className="text-xs italic text-gray-500">"Dream big. Study bigger."</p>
            </footer>
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Assistant */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 z-50"
          >
            <Card className="shadow-2xl border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Ask ApplyBro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  Hi {displayName}! How can I help you today?
                </p>
                <Input placeholder="Type your question..." className="mb-3" />
                <div className="space-y-2">
                  <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                    💡 Find scholarships for my profile
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                    📝 Help with motivation letter
                  </button>
                  <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                    🎓 Visa application tips
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-50"
        style={{
          background: "linear-gradient(135deg, #007BFF 0%, #9333ea 100%)",
        }}
      >
        {showAssistant ? (
          <ChevronRight className="h-6 w-6 rotate-90" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}
