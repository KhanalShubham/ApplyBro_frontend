import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Upload, User, Mail, GraduationCap, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StepFourProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
  allData: any;
}

export function StepFour({ onBack, onSubmit, initialData, allData }: StepFourProps) {
  const [formData, setFormData] = useState({
    language: initialData.language || "english",
    agreeToTerms: initialData.agreeToTerms || false,
    scholarshipUpdates: initialData.scholarshipUpdates !== undefined ? initialData.scholarshipUpdates : true,
    deadlineReminders: initialData.deadlineReminders !== undefined ? initialData.deadlineReminders : true,
    profilePicture: initialData.profilePicture || null,
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2 MB limit");
        return;
      }
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms & Privacy Policy");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onSubmit(formData);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const qualificationMap: Record<string, string> = {
    "+2": "+2 / High School",
    "bachelor": "Bachelor's Degree",
    "master": "Master's Degree",
    "phd": "PhD",
  };

  const destinationMap: Record<string, string> = {
    "nepal": "Nepal",
    "usa": "United States",
    "uk": "United Kingdom",
    "germany": "Germany",
    "japan": "Japan",
    "australia": "Australia",
    "canada": "Canada",
    "korea": "South Korea",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto lg:mx-0">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step 4 of 4</span>
              <span className="text-sm text-gray-600">Preferences & Confirmation</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <h1 className="text-center mb-2">Finish Setting Up Your Account</h1>
          <p className="text-center text-gray-600 mb-6">
            Just a few more details to personalize your experience
          </p>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <Label className="block mb-3">Profile Picture (Optional)</Label>
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24">
                  {profilePreview ? (
                    <AvatarImage src={profilePreview} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {allData.step1?.fullName ? getInitials(allData.step1.fullName) : <User className="h-10 w-10" />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label htmlFor="profilePicture">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                </label>
                <input
                  id="profilePicture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                <p className="text-xs text-gray-500">Max 2 MB</p>
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <Label className="mb-3 block">Language Preference</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.language === "english" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, language: "english" })}
                  className="flex-1"
                  style={formData.language === "english" ? { backgroundColor: '#007BFF' } : {}}
                >
                  English
                </Button>
                <Button
                  type="button"
                  variant={formData.language === "nepali" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, language: "nepali" })}
                  className="flex-1"
                  style={formData.language === "nepali" ? { backgroundColor: '#007BFF' } : {}}
                >
                  नेपाली
                </Button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <Label className="mb-3 block">Notification Preferences</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p>Scholarship Updates</p>
                    <p className="text-xs text-gray-500">Get notified about new scholarships</p>
                  </div>
                  <Switch
                    checked={formData.scholarshipUpdates}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, scholarshipUpdates: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p>Deadline Reminders</p>
                    <p className="text-xs text-gray-500">Never miss an application deadline</p>
                  </div>
                  <Switch
                    checked={formData.deadlineReminders}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, deadlineReminders: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
              />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to ApplyBro's{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting}>
              ← Back
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1"
              style={{ backgroundColor: '#007BFF' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create My Account"
              )}
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="hidden lg:block">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <h2 className="mb-4">Account Summary</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p>{allData.step1?.fullName || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{allData.step1?.email || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p>{allData.step3?.qualification ? qualificationMap[allData.step3.qualification] : "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Study Destination</p>
                    <p>{allData.step3?.studyDestination ? destinationMap[allData.step3.studyDestination] : "—"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  🎉 You're one step away from discovering thousands of scholarship opportunities!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
