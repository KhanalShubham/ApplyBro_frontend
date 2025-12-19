import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  GraduationCap,
  Upload,
  Sparkles,
  Globe,
  BookOpen,
  Users,
  FileText,
  Video,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";

interface LandingPageProps {
  onSignUpClick?: () => void;
  onLoginClick?: () => void;
}

const ARTICLES = [
  {
    title: "How to Write a Winning Motivation Letter",
    time: "5 min read",
    image:
      "https://images.unsplash.com/photo-1638636241638-aef5120c5153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMGNlcnRpZmljYXRlJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjIzNjM5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Crafting the Perfect Statement of Purpose",
    time: "7 min read",
    image:
      "https://images.unsplash.com/photo-1760351065294-b069f6bcadc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzYyMjk5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Top 10 Scholarship Essay Tips",
    time: "4 min read",
    image:
      "https://images.unsplash.com/photo-1608986596619-eb50cc56831f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIzMDMzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Understanding Scholarship Requirements",
    time: "6 min read",
    image:
      "https://images.unsplash.com/photo-1653250198948-1405af521dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZ3JhZHVhdGlvbiUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjM2MzkxNXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const VIDEOS = [
  { title: "IELTS Preparation Complete Guide", duration: "45:20" },
  { title: "Student Visa Application Process", duration: "32:15" },
  { title: "Interview Tips for Scholarships", duration: "28:40" },
  { title: "Document Preparation Checklist", duration: "22:30" },
];

export function LandingPage({ onSignUpClick, onLoginClick }: LandingPageProps = {}) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scholarships = useMemo(
    () => [
      {
        name: "Fulbright Scholarship",
        country: "🇺🇸 USA",
        deadline: "Dec 15, 2025",
        amount: "$50,000",
        description: "Full funding for master's students",
      },
      {
        name: "DAAD Scholarship",
        country: "🇩🇪 Germany",
        deadline: "Nov 30, 2025",
        amount: "€1,200/month",
        description: "For engineering & science students",
      },
      {
        name: "Chevening Scholarship",
        country: "🇬🇧 UK",
        deadline: "Jan 10, 2026",
        amount: "Full Coverage",
        description: "Leadership development program",
      },
      {
        name: "MEXT Scholarship",
        country: "🇯🇵 Japan",
        deadline: "Dec 20, 2025",
        amount: "¥145,000/month",
        description: "For undergraduate & graduate students",
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        quote:
          "ApplyBro helped me find the perfect scholarship to study in Germany. The process was so simple!",
        country: "🇩🇪 Germany",
      },
      {
        name: "Rajesh Kumar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
        quote: "I got matched with 5 scholarships I never knew existed. Thank you ApplyBro!",
        country: "🇦🇺 Australia",
      },
      {
        name: "Anjali Thapa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
        quote:
          "The document upload feature made my application process 10x easier. Highly recommend!",
        country: "🇯🇵 Japan",
      },
    ],
    []
  );

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Scholarships", id: "scholarships" },
    { label: "Guidance", id: "guidance" },
    { label: "Community", id: "community" },
    { label: "About", id: "about" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background shadow-md" : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#007BFF" }}>
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl" style={{ color: "#007BFF" }}>
                ApplyBro
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <ModeToggle />
              <Button variant="ghost" onClick={handleLoginNavigation}>
                Login
              </Button>
              <Button style={{ backgroundColor: "#007BFF" }} onClick={handleSignUpNavigation}>
                Sign Up
              </Button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-background border-t py-4 space-y-3"
            >
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 hover:bg-muted/50"
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 pt-2 space-y-2">
                <Button variant="outline" className="w-full" onClick={handleLoginNavigation}>
                  Login
                </Button>
                <Button className="w-full" style={{ backgroundColor: "#007BFF" }} onClick={handleSignUpNavigation}>
                  Sign Up
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <section
        id="home"
        className="pt-32 pb-20 px-4"
        style={{
          background: "var(--background)",
        }}
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="mb-6">Find Scholarships That Match You</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Upload your academic details and get personalized scholarship recommendations worldwide. Your dream education is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" style={{ backgroundColor: "#007BFF" }} onClick={handleSignUpNavigation}>
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection("scholarships")}>
                  Browse Scholarships
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div>
                  <div className="text-2xl text-blue-600">10,000+</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div>
                  <div className="text-2xl text-blue-600">5,000+</div>
                  <div className="text-sm text-muted-foreground">Scholarships</div>
                </div>
                <div>
                  <div className="text-2xl text-blue-600">50+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1653250198948-1405af521dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZ3JhZHVhdGlvbiUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjM2MzkxNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Student celebrating graduation"
                className="rounded-2xl shadow-2xl w-full"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -left-6 bg-background p-4 rounded-xl shadow-lg"
              >
                <BookOpen className="h-8 w-8 text-blue-600" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-background p-4 rounded-xl shadow-lg"
              >
                <Globe className="h-8 w-8 text-blue-600" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to discover scholarships tailored for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "Sign Up",
                description: "Create your student profile in minutes",
                step: "01",
              },
              {
                icon: <Upload className="h-8 w-8" />,
                title: "Upload Documents",
                description: "+2 or Bachelor certificate and transcripts",
                step: "02",
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "Get Matched",
                description: "Explore verified scholarships instantly",
                step: "03",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <div
                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: "#007BFF" }}
                      >
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm text-blue-600">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="scholarships" className="py-20 px-4 bg-blue-50 dark:bg-blue-900/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Top Opportunities for You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover scholarships from around the world
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: "#E9F2FF", color: "#007BFF" }}
                      >
                        {scholarship.country}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{scholarship.deadline}</span>
                    </div>
                    <h3 className="mb-2">{scholarship.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{scholarship.description}</p>
                    <div className="text-lg text-blue-600 mb-4">{scholarship.amount}</div>
                    <Button variant="outline" className="w-full hover:bg-blue-600 hover:text-white" onClick={handleSignUpNavigation}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Scholarships
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section id="guidance" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Learn How to Win Scholarships</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert guidance and resources to boost your application
            </p>
          </div>
          <Tabs defaultValue="articles" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="articles">
                <FileText className="mr-2 h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="mr-2 h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="articles" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {ARTICLES.map((article) => (
                  <Card key={article.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-2">{article.time}</p>
                        <h3 className="text-lg">{article.title}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="videos" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {VIDEOS.map((video) => (
                  <Card key={video.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#E9F2FF" }}
                        >
                          <Video className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg mb-2">{video.title}</h3>
                          <Badge variant="secondary">{video.duration}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section
        id="community"
        className="py-20 px-4 bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Hear from Real Students</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who found their dream scholarships
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.country}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" style={{ backgroundColor: "#007BFF" }} onClick={handleSignUpNavigation}>
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl p-12 text-center text-white"
            style={{
              background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
            }}
          >
            <h2 className="mb-4 text-white">Ready to Discover Scholarships That Fit You?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already found their dream scholarships
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-background text-blue-600 hover:bg-gray-100"
              onClick={handleSignUpNavigation}
            >
              Create My Account Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <footer id="about" className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#007BFF" }}
                >
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl">ApplyBro</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering students with opportunities to study abroad through personalized scholarship matching.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {["About Us", "Scholarships", "Success Stories", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Help Center"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
            <p>© 2025 ApplyBro | Empowering Students Across Nepal</p>
          </div>
        </div>
      </footer>

    </div>
  );
}