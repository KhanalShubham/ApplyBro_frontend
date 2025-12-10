import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
  // Mock data for charts
  const userGrowthData = [
    { month: "Jan", users: 2000 },
    { month: "Feb", users: 3200 },
    { month: "Mar", users: 4500 },
    { month: "Apr", users: 5800 },
    { month: "May", users: 7200 },
    { month: "Jun", users: 8900 },
    { month: "Jul", users: 10500 },
    { month: "Aug", users: 12458 },
  ];

  const documentStatusData = [
    { name: "Verified", value: 8456, color: "#00C49F" },
    { name: "Pending", value: 342, color: "#FFBB28" },
    { name: "Rejected", value: 189, color: "#FF8042" },
  ];

  const scholarshipApplicationsData = [
    { scholarship: "Fulbright", applications: 234 },
    { scholarship: "DAAD", applications: 189 },
    { scholarship: "Chevening", applications: 156 },
    { scholarship: "Australia Awards", applications: 98 },
    { scholarship: "Others", applications: 234 },
  ];

  const engagementData = [
    { day: "Mon", posts: 45, likes: 234, comments: 123 },
    { day: "Tue", posts: 52, likes: 289, comments: 145 },
    { day: "Wed", posts: 38, likes: 198, comments: 98 },
    { day: "Thu", posts: 61, likes: 312, comments: 167 },
    { day: "Fri", posts: 49, likes: 278, comments: 134 },
    { day: "Sat", posts: 35, likes: 156, comments: 87 },
    { day: "Sun", posts: 42, likes: 201, comments: 112 },
  ];

  const topCountries = [
    { country: "Nepal", users: 8456, percentage: 68 },
    { country: "India", users: 2341, percentage: 19 },
    { country: "Bangladesh", users: 987, percentage: 8 },
    { country: "Others", users: 674, percentage: 5 },
  ];

  const stats = [
    {
      label: "Total Users",
      value: "12,458",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Scholarships",
      value: "1,247",
      change: "+5.2%",
      trend: "up",
      icon: GraduationCap,
      color: "green",
    },
    {
      label: "Documents Verified",
      value: "8,456",
      change: "+8.1%",
      trend: "up",
      icon: FileCheck,
      color: "purple",
    },
    {
      label: "Community Posts",
      value: "3,421",
      change: "+15.3%",
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
              <LineChart data={userGrowthData}>
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
                  data={documentStatusData}
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
                  {documentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
              <BarChart data={scholarshipApplicationsData}>
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
              <BarChart data={engagementData}>
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
            {topCountries.map((item) => (
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







