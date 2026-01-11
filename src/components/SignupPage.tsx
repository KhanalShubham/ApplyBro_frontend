import BearInput from "./bear/BearInput";
import BearAvatar from "./bear/BearAvatar";
import { useBearImages } from "../hooks/useBearImages";
import { useBearAnimation } from "../hooks/useBearAnimation";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { PremiumBackground } from "./PremiumBackground";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, Globe } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "@/shared/lib/axiosClient";
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Bear Animation Logic
  const { watchBearImages, hideBearImages, peakBearImages } = useBearImages();

  // Determine which password show state to track based on focus
  const activeShowPassword = focusedField === 'confirmPassword' ? showConfirmPassword : showPassword;

  const {
    currentBearImage,
    setCurrentFocus,
    currentFocus,
    isAnimating,
  } = useBearAnimation({
    watchBearImages,
    hideBearImages,
    peakBearImages,
    emailLength: formData.email.length,
    showPassword: activeShowPassword,
  });

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
    if (field === 'password' || field === 'confirmPassword') {
      setCurrentFocus('PASSWORD');
    } else {
      setCurrentFocus('EMAIL');
    }
  };

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

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

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
    navigate("/login");
  };

  return (
    <PremiumBackground>
      <div
        className="mx-auto p-8 relative"
        style={{
          width: '100%',
          maxWidth: '700px',
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.65)', // Semi-opaque milk glass
          backdropFilter: 'blur(20px) saturate(180%)', // Strong blur
          border: '1px solid rgba(255, 255, 255, 0.4)', // Subtle border
          boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.15), 
              0 10px 20px rgba(0, 0, 0, 0.1),
              inset 0 0 30px rgba(255, 255, 255, 0.5) 
            ` // Layered shadows for depth + inner shine
        }}
      >
        {/* Top gloss reflection */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

        <div className="p-8 md:p-10 relative z-20">

          {/* Bear Avatar Section */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              {/* Avatar Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 to-green-200 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

              <div className="relative z-10 bg-gradient-to-b from-white/90 to-white/50 p-1 rounded-full shadow-lg border border-white/60">
                <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                  {currentBearImage && (
                    <BearAvatar
                      currentImage={currentBearImage}
                      key={currentFocus}
                      size={90}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center mb-1 text-3xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">Register</h1>
          <p className="text-center text-sm font-semibold text-blue-600/80 uppercase tracking-wider mb-8">Create your account ✨</p>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-red-200/60 flex items-start gap-3 shadow-sm backdrop-blur-sm">
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
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 text-xs font-bold uppercase tracking-wide ml-1">Full name</Label>
              <BearInput
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
                onFocus={() => handleFieldFocus('fullName')}
                className="pl-4 h-14 rounded-2xl transition-all shadow-sm focus:shadow-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)'
                }}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 text-xs font-bold uppercase tracking-wide ml-1">Email address</Label>
              <BearInput
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
                onFocus={() => handleFieldFocus('email')}
                className="pl-4 h-14 rounded-2xl transition-all shadow-sm focus:shadow-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)'
                }}
                disabled={isLoading}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-700 text-xs font-bold uppercase tracking-wide ml-1">Select your country</Label>
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
                  className={`pl-4 h-14 rounded-2xl transition-all shadow-sm focus:shadow-md ${errors.country ? "border-red-500" : ""}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="bg-white/80 backdrop-blur-md rounded-xl border-gray-200">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 text-xs font-bold uppercase tracking-wide ml-1">Password</Label>
              <div className="relative group">
                <BearInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  onFocus={() => handleFieldFocus('password')}
                  className={`pl-4 pr-12 h-14 rounded-2xl transition-all shadow-sm focus:shadow-md ${errors.password ? "border-red-500" : ""}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)'
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-white/50"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 w-full relative bg-gray-50/50 border border-gray-200 p-3 rounded-xl transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between text-xs mb-1.5 px-1">
                    <span className="text-gray-500 font-medium">Password strength</span>
                    <span className="font-bold transition-colors duration-300" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-gray-200/50">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color,
                        boxShadow: `0 0 10px ${passwordStrength.color}40`
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 px-1 leading-tight">
                    Start with letters, add numbers & symbols to make it strong.
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 text-xs font-bold uppercase tracking-wide ml-1">Confirm Password</Label>
              <div className="relative group">
                <BearInput
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
                  onFocus={() => handleFieldFocus('confirmPassword')}
                  className={`pl-4 pr-12 h-14 rounded-2xl transition-all shadow-sm focus:shadow-md ${errors.confirmPassword ? "border-red-500" : ""}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)'
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-white/50"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Empty column (placeholder) if needed, otherwise confirm password takes one slot */}
            <div className="hidden md:block"></div>

            {/* Terms Agreement */}
            <div className="col-span-1 md:col-span-2 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/40">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked: boolean) => {
                    setFormData({ ...formData, agreeToTerms: checked });
                    if (errors.agreeToTerms) {
                      setErrors({ ...errors, agreeToTerms: "" });
                    }
                  }}
                  className="mt-1 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-lg w-5 h-5 shadow-sm"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 cursor-pointer"
                  >
                    I agree to the <span className="text-blue-600 font-bold hover:underline">Terms of use</span> and <span className="text-blue-600 font-bold hover:underline">Privacy Policy</span>
                  </label>
                  <p className="text-xs text-gray-500">
                    We'll send you relevant scholarship opportunities and updates.
                  </p>
                </div>
              </div>
            </div>
            {errors.agreeToTerms && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm text-red-600 -mt-2 ml-8">{errors.agreeToTerms}</p>
              </div>
            )}

            {/* Register Button */}
            <div className="col-span-1 md:col-span-2 pt-2">
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-lg font-bold text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 relative overflow-hidden group border border-blue-500/20"
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                }}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 -skew-x-12" />
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6 font-medium">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleLoginNavigation();
              }}
            >
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500/80">
          © 2025 ApplyBro | Made with ❤️ for Students
        </p>
      </footer>
    </PremiumBackground>
  );
}
