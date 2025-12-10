import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import { axiosClient } from "@/shared/lib/axiosClient";
import { User, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getRandomMessage } from "@/shared/lib/funkyMessages";

interface SignupPageProps {
  onSignupSuccess?: (data: any) => void;
  onLoginClick?: () => void;
}

export function SignupPage({ onSignupSuccess, onLoginClick }: SignupPageProps) {
  const navigate = useNavigate();
  // Access enviroment variable directly.
  const ENABLE_BACKEND_AUTH = import.meta.env.VITE_ENABLE_BACKEND !== "false";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = [
    "Nepal", "India", "United States", "United Kingdom", "Canada", "Australia",
    "Germany", "France", "Japan", "South Korea", "China", "Singapore",
    "Malaysia", "Thailand", "Bangladesh", "Pakistan", "Sri Lanka", "Other"
  ];

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

    let label = "";
    let color = "";
    if (strength < 25) {
      label = "Weak";
      color = "#ef4444";
    } else if (strength < 50) {
      label = "Fair";
      color = "#f97316";
    } else if (strength < 75) {
      label = "Good";
      color = "#eab308";
    } else {
      label = "Strong";
      color = "#22c55e";
    }

    return { strength, label, color };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.country) {
      newErrors.country = "Please select your country";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of use and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      if (ENABLE_BACKEND_AUTH) {
        // Real API Call
        const payload = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.confirmPassword,
          role: "student",
          profile: {
            country: formData.country,
          }
        };

        const response = await axiosClient.post("/auth/signup", payload);

        // Success - navigate to login with message
        // We assume 2xx response means success if axios doesn't throw.
        // If the backend returns specific status fields check them:
        if (response.data.status === "success" || response.data.token || response.data.data?.accessToken) {
          navigate("/login", { state: { message: "Account created successfully! Please log in." } });
          return;
        }
      } else {
        // Simulation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/signup/success");
      }
    } catch (err: any) {
      console.error("Signup failed", err);
      const msg = err.response?.data?.message || getRandomMessage("signupFailure");
      setErrors((prev) => ({ ...prev, apiError: msg }));
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#E9F2FF" }}>
      <div className="w-full max-w-6xl grid gap-8 items-center lg:grid-cols-2">
        {/* Left Section - Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 w-full max-w-md mx-auto lg:mx-0">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#007BFF" }}
              >
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold block" style={{ color: "#007BFF" }}>
                  ApplyBro
                </span>
                <span className="text-xs text-gray-500 -mt-1 block">Empowering Students</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Register</h1>
            <p className="text-gray-600 text-sm">
              Sign in here and log in to access feature of ApplyBro.
            </p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 mb-1">Please fix the following errors:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 mb-2 block">
                Full name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) {
                    setErrors({ ...errors, fullName: "" });
                  }
                }}
                className={`h-12 ${errors.fullName ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  className={`h-12 pl-10 ${errors.email ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country" className="text-sm font-semibold text-gray-700 mb-2 block">
                Select your country
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value: string) => {
                  setFormData({ ...formData, country: value });
                  if (errors.country) {
                    setErrors({ ...errors, country: "" });
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="country"
                  className={`h-12 ${errors.country ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                >
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-red-600 mt-1">{errors.country}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  className={`h-12 pl-10 pr-24 ${errors.password ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className="font-semibold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Use 8 or more characters with a mix of letters, numbers & symbols.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: "" });
                    }
                  }}
                  className={`h-12 pl-10 pr-24 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
                >
                  {showConfirmPassword ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked: boolean) => {
                  setFormData({ ...formData, agreeToTerms: checked });
                  if (errors.agreeToTerms) {
                    setErrors({ ...errors, agreeToTerms: "" });
                  }
                }}
                disabled={isLoading}
                className={`mt-1 ${errors.agreeToTerms ? "border-red-500" : ""}`}
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                Agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline font-semibold">
                  Terms of use
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline font-semibold">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 -mt-3 ml-7">{errors.agreeToTerms}</p>
            )}

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: "#007BFF" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline font-semibold"
              onClick={(e) => {
                e.preventDefault();
                handleLoginNavigation();
              }}
            >
              Login
            </a>
          </p>
        </div>

        {/* Right Section - Illustration */}
        <div className="flex flex-col justify-center items-center order-first lg:order-last">
          <div className="relative w-full flex justify-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1080&auto=format&fit=crop"
              alt="Students celebrating"
              className="rounded-2xl shadow-2xl w-full max-w-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border-2 border-blue-100">
              <p className="text-sm">
                <span className="text-blue-600">🚀 5,000+</span> new students joined this year
              </p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-700 max-w-md">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "#007BFF" }}>
              Start your scholarship journey today
            </h2>
            <p>
              Discover programs worldwide, upload documents once, and manage every requirement from one calm place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}







