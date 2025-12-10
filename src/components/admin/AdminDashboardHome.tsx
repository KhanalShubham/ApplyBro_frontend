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
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { AdminAction } from "@/types/admin";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface AdminDashboardHomeProps {
  onSectionChange: (section: string) => void;
}

export function AdminDashboardHome({ onSectionChange }: AdminDashboardHomeProps) {
  const [activities, setActivities] = useState<AdminAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminService.getActions(1, 10);
        if (response.data.status === "success") {
          setActivities(response.data.data.actions);
        }
      } catch (error) {
        console.error("Failed to fetch admin activities", error);
        toast.error("Failed to load recent activities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const stats = [
    {
      label: "User Management",
      value: "Manage",
      change: "Users",
      icon: Users,
      color: "blue",
      onClick: () => onSectionChange("users"),
    },
    {
      label: "Pending Verifications",
      value: "Verify",
      change: "Docs",
      icon: FileCheck,
      color: "orange",
      onClick: () => onSectionChange("documents"),
    },
    {
      label: "Pending Posts",
      value: "Moderate",
      change: "Posts",
      icon: MessageSquare,
      color: "purple",
      onClick: () => onSectionChange("posts"),
    },
    {
      label: "Scholarships",
      value: "Manage",
      change: "Items",
      icon: GraduationCap,
      color: "green",
      onClick: () => onSectionChange("scholarships"),
    },
  ];

  const urgentTasks = [
    {
      title: "Review pending posts",
      priority: "high",
      count: "Check",
      section: "posts",
    },
    {
      title: "Verify documents",
      priority: "medium",
      count: "Check",
      section: "documents",
    },
    {
      title: "Scholarship deadlines",
      priority: "medium",
      count: "Check",
      section: "scholarships",
    },
  ];

  const getActionIcon = (actionType: string) => {
    if (actionType.includes("create")) return Plus;
    if (actionType.includes("update") || actionType.includes("edit")) return Edit;
    if (actionType.includes("delete")) return Trash2;
    if (actionType.includes("verify") || actionType.includes("approve")) return CheckCircle;
    if (actionType.includes("reject") || actionType.includes("decline")) return X;
    return Clock;
  };

  const getActionColor = (actionType: string) => {
    if (actionType.includes("verify") || actionType.includes("approve")) return "green";
    if (actionType.includes("reject") || actionType.includes("decline") || actionType.includes("delete")) return "red";
    return "blue";
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1800px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium">Monitor and manage the ApplyBro platform</p>
      </div>

      {/* Stats Cards Navigation */}
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
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
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
                <span>Quick Navigation</span>
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
                      <div className={`w-3 h-3 rounded-full shadow-sm ${task.priority === "high" ? "bg-red-500 animate-pulse" : "bg-orange-500"
                        }`} />
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.title}</p>
                        <p className="text-sm text-gray-500 font-medium">Go to section</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onSectionChange(task.section);
                      }}
                    >
                      Go
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
        <CardHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading activities...</div>
            ) : activities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No recent activities found</div>
            ) : (
              activities.map((activity, index) => {
                const Icon = getActionIcon(activity.actionType);
                const color = getActionColor(activity.actionType);

                return (
                  <motion.div
                    key={activity._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: "spring" }}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${color}-100 group-hover:bg-${color}-200 transition-colors duration-200`}>
                      <Icon className={`h-5 w-5 text-${color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <span className="font-bold">{activity.admin.name}</span> {activity.actionType.replace('-', ' ')} <span className="font-bold">{activity.targetLabel}</span>
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.targetType}
                    </Badge>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

