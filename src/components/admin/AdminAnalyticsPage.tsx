import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { adminService } from "@/services/adminService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  GraduationCap,
  FileCheck,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { Badge } from "../ui/badge";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminService.getAnalytics();
        if (response.data && response.data.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
        // toast.error("Failed to fetch analytics"); // Optional: don't spam if metrics fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center">Loading analytics...</div>;
  }

  // Fallback/Default data if backend response is missing sections
  const safeData = {
    userGrowth: data?.userGrowth || [],
    documentStatus: data?.documentStatus?.map((d: any) => ({
      name: d.status || d.name,
      value: d.count || d.value,
      color: d.status === 'Verified' ? '#00C49F' : d.status === 'Pending' ? '#FFBB28' : '#FF8042'
    })) || [],
    scholarshipApplications: data?.scholarshipApplications || [],
    engagement: data?.engagement || [],
    usersByCountry: data?.usersByCountry || []
  };

  const stats = [
    {
      label: "Total Users",
      value: data?.totalUsers?.toLocaleString() || "0",
      change: "+0%", // Backend might not provide this
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Scholarships",
      value: data?.activeScholarships?.toLocaleString() || "0",
      change: "+0%",
      trend: "up",
      icon: GraduationCap,
      color: "green",
    },
    {
      label: "Documents Verified",
      value: data?.documentsVerified?.toLocaleString() || "0",
      change: "+0%",
      trend: "up",
      icon: FileCheck,
      color: "purple",
    },
    {
      label: "Community Posts",
      value: data?.communityPosts?.toLocaleString() || "0",
      change: "+0%",
      trend: "up",
      icon: MessageSquare,
      color: "orange",
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Platform insights and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                {/* 
                <Badge
                  variant={stat.trend === "up" ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
                */}
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={safeData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#007BFF"
                  strokeWidth={2}
                  name="Total Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Document Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={safeData.documentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {safeData.documentStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scholarship Applications Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Scholarships by Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safeData.scholarshipApplications}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scholarship" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#007BFF" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safeData.engagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#0088FE" name="Posts" />
                <Bar dataKey="likes" fill="#00C49F" name="Likes" />
                <Bar dataKey="comments" fill="#FFBB28" name="Comments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries */}
      <Card>
        <CardHeader>
          <CardTitle>Users by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeData.usersByCountry.map((item: any) => (
              <div key={item.country}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.country}</span>
                  <span className="text-sm text-gray-600">
                    {item.users.toLocaleString()} users ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}







