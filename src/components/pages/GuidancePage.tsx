import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  FileText,
  Video,
  HelpCircle,
  ClipboardCheck,
  Bookmark,
  Share2,
  CheckCircle,
  Play,
  Loader2,
  File,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { guidanceService, GuidanceItem } from "@/services/guidanceService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { ScrollArea } from "../ui/scroll-area";

export function GuidancePage() {
  const [activeTab, setActiveTab] = useState<"articles" | "videos" | "faqs" | "tests">("articles");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [resources, setResources] = useState<GuidanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Interactive Quiz State
  const [activeQuiz, setActiveQuiz] = useState<GuidanceItem | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Content Reader State
  const [activeContent, setActiveContent] = useState<GuidanceItem | null>(null);

  // Video Player State
  const [activeVideo, setActiveVideo] = useState<GuidanceItem | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [guidanceRes, savedRes] = await Promise.all([
          guidanceService.getAll(),
          guidanceService.getSavedItems()
        ]);

        if (guidanceRes.data && (guidanceRes.data as any).data) {
          setResources((guidanceRes.data as any).data || []);
        }

        if (savedRes.data && (savedRes.data as any).data) {
          const savedData = (savedRes.data as any).data;
          const ids = new Set<string>(savedData.map((s: any) => s.itemId));
          setSavedIds(ids);
        }
      } catch (error) {
        console.error("Failed to fetch guidance", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleBookmark = async (id: string, type: string) => {
    try {
      if (savedIds.has(id)) {
        await guidanceService.unsaveItem(id);
        const newSet = new Set(savedIds);
        newSet.delete(id);
        setSavedIds(newSet);
        toast.success("Removed from saved items");
      } else {
        await guidanceService.saveItem(type, id);
        const newSet = new Set(savedIds);
        newSet.add(id);
        setSavedIds(newSet);
        toast.success("Bookmarked successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update bookmark");
    }
  };

  const startQuiz = (test: GuidanceItem) => {
    setActiveQuiz(test);
    setQuizStep(0);
    setQuizAnswers(new Array((test as any).questions?.length || 0).fill(-1));
    setQuizScore(null);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizStep] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;
    const questions = (activeQuiz as any).questions || [];
    let correct = 0;
    questions.forEach((q: any, i: number) => {
      if (quizAnswers[i] === q.correctOptionIndex) correct++;
    });
    setQuizScore(correct);
  };

  const openResource = (resource: GuidanceItem) => {
    // 1. Video
    if (resource.type === "video") {
      if (resource.videoUrl) {
        setActiveVideo(resource);
      } else {
        toast.error("Video URL not available");
      }
      return;
    }

    // 2. Test
    if (resource.type === "test") {
      const questions = (resource as any).questions;
      if (questions && questions.length > 0) {
        startQuiz(resource);
      } else if (resource.fileUrl) {
        window.open(resource.fileUrl, "_blank");
      } else if (resource.content) {
        // Fallback to reading content if no questions/file
        setActiveContent(resource);
      } else {
        toast.error("Test content not available");
      }
      return;
    }

    // 3. Article / FAQ
    if (resource.fileUrl) {
      window.open(resource.fileUrl, "_blank");
    } else if (resource.content) {
      setActiveContent(resource);
    } else {
      toast.error("Content not available");
    }
  };

  const getFilteredResources = () => {
    let filtered = resources;
    switch (activeTab) {
      case "articles": filtered = filtered.filter((r) => r.type === "article"); break;
      case "videos": filtered = filtered.filter((r) => r.type === "video"); break;
      case "faqs": filtered = filtered.filter((r) => r.type === "faq"); break;
      case "tests": filtered = filtered.filter((r) => r.type === "test"); break;
    }
    if (selectedTopic !== "all") {
      filtered = filtered.filter((r) => r.topic === selectedTopic);
    }
    return filtered;
  };

  const filteredResources = getFilteredResources();
  const recommendedForYou = resources.filter((r) => (r.topic === "DAAD" || r.topic === "Motivation Letter") && r.type !== 'faq').slice(0, 3);

  if (isLoading && resources.length === 0) {
    return <Loader className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">📚 Guidance & Resources</h1>
        <p className="text-gray-600">
          Learn everything you need to succeed in your scholarship journey
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <label className="text-sm text-gray-600 font-medium">Filter by Topic:</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="DAAD">DAAD</SelectItem>
                <SelectItem value="SOP">Statement of Purpose</SelectItem>
                <SelectItem value="Visas">Visa</SelectItem>
                <SelectItem value="Motivation Letter">Motivation Letter</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value: string) => setActiveTab(value as "articles" | "videos" | "faqs" | "tests")}
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="articles"><FileText className="mr-2 h-4 w-4" /> Articles</TabsTrigger>
              <TabsTrigger value="videos"><Video className="mr-2 h-4 w-4" /> Videos</TabsTrigger>
              <TabsTrigger value="faqs"><HelpCircle className="mr-2 h-4 w-4" /> FAQs</TabsTrigger>
              <TabsTrigger value="tests"><ClipboardCheck className="mr-2 h-4 w-4" /> Tests</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredResources.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <HelpCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  No resources found for this category.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Changed to 3 columns for better density */}
                  {filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource._id || resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-all h-full flex flex-col overflow-hidden group border-muted">
                        {/* Thumbnail Section */}
                        {resource.thumbnail ? (
                          <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={resource.thumbnail}
                              alt={resource.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {resource.type === "video" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                  <Play className="h-5 w-5 text-blue-600 ml-1" />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Fallback thumbnail if none */
                          <div className={`relative aspect-video flex items-center justify-center bg-gray-50`}>
                            {resource.type === 'video' ? <Video className="h-10 w-10 text-gray-300" /> : <FileText className="h-10 w-10 text-gray-300" />}
                          </div>
                        )}

                        <CardContent className="p-4 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs font-normal">{resource.topic}</Badge>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(resource._id || resource.id!, resource.type); }}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Bookmark className={`h-4 w-4 ${savedIds.has(resource._id || resource.id!) ? "fill-blue-600 text-blue-600" : ""}`} />
                            </button>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight flex-1" title={resource.title}>
                            {resource.title}
                          </h3>

                          <div className="mt-auto space-y-3">
                            <div className="flex items-center text-xs text-gray-500 gap-2">
                              <span>{resource.readTime || resource.duration || "5 min"}</span>
                              <span>•</span>
                              <span>{resource.difficulty || "Beginner"}</span>
                            </div>
                            <Button
                              className="w-full shadow-none"
                              size="sm"
                              onClick={() => openResource(resource)}
                            >
                              {resource.type === "video" ? "Watch Now" : resource.type === "test" ? "Start Test" : "Read Now"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <h3 className="font-semibold flex items-center gap-2">✨ Top Picks</h3>
            </CardHeader>
            <CardContent className="p-0">
              {recommendedForYou.map((r, i) => (
                <div key={i} className="p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openResource(r)}>
                  <h4 className="text-sm font-medium line-clamp-2 mb-1">{r.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">{r.type}</Badge>
                    <span>{r.topic}</span>
                  </div>
                </div>
              ))}
              <div className="p-3">
                <Button variant="ghost" className="w-full text-xs h-8">View All Recommendations</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Quiz Dialog */}
      <Dialog open={!!activeQuiz} onOpenChange={(open) => !open && setActiveQuiz(null)}>
        <DialogContent className="max-w-2xl" aria-describedby="quiz-description">
          <DialogHeader>
            <DialogTitle>{activeQuiz?.title}</DialogTitle>
            <p id="quiz-description" className="sr-only">Interactive quiz for {activeQuiz?.title}</p>
          </DialogHeader>

          {/* ... existing quiz content ... */}

          {activeQuiz && (activeQuiz as any).questions && (
            <div className="py-4">
              {quizScore === null ? (
                // Question View
                <div className="space-y-6">
                  {/* ... */}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Question {quizStep + 1} of {(activeQuiz as any).questions.length}</span>
                    <Badge>{activeQuiz.difficulty}</Badge>
                  </div>
                  <Progress value={((quizStep + 1) / (activeQuiz as any).questions.length) * 100} className="h-2" />

                  <h3 className="text-lg font-medium">{(activeQuiz as any).questions[quizStep].questionText}</h3>

                  <div className="grid gap-3">
                    {(activeQuiz as any).questions[quizStep].options.map((option: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 ${quizAnswers[quizStep] === i ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'}`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${quizAnswers[quizStep] === i ? 'border-blue-600' : 'border-gray-400'}`}>
                          {quizAnswers[quizStep] === i && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                        </div>
                        {option}
                      </div>
                    ))}
                  </div>

                  <DialogFooter className="mt-6 flex justify-between w-full sm:justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setQuizStep(prev => Math.max(0, prev - 1))}
                      disabled={quizStep === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>

                    {quizStep < (activeQuiz as any).questions.length - 1 ? (
                      <Button onClick={() => setQuizStep(prev => prev + 1)}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={submitQuiz}>Submit Quiz</Button>
                    )}
                  </DialogFooter>
                </div>
              ) : (
                // Score View
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardCheck className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Score: {quizScore} / {(activeQuiz as any).questions.length}</h2>
                    <p className="text-gray-500">
                      {quizScore === (activeQuiz as any).questions.length ? "Perfect Score! 🎉" : "Great effort! Keep practicing."}
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => startQuiz(activeQuiz!)}>Retry</Button>
                    <Button onClick={() => setActiveQuiz(null)}>Close</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Content Reader Dialog */}
      <Dialog open={!!activeContent} onOpenChange={(open) => !open && setActiveContent(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0" aria-describedby="content-description">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{activeContent?.title}</DialogTitle>
            <p id="content-description" className="text-sm text-gray-500">{activeContent?.topic} • {activeContent?.readTime}</p>
          </DialogHeader>
          <ScrollArea className="flex-1 px-8 py-6">
            <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
              {/* Render Markdown or plain text */}
              {activeContent?.content?.split('\n').map((line, i) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">{line}</p>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden text-white" aria-describedby="video-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Video Player: {activeVideo?.title}</DialogTitle>
            <p id="video-description">Playing video: {activeVideo?.title}</p>
          </DialogHeader>
          <div className="relative aspect-video w-full flex items-center justify-center">
            <video
              src={activeVideo?.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              onClick={() => setActiveVideo(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-4 bg-zinc-900 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">{activeVideo?.title}</h3>
              <p className="text-sm text-gray-400">{activeVideo?.description}</p>
            </div>
            <Button variant="outline" className="text-black border-white/20 bg-white hover:bg-gray-200" onClick={() => window.open(activeVideo?.videoUrl, '_blank')}>
              Open in New Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
