import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
  LayoutDashboard,
  Users,
  FileCheck,
  MessageSquare,
  GraduationCap,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronRight,
  LogOut,
  User,
  ChevronLeft,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserManagementPage } from "./admin/UserManagementPage";
import { DocumentVerificationPage } from "./admin/DocumentVerificationPage";
import { PostModerationPage } from "./admin/PostModerationPage";
import { ReportsManagementPage } from "./admin/ReportsManagementPage";
import { ScholarshipManagementPage } from "./admin/ScholarshipManagementPage";
import { AdminAnalyticsPage } from "./admin/AdminAnalyticsPage";
import { AdminDashboardHome } from "./admin/AdminDashboardHome";
import { GuidanceManagementPage } from "./admin/GuidanceManagementPage";
import { AdminCalendarManagementPage } from "./admin/AdminCalendarManagementPage";
import { ConfirmDialog } from "./ConfirmDialog";

interface AdminDashboardProps {
  onLogout?: () => void;
  userName?: string;
}

export function AdminDashboard({ onLogout, userName = "Admin" }: AdminDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notificationCount, setNotificationCount] = useState(5);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "User Management" },
    { id: "documents", icon: FileCheck, label: "Document Verification" },
    { id: "posts", icon: MessageSquare, label: "Post Moderation" },
    { id: "reports", icon: AlertCircle, label: "Reports Management" },
    { id: "scholarships", icon: GraduationCap, label: "Scholarship Management" },
    { id: "guidance", icon: GraduationCap, label: "Guidance" },
    { id: "calendar", icon: Clock, label: "Calendar Events" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
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
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl block" style={{ color: "#007BFF" }}>
                ApplyBro Admin
              </span>
              <span className="text-xs text-gray-500 -mt-1 block">Admin Panel</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, posts, scholarships..."
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
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                    <AvatarFallback>{userName[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
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
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeSection === item.id
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
          className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"
            } ml-0`}
        >
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AdminDashboardHome onSectionChange={handleSectionChange} />
              </motion.div>
            )}
            {activeSection === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <UserManagementPage />
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
                <DocumentVerificationPage />
              </motion.div>
            )}
            {activeSection === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PostModerationPage />
              </motion.div>
            )}
            {activeSection === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ReportsManagementPage />
              </motion.div>
            )}
            {activeSection === "scholarships" && (
              <motion.div
                key="scholarships"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ScholarshipManagementPage />
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
                <GuidanceManagementPage />
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
                <AdminCalendarManagementPage />
              </motion.div>
            )}
            {activeSection === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AdminAnalyticsPage />
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
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Admin settings page coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={() => onLogout?.()}
        title="Logout Confirmation"
        description="Are you sure you want to logout from the admin panel?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="default"
      />
    </div>
  );
}
