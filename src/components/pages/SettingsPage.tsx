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
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { userService } from "../../services/userService";
import { getImageUrl } from "../../shared/lib/imageUtils";
import { useEffect, useRef } from "react";

const translations = {
  english: {
    title: "⚙️ Settings",
    subtitle: "Manage your account settings and preferences",
    quote: "\"Secure your data. Secure your dreams.\"",
    tabs: {
      profile: "Profile Settings",
      language: "Language",
      notifications: "Notifications",
      security: "Security",
      account: "Delete Account",
    },
    profile: {
      title: "Profile Settings",
      changePhoto: "Change Photo",
      photoHint: "JPG, PNG or GIF. Max 2MB",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      country: "Country",
      save: "Save Changes",
    },
    language: {
      title: "Language Preferences",
      english: "English",
      englishSub: "Default language",
      nepali: "नेपाली (Nepali)",
      nepaliSub: "Nepali language",
      active: "Active",
      comingSoon: "Coming Soon",
      note: "More languages will be available soon.",
    },
    // Add other sections as needed
  },
  nepali: {
    title: "⚙️ सेटिङहरू",
    subtitle: "आफ्नो खाता सेटिङहरू र प्राथमिकताहरू व्यवस्थापन गर्नुहोस्",
    quote: "\"तपाईंको डाटा सुरक्षित गर्नुहोस्। तपाईंको सपना सुरक्षित गर्नुहोस्।\"",
    tabs: {
      profile: "प्रोफाइल सेटिङहरू",
      language: "भाषा",
      notifications: "सूचनाहरू",
      security: "सुरक्षा",
      account: "खाता हटाउनुहोस्",
    },
    profile: {
      title: "प्रोफाइल सेटिङहरू",
      changePhoto: "फोटो परिवर्तन गर्नुहोस्",
      photoHint: "JPG, PNG वा GIF। अधिकतम 2MB",
      fullName: "पूरा नाम",
      email: "इमेल ठेगाना",
      phone: "फोन नम्बर",
      country: "देश",
      save: "परिवर्तनहरू बचत गर्नुहोस्",
    },
    language: {
      title: "भाषा प्राथमिकताहरू",
      english: "अंग्रेजी",
      englishSub: "पूर्वनिर्धारित भाषा",
      nepali: "नेपाली",
      nepaliSub: "नेपाली भाषा",
      active: "सक्रिय",
      comingSoon: "चाँडै आउँदैछ",
      note: "थप भाषाहरू चाँडै उपलब्ध हुनेछन्।",
    },
  },
};

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<
    "profile" | "language" | "notifications" | "security" | "account"
  >("profile");

  // Profile Settings
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Language Settings
  const [language, setLanguage] = useState("english");

  // Notification Settings
  const [scholarshipUpdates, setScholarshipUpdates] = useState(true);
  const [postStatus, setPostStatus] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const user = await userService.getProfile();
      setFullName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setCountry(user.profile?.country || "");
      setAvatarUrl(user.profile?.avatar || "");

      if (user.preferences) {
        setLanguage(user.preferences.language || "english");
        if (user.preferences.notifications) {
          setScholarshipUpdates(user.preferences.notifications.scholarshipUpdates ?? true);
          setPostStatus(user.preferences.notifications.postStatus ?? true);
          setReminders(user.preferences.notifications.reminders ?? true);
          setEmailNotifications(user.preferences.notifications.emailNotifications ?? true);
          setPushNotifications(user.preferences.notifications.pushNotifications ?? false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveProfile = async () => {
    try {
      await userService.updateProfile({
        name: fullName,
        phone,
        profile: { country, avatar: avatarUrl },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size too large. Max 2MB.");
      return;
    }

    try {
      const { data } = await userService.uploadAvatar(file);
      setAvatarUrl(data.url);
      await userService.updateProfile({ profile: { avatar: data.url } });
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    try {
      await userService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await userService.updateProfile({
        preferences: {
          language,
          notifications: {
            scholarshipUpdates,
            postStatus,
            reminders,
            emailNotifications,
            pushNotifications
          }
        }
      });
      toast.success("Notification preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      toast.success("Account deleted successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const t = translations[language === "nepali" ? "nepali" : "english"];

  const tabs = [
    { id: "profile", icon: User, label: t.tabs.profile },
    { id: "language", icon: Globe, label: t.tabs.language },
    { id: "notifications", icon: Bell, label: t.tabs.notifications },
    { id: "security", icon: Lock, label: t.tabs.security },
    { id: "account", icon: Trash2, label: t.tabs.account },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.subtitle}
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "text-muted-foreground hover:bg-gray-100"
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
                    {t.profile.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">


                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={getImageUrl(avatarUrl) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Pratik"} />
                      <AvatarFallback>{fullName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {t.profile.changePhoto}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t.profile.photoHint}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t.profile.fullName}</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.profile.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.profile.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t.profile.country}</Label>
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
                      {t.profile.save}
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
                    {t.language.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          🇬🇧
                        </div>
                        <div>
                          <div>English</div>
                          <div className="text-sm text-muted-foreground">Default language</div>
                        </div>
                      </div>
                      {language === "english" && (
                        <Badge style={{ backgroundColor: "#007BFF" }} className="text-white">
                          Active
                        </Badge>
                      )}
                    </div>



                    <div
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => setLanguage("nepali")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          🇳🇵
                        </div>
                        <div>
                          <div>{t.language.nepali}</div>
                          <div className="text-sm text-muted-foreground">{t.language.nepaliSub}</div>
                        </div>
                      </div>
                      {language === "nepali" && (
                        <Badge style={{ backgroundColor: "#007BFF" }} className="text-white">
                          {t.language.active}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
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
                          <div className="text-xs text-muted-foreground">
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
                          <div className="text-xs text-muted-foreground">
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
                          <div className="text-xs text-muted-foreground">
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
                          <div className="text-xs text-muted-foreground">
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
                          <div className="text-xs text-muted-foreground">
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-sm mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
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
              <Card className="border-2 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Delete Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
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
      </div >
    </div >
  );
}
