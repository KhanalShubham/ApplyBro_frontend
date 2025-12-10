import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info, GraduationCap, BookOpen, Building2, Award, Globe } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StepThreeProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

export function StepThree({ onNext, onBack, initialData }: StepThreeProps) {
  const [formData, setFormData] = useState({
    qualification: initialData.qualification || "",
    fieldOfStudy: initialData.fieldOfStudy || "",
    institution: initialData.institution || "",
    gpa: initialData.gpa || "",
    studyDestination: initialData.studyDestination || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.qualification) {
      newErrors.qualification = "Please select your highest qualification";
    }
    if (!formData.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = "Field of study is required";
    }
    if (!formData.institution.trim()) {
      newErrors.institution = "Institution name is required";
    }
    if (!formData.studyDestination) {
      newErrors.studyDestination = "Please select a study destination";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto lg:mx-0">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step 3 of 4</span>
              <span className="text-sm text-gray-600">Academic Details</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <h1 className="text-center mb-2">Your Academic Background</h1>
          <p className="text-center text-gray-600 mb-6">
            Help us find the perfect scholarships for you
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <Label htmlFor="qualification">Highest Qualification</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your latest qualification</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={formData.qualification} onValueChange={(value) => setFormData({ ...formData, qualification: value })}>
                <SelectTrigger className={errors.qualification ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+2">+2 / High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
              {errors.qualification && (
                <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
              </div>
              <Input
                id="fieldOfStudy"
                type="text"
                placeholder="e.g., Computer Science, Engineering"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                className={errors.fieldOfStudy ? "border-red-500" : ""}
              />
              {errors.fieldOfStudy && (
                <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <Label htmlFor="institution">Current Institution</Label>
              </div>
              <Input
                id="institution"
                type="text"
                placeholder="e.g., Tribhuvan University"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className={errors.institution ? "border-red-500" : ""}
              />
              {errors.institution && (
                <p className="text-red-500 text-xs mt-1">{errors.institution}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-blue-600" />
                <Label htmlFor="gpa">GPA or Percentage (Optional)</Label>
              </div>
              <Input
                id="gpa"
                type="text"
                placeholder="e.g., 3.8 or 85%"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <Label htmlFor="studyDestination">Preferred Study Destination</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Where do you want to study abroad?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={formData.studyDestination} onValueChange={(value) => setFormData({ ...formData, studyDestination: value })}>
                <SelectTrigger className={errors.studyDestination ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="korea">South Korea</SelectItem>
                </SelectContent>
              </Select>
              {errors.studyDestination && (
                <p className="text-red-500 text-xs mt-1">{errors.studyDestination}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              ← Back
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1"
              style={{ backgroundColor: '#007BFF' }}
            >
              Next →
            </Button>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1761469354504-8d14b3a33757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwYWNhZGVtaWMlMjBzdWNjZXNzfGVufDF8fHx8MTc2MjMyNDExOHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Academic success"
              className="rounded-2xl shadow-2xl w-full max-w-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
              <p className="text-sm">🌍 Study in 50+ countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
