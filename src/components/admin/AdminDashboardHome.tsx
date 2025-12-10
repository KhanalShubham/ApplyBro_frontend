import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Users,
  FileCheck,
  MessageSquare,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  X,
} from "lucide-react";
import { motion } from "motion/react";

interface AdminDashboardHomeProps {
  onSectionChange: (section: string) => void;
}

export function AdminDashboardHome({ onSectionChange }: AdminDashboardHomeProps) {
  const stats = [
    {
      label: "Total Users",
      value: "12,458",
      change: "+234",
      icon: Users,
      color: "blue",
      onClick: () => onSectionChange("users"),
    },
    {
      label: "Pending Documents",
      value: "342",
      change: "+12",
      icon: FileCheck,
      color: "orange",
      onClick: () => onSectionChange("documents"),
    },
    {
      label: "Posts Pending Review",
      value: "89",
      change: "+5",
      icon: MessageSquare,
      color: "purple",
      onClick: () => onSectionChange("posts"),
    },
    {
      label: "Active Scholarships",
      value: "1,247",
      change: "+24",
      icon: GraduationCap,
      color: "green",
      onClick: () => onSectionChange("scholarships"),
    },
  ];

  const recentActivities = [
    {
      type: "user",
      title: "New user registered: Sarah Khadka",
      time: "2 minutes ago",
      status: "new",
    },
    {
      type: "document",
      title: "Document verified: Bachelor Transcript",
      time: "15 minutes ago",
      status: "verified",
    },
    {
      type: "post",
      title: "Post approved: My Germany Visa Journey",
      time: "1 hour ago",
      status: "approved",
    },
    {
      type: "document",
      title: "Document rejected: IELTS Certificate",
      time: "2 hours ago",
      status: "rejected",
    },
    {
      type: "scholarship",
      title: "New scholarship added: MIT Fellowship",
      time: "3 hours ago",
      status: "new",
    },
  ];

  const urgentTasks = [
    {
      title: "Review 5 pending posts",
      priority: "high",
      count: 5,
      section: "posts",
    },
    {
      title: "Verify 12 documents",
      priority: "medium",
      count: 12,
      section: "documents",
    },
    {
      title: "Update scholarship deadlines",
      priority: "medium",
      count: 8,
      section: "scholarships",
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1800px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium">Monitor and manage the ApplyBro platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="cursor-pointer"
            onClick={stat.onClick}
          >
            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center shadow-lg shadow-${stat.color}-500/30 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-7 w-7 text-white`} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`bg-${stat.color}-50 text-${stat.color}-700 border border-${stat.color}-200/50 px-2.5 py-0.5 text-xs font-semibold shadow-sm`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Urgent Tasks */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <span>Urgent Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {urgentTasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-gray-100 hover:to-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 group cursor-pointer"
                    onClick={() => onSectionChange(task.section)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${
                        task.priority === "high" ? "bg-red-500 animate-pulse" : "bg-orange-500"
                      }`} />
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.title}</p>
                        <p className="text-sm text-gray-500 font-medium">{task.count} items pending</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSectionChange(task.section);
                      }}
                    >
                      Review
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
              <Button
                className="w-full justify-start group hover:shadow-md transition-all duration-200 bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 hover:text-blue-700"
                variant="outline"
                onClick={() => onSectionChange("users")}
              >
                <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Manage Users
              </Button>
              <Button
                className="w-full justify-start group hover:shadow-md transition-all duration-200 bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-300 hover:text-orange-700"
                variant="outline"
                onClick={() => onSectionChange("documents")}
              >
                <FileCheck className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Verify Documents
              </Button>
              <Button
                className="w-full justify-start group hover:shadow-md transition-all duration-200 bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300 hover:text-purple-700"
                variant="outline"
                onClick={() => onSectionChange("posts")}
              >
                <MessageSquare className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Moderate Posts
              </Button>
              <Button
                className="w-full justify-start group hover:shadow-md transition-all duration-200 bg-white hover:bg-green-50 border-gray-200 hover:border-green-300 hover:text-green-700"
                variant="outline"
                onClick={() => onSectionChange("scholarships")}
              >
                <GraduationCap className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Manage Scholarships
              </Button>
              <Button
                className="w-full justify-start group hover:shadow-md transition-all duration-200 bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
                variant="outline"
                onClick={() => onSectionChange("analytics")}
              >
                <TrendingUp className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card className="mt-8 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring" }}
                whileHover={{ x: 4, backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all duration-200 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.status === "verified" || activity.status === "approved"
                    ? "bg-green-100 group-hover:bg-green-200"
                    : activity.status === "rejected"
                    ? "bg-red-100 group-hover:bg-red-200"
                    : "bg-blue-100 group-hover:bg-blue-200"
                } transition-colors duration-200`}>
                  {activity.status === "verified" || activity.status === "approved" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : activity.status === "rejected" ? (
                    <X className="h-5 w-5 text-red-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{activity.time}</p>
                </div>
                <Badge
                  variant={
                    activity.status === "verified" || activity.status === "approved"
                      ? "default"
                      : activity.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className="font-semibold shadow-sm"
                >
                  {activity.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

