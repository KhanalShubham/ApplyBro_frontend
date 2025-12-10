import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  User,
  Globe,
  Bell,
  Lock,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "language" | "notifications" | "security" | "account"
  >("profile");

  // Profile Settings
  const [fullName, setFullName] = useState("Pratik Shrestha");
  const [email, setEmail] = useState("pratik.shrestha@example.com");
  const [phone, setPhone] = useState("+977 9800000000");
  const [country, setCountry] = useState("Nepal");

  // Language Settings
  const [language, setLanguage] = useState("english");

  // Notification Settings
  const [scholarshipUpdates, setScholarshipUpdates] = useState(true);
  const [postStatus, setPostStatus] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion initiated. You will receive a confirmation email.");
  };

  const tabs = [
    { id: "profile", icon: User, label: "Profile Settings" },
    { id: "language", icon: Globe, label: "Language" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "security", icon: Lock, label: "Security" },
    { id: "account", icon: Trash2, label: "Delete Account" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">⚙️ Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Tabs */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Motivational Quote */}
          <Card className="mt-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm italic">
                "Secure your data. Secure your dreams."
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-xs text-gray-600 mt-2">
                        JPG, PNG or GIF. Max 2MB
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nepal">Nepal</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                          <SelectItem value="Pakistan">Pakistan</SelectItem>
                          <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      style={{ backgroundColor: "#007BFF" }}
                      onClick={handleSaveProfile}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language Settings */}
            {activeTab === "language" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Language Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          🇬🇧
                        </div>
                        <div>
                          <div>English</div>
                          <div className="text-sm text-gray-600">Default language</div>
                        </div>
                      </div>
                      {language === "english" && (
                        <Badge style={{ backgroundColor: "#007BFF" }} className="text-white">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer opacity-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          🇳🇵
                        </div>
                        <div>
                          <div>नेपाली (Nepali)</div>
                          <div className="text-sm text-gray-600">Coming soon</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      More languages will be available soon. We're working on adding
                      support for Nepali and other regional languages.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm">Scholarship Updates</div>
                          <div className="text-xs text-gray-600">
                            Get notified about new scholarships matching your profile
                          </div>
                        </div>
                        <Switch
                          checked={scholarshipUpdates}
                          onCheckedChange={setScholarshipUpdates}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm">Post Status Updates</div>
                          <div className="text-xs text-gray-600">
                            Notifications when your posts are approved or declined
                          </div>
                        </div>
                        <Switch
                          checked={postStatus}
                          onCheckedChange={setPostStatus}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm">Deadline Reminders</div>
                          <div className="text-xs text-gray-600">
                            Reminders for upcoming scholarship deadlines
                          </div>
                        </div>
                        <Switch
                          checked={reminders}
                          onCheckedChange={setReminders}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4">Notification Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm">Email Notifications</div>
                          <div className="text-xs text-gray-600">
                            Receive notifications via email
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm">Push Notifications</div>
                          <div className="text-xs text-gray-600">
                            Receive push notifications in browser
                          </div>
                        </div>
                        <Switch
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      style={{ backgroundColor: "#007BFF" }}
                      onClick={handleSaveNotifications}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-600">
                          Must be at least 8 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      style={{ backgroundColor: "#007BFF" }}
                      onClick={handleChangePassword}
                      disabled={
                        !currentPassword || !newPassword || !confirmPassword
                      }
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                      <li>At least 8 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delete Account */}
            {activeTab === "account" && (
              <Card className="border-2 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Delete Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm mb-2 text-red-900">
                      Warning: This action cannot be undone
                    </h4>
                    <p className="text-sm text-red-700">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Your profile and personal information</li>
                      <li>All your saved scholarships and bookmarks</li>
                      <li>Your application history and documents</li>
                      <li>Community posts and comments</li>
                      <li>All calendar events and reminders</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirm">
                        Type "DELETE" to confirm
                      </Label>
                      <Input
                        id="deleteConfirm"
                        placeholder="Type DELETE to confirm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deleteReason">
                        Reason for leaving (optional)
                      </Label>
                      <Select>
                        <SelectTrigger id="deleteReason">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="found-scholarship">
                            Found a scholarship
                          </SelectItem>
                          <SelectItem value="no-longer-needed">
                            No longer needed
                          </SelectItem>
                          <SelectItem value="privacy-concerns">
                            Privacy concerns
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
