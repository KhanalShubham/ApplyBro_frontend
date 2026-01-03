import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import applyBroLandingImage from "@/assets/applyborlanding.jpg";
import applyBroLandingImage2 from "@/assets/applyborlanding2.jpg";
import applyBroLandingImage3 from "@/assets/applyborlanding3.jpg";
import logo from "@/assets/logo.png";
import {
  GraduationCap,
  Upload,
  Sparkles,
  Globe,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { scholarshipService } from "@/services/scholarshipService";
import type { Scholarship } from "@/types/scholarship";

interface LandingPageProps {
  onSignUpClick?: () => void;
  onLoginClick?: () => void;
}

export function LandingPage({ onSignUpClick, onLoginClick }: LandingPageProps = {}) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoadingScholarships, setIsLoadingScholarships] = useState(true);

  // Hero Image Rotation Logic
  const heroImages = [applyBroLandingImage, applyBroLandingImage2, applyBroLandingImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Fetch real scholarships from API
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoadingScholarships(true);
        const response = await scholarshipService.getScholarships(1, 4);
        setScholarships(response.data.data.scholarships || []);
      } catch (error) {
        console.error("Failed to fetch scholarships:", error);
        setScholarships([]);
      } finally {
        setIsLoadingScholarships(false);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignUpNavigation = () => {
    if (onSignUpClick) {
      onSignUpClick();
      return;
    }
    navigate("/signup");
  };

  const handleLoginNavigation = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
          : "bg-white dark:bg-gray-900"
          }`}
      >
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <img src={logo} alt="ApplyBro Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">ApplyBro</span>
            </div>

            {/* Center: Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#scholarships"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors relative group"
              >
                Scholarships
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button
                onClick={handleLoginNavigation}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors relative group"
              >
                Credit Transfer
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <a
                href="#guidance"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors relative group"
              >
                Guidance
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#about"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button variant="ghost" onClick={handleLoginNavigation} className="text-gray-600 dark:text-gray-300">
                Login
              </Button>
              <Button
                onClick={handleSignUpNavigation}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/10 dark:to-gray-950">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* AI Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI-Powered Matching</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Find Scholarships<br />That Shape Your Future
              </h1>

              {/* Supporting Text */}
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                Verified scholarships, personalized matching, and a simple process designed specifically for Nepali students pursuing their dreams abroad.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleSignUpNavigation}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-lg transition-all group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/scholarships")}
                  className="border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg"
                >
                  Explore Scholarships
                </Button>
              </div>
            </motion.div>

            {/* Right Column: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-xl group max-w-lg mx-auto lg:ml-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Spacer Image to maintain layout stability based on first image aspect ratio */}
                <img
                  src={heroImages[0]}
                  alt="Spacer"
                  className="w-full h-auto opacity-0 invisible"
                />

                {/* Sliding Carousel Track */}
                {/* Fade Carousel */}
                <div className="absolute inset-0 w-full h-full">
                  {heroImages.map((img, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentImageIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Student success ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Impact Metrics */}
      <section className="py-16 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: "10,000+", label: "Students" },
              { number: "5,000+", label: "Scholarships" },
              { number: "50+", label: "Countries" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-500 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How ApplyBro Works */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Journey to Success
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to discover opportunities tailored for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Sign Up",
                description: "Create your profile in minutes",
              },
              {
                icon: Upload,
                title: "Upload",
                description: "Share your academic documents",
              },
              {
                icon: Sparkles,
                title: "Get Matched",
                description: "Discover verified scholarships",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scholarship Preview - Horizontal with Images */}
      <section id="scholarships" className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Scholarships
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real opportunities waiting for students like you
            </p>
          </div>

          {isLoadingScholarships ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Loading scholarships...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scholarships.map((scholarship, index) => {
                const deadlineDate = scholarship.deadline ? new Date(scholarship.deadline) : null;
                const formattedDeadline = deadlineDate
                  ? deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Rolling";

                return (
                  <motion.div
                    key={scholarship._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer overflow-hidden h-full"
                      onClick={handleLoginNavigation}
                    >
                      {/* Scholarship Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10">
                        <img
                          src={scholarship.imageUrl || `https://images.unsplash.com/photo-${1523050854058 + index}?w=600&h=400&fit=crop`}
                          alt={scholarship.title || scholarship.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

                        {/* Country Badge on Image */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white border-0 backdrop-blur-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {scholarship.country}
                          </Badge>
                        </div>

                        {/* Deadline Badge on Image */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formattedDeadline}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                          {scholarship.title || scholarship.name}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {scholarship.description || `Study opportunity in ${scholarship.country}`}
                        </p>

                        <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            <DollarSign className="h-4 w-4" />
                            <span className="line-clamp-1">{scholarship.amount || "Full Coverage"}</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg group"
                          onClick={handleLoginNavigation}
                        >
                          View Opportunity
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/scholarships")}
              className="border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg"
            >
              View All Scholarships
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA - Clean & Encouraging */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to begin your journey?
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Join thousands of Nepali students discovering their path to global education.
          </p>
          <Button
            size="lg"
            onClick={handleSignUpNavigation}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 px-10 py-6"
          >
            Create My Account
          </Button>
        </div>
      </section>

      {/* Footer - 3 Column Layout */}
      <footer id="about" className="py-16 px-6 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto max-w-6xl">
          {/* Main Footer Content - 3 Columns */}
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* LEFT COLUMN - Brand & Trust */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="ApplyBro Logo" className="h-12 w-auto" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">ApplyBro</span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Empowering Nepali students to discover and apply for verified international scholarships with confidence.
              </p>

              {/* Newsletter */}
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Button
                  size="sm"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            {/* MIDDLE COLUMN - Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Navigate</h4>
              <nav className="space-y-3">
                {[
                  { label: "Home", href: "#" },
                  { label: "Scholarships", href: "#scholarships" },
                  { label: "Guidance", href: "#guidance" },
                  { label: "About", href: "#about" },
                  { label: "Documents", href: "/dashboard" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* RIGHT COLUMN - Contact & Social */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h4>

              <div className="space-y-6">
                {/* Support Email */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Support</p>
                  <a
                    href="mailto:support@applybro.com"
                    className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    support@applybro.com
                  </a>
                </div>

                {/* Social Icons */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, label: "Facebook" },
                      { icon: Instagram, label: "Instagram" },
                      { icon: Linkedin, label: "LinkedIn" },
                    ].map(({ icon: Icon, label }) => (
                      <a
                        key={label}
                        href="#"
                        className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div>© 2025 ApplyBro. Empowering Students Worldwide.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}