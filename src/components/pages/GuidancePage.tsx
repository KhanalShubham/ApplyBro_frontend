import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FileText,
  Video,
  HelpCircle,
  ClipboardCheck,
  Bookmark,
  Share2,
  CheckCircle,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Resource {
  id: number;
  type: "article" | "video" | "faq" | "test";
  title: string;
  description: string;
  thumbnail?: string;
  topic: string;
  duration?: string;
  readTime?: string;
  progress?: number;
  isBookmarked?: boolean;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export function GuidancePage() {
  const [activeTab, setActiveTab] = useState<"articles" | "videos" | "faqs" | "tests">(
    "articles"
  );
  const [selectedTopic, setSelectedTopic] = useState("all");

  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      type: "article",
      title: "How to Write a Winning Motivation Letter",
      description: "Complete guide with examples and templates for scholarship applications",
      thumbnail: "https://images.unsplash.com/photo-1632830049084-308fd151d8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcmVhZGluZyUyMGJvb2t8ZW58MXx8fHwxNzYyMzI2MjczfDA&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "Motivation Letter",
      readTime: "8 min read",
      progress: 60,
      isBookmarked: true,
      difficulty: "Intermediate",
    },
    {
      id: 2,
      type: "article",
      title: "Crafting the Perfect Statement of Purpose",
      description: "Expert advice for writing compelling SOP for graduate programs",
      thumbnail: "https://images.unsplash.com/photo-1760351065294-b069f6bcadc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzYyMjk5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "SOP",
      readTime: "10 min read",
      progress: 30,
      isBookmarked: false,
      difficulty: "Advanced",
    },
    {
      id: 3,
      type: "article",
      title: "Top 10 Scholarship Essay Tips",
      description: "Proven strategies to make your scholarship essay stand out",
      thumbnail: "https://images.unsplash.com/photo-1638636241638-aef5120c5153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMGNlcnRpZmljYXRlJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjIzNjM5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "Motivation Letter",
      readTime: "6 min read",
      progress: 0,
      isBookmarked: true,
      difficulty: "Beginner",
    },
    {
      id: 4,
      type: "article",
      title: "DAAD Application Guide for Nepalese Students",
      description: "Step-by-step guide for applying to DAAD scholarships from Nepal",
      thumbnail: "https://images.unsplash.com/photo-1706016899218-ebe36844f70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyMjgyMjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "DAAD",
      readTime: "12 min read",
      progress: 0,
      isBookmarked: false,
      difficulty: "Intermediate",
    },
    {
      id: 5,
      type: "video",
      title: "IELTS Preparation Complete Guide",
      description: "Comprehensive video course covering all IELTS sections",
      thumbnail: "https://images.unsplash.com/photo-1762329389942-c721052cb5ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGxlYXJuaW5nJTIwb25saW5lfGVufDF8fHx8MTc2MjM2NjYxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "IELTS",
      duration: "45:20",
      progress: 25,
      isBookmarked: true,
      difficulty: "Beginner",
    },
    {
      id: 6,
      type: "video",
      title: "Student Visa Application Process",
      description: "Everything you need to know about student visa applications",
      thumbnail: "https://images.unsplash.com/photo-1608986596619-eb50cc56831f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIzMDMzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "DAAD",
      duration: "32:15",
      progress: 0,
      isBookmarked: false,
      difficulty: "Intermediate",
    },
    {
      id: 7,
      type: "video",
      title: "Interview Tips for Scholarships",
      description: "Common questions and how to answer them confidently",
      thumbnail: "https://images.unsplash.com/photo-1653250198948-1405af521dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZ3JhZHVhdGlvbiUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjM2MzkxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      topic: "Motivation Letter",
      duration: "28:40",
      progress: 50,
      isBookmarked: true,
      difficulty: "Advanced",
    },
    {
      id: 8,
      type: "faq",
      title: "What documents do I need for scholarship applications?",
      description: "Complete list of required documents and how to prepare them",
      topic: "DAAD",
      difficulty: "Beginner",
    },
    {
      id: 9,
      type: "faq",
      title: "How to write a motivation letter with no experience?",
      description: "Tips for highlighting your potential when you lack work experience",
      topic: "Motivation Letter",
      difficulty: "Beginner",
    },
    {
      id: 10,
      type: "faq",
      title: "What is a good IELTS score for scholarships?",
      description: "Required IELTS scores for different scholarship programs",
      topic: "IELTS",
      difficulty: "Beginner",
    },
    {
      id: 11,
      type: "test",
      title: "IELTS Reading Practice Test",
      description: "Full-length practice test with answers and explanations",
      topic: "IELTS",
      duration: "60 min",
      difficulty: "Intermediate",
    },
    {
      id: 12,
      type: "test",
      title: "Motivation Letter Self-Assessment",
      description: "Check if your motivation letter meets scholarship standards",
      topic: "Motivation Letter",
      duration: "15 min",
      difficulty: "Beginner",
    },
  ]);

  const toggleBookmark = (id: number) => {
    setResources(
      resources.map((r) =>
        r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r
      )
    );
  };

  const getFilteredResources = () => {
    let filtered = resources;

    // Filter by tab
    switch (activeTab) {
      case "articles":
        filtered = filtered.filter((r) => r.type === "article");
        break;
      case "videos":
        filtered = filtered.filter((r) => r.type === "video");
        break;
      case "faqs":
        filtered = filtered.filter((r) => r.type === "faq");
        break;
      case "tests":
        filtered = filtered.filter((r) => r.type === "test");
        break;
    }

    // Filter by topic
    if (selectedTopic !== "all") {
      filtered = filtered.filter((r) => r.topic === selectedTopic);
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();

  const recommendedForYou = resources
    .filter((r) => r.topic === "DAAD" || r.topic === "Motivation Letter")
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">📚 Guidance & Resources</h1>
        <p className="text-gray-600">
          Learn everything you need to succeed in your scholarship journey
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600">Filter by Topic:</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="DAAD">DAAD</SelectItem>
                    <SelectItem value="SOP">Statement of Purpose</SelectItem>
                    <SelectItem value="Motivation Letter">Motivation Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "articles" | "videos" | "faqs" | "tests")
            }
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="articles">
                <FileText className="mr-2 h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="mr-2 h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="faqs">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="tests">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Practice Tests
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Articles & Videos */}
              {(activeTab === "articles" || activeTab === "videos") && (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-xl transition-all h-full">
                        {resource.thumbnail && (
                          <div className="relative">
                            <ImageWithFallback
                              src={resource.thumbnail}
                              alt={resource.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            {activeTab === "videos" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-t-lg">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                  <Play className="h-8 w-8 text-blue-600 ml-1" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-2">
                              <Badge variant="secondary">{resource.topic}</Badge>
                              <Badge
                                variant="outline"
                                className={
                                  resource.difficulty === "Beginner"
                                    ? "border-green-500 text-green-700"
                                    : resource.difficulty === "Intermediate"
                                    ? "border-blue-500 text-blue-700"
                                    : "border-orange-500 text-orange-700"
                                }
                              >
                                {resource.difficulty}
                              </Badge>
                            </div>
                            <button
                              onClick={() => toggleBookmark(resource.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  resource.isBookmarked
                                    ? "text-blue-600 fill-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
                          </div>

                          <h3 className="mb-2 line-clamp-2">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {resource.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span>
                              {resource.readTime || resource.duration}
                            </span>
                          </div>

                          {resource.progress !== undefined && resource.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-blue-600">
                                  {resource.progress}%
                                </span>
                              </div>
                              <Progress value={resource.progress} className="h-1.5" />
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              style={{ backgroundColor: "#007BFF" }}
                            >
                              {resource.progress && resource.progress > 0
                                ? "Continue"
                                : activeTab === "videos"
                                ? "Watch Now"
                                : "Read Now"}
                            </Button>
                            <Button variant="outline" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {resource.progress === 100 && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* FAQs */}
              {activeTab === "faqs" && (
                <div className="space-y-4">
                  {filteredResources.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-all">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#E9F2FF" }}
                            >
                              <HelpCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg">{faq.title}</h3>
                                <Badge variant="secondary">{faq.topic}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {faq.description}
                              </p>
                              <Button variant="outline" size="sm">
                                Read Answer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Practice Tests */}
              {activeTab === "tests" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredResources.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "#E9F2FF" }}
                            >
                              <ClipboardCheck className="h-6 w-6 text-blue-600" />
                            </div>
                            <Badge variant="secondary">{test.topic}</Badge>
                          </div>
                          <h3 className="mb-2">{test.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {test.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <span>Duration: {test.duration}</span>
                            <Badge variant="outline">{test.difficulty}</Badge>
                          </div>
                          <Button
                            className="w-full"
                            style={{ backgroundColor: "#007BFF" }}
                          >
                            Start Test
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Recommended */}
        <div className="lg:col-span-3">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <h3 className="flex items-center gap-2">
                ✨ Recommended for You
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Based on your uploaded documents
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedForYou.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-all cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#E9F2FF" }}
                      >
                        {resource.type === "article" ? (
                          <FileText className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Video className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm mb-1 line-clamp-2">
                          {resource.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {resource.topic}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full mt-4">
                View All Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
