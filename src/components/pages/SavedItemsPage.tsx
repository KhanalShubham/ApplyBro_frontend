import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Search,
  Bookmark,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SavedItem {
  id: number;
  type: "scholarship" | "article" | "video" | "post";
  title: string;
  description?: string;
  thumbnail?: string;
  savedDate: string;
  metadata?: {
    country?: string;
    deadline?: string;
    author?: string;
    duration?: string;
  };
}

export function SavedItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"scholarships" | "guidance" | "videos" | "posts">(
    "scholarships"
  );

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: 1,
      type: "scholarship",
      title: "Fulbright Scholarship Program",
      description: "Full funding for Master's students including tuition and living expenses",
      thumbnail: "https://images.unsplash.com/photo-1653250198948-1405af521dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZ3JhZHVhdGlvbiUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjM2MzkxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Nov 5, 2025",
      metadata: {
        country: "🇺🇸 USA",
        deadline: "15 days left",
      },
    },
    {
      id: 2,
      type: "scholarship",
      title: "DAAD Scholarship",
      description: "Monthly stipend for engineering and science students",
      thumbnail: "https://images.unsplash.com/photo-1706016899218-ebe36844f70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyMjgyMjUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Nov 4, 2025",
      metadata: {
        country: "🇩🇪 Germany",
        deadline: "30 days left",
      },
    },
    {
      id: 3,
      type: "scholarship",
      title: "Chevening Scholarship",
      description: "UK government's global scholarship program for future leaders",
      thumbnail: "https://images.unsplash.com/photo-1638636241638-aef5120c5153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMGNlcnRpZmljYXRlJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjIzNjM5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Nov 3, 2025",
      metadata: {
        country: "🇬🇧 UK",
        deadline: "7 days left",
      },
    },
    {
      id: 4,
      type: "article",
      title: "How to Write a Winning Motivation Letter",
      description: "Complete guide with examples and templates",
      thumbnail: "https://images.unsplash.com/photo-1632830049084-308fd151d8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcmVhZGluZyUyMGJvb2t8ZW58MXx8fHwxNzYyMzI2MjczfDA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Nov 2, 2025",
      metadata: {
        author: "ApplyBro Team",
      },
    },
    {
      id: 5,
      type: "article",
      title: "Top 10 Scholarship Essay Tips",
      description: "Expert advice for crafting compelling scholarship essays",
      thumbnail: "https://images.unsplash.com/photo-1760351065294-b069f6bcadc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzYyMjk5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Nov 1, 2025",
      metadata: {
        author: "Dr. Sarah Johnson",
      },
    },
    {
      id: 6,
      type: "video",
      title: "IELTS Preparation Complete Guide",
      description: "Comprehensive video course for IELTS success",
      thumbnail: "https://images.unsplash.com/photo-1762329389942-c721052cb5ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGxlYXJuaW5nJTIwb25saW5lfGVufDF8fHx8MTc2MjM2NjYxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Oct 30, 2025",
      metadata: {
        duration: "45:20",
      },
    },
    {
      id: 7,
      type: "video",
      title: "Student Visa Application Process",
      description: "Step-by-step guide for visa applications",
      thumbnail: "https://images.unsplash.com/photo-1608986596619-eb50cc56831f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIzMDMzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "Oct 28, 2025",
      metadata: {
        duration: "32:15",
      },
    },
    {
      id: 8,
      type: "post",
      title: "My Germany Visa Journey 🇩🇪",
      description: "Just got my visa approved! Here's everything you need to know about the process...",
      savedDate: "Oct 25, 2025",
      metadata: {
        author: "Sarah Khadka",
      },
    },
    {
      id: 9,
      type: "post",
      title: "Tips for IELTS Speaking Test",
      description: "Scored 8.5 in speaking. Sharing my preparation strategy and common mistakes...",
      savedDate: "Oct 22, 2025",
      metadata: {
        author: "Rohan Sharma",
      },
    },
  ]);

  const handleRemove = (id: number) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
  };

  const getFilteredItems = () => {
    let filtered = savedItems;

    // Filter by tab
    switch (activeTab) {
      case "scholarships":
        filtered = filtered.filter((item) => item.type === "scholarship");
        break;
      case "guidance":
        filtered = filtered.filter((item) => item.type === "article");
        break;
      case "videos":
        filtered = filtered.filter((item) => item.type === "video");
        break;
      case "posts":
        filtered = filtered.filter((item) => item.type === "post");
        break;
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "scholarships":
        return <GraduationCap className="mr-2 h-4 w-4" />;
      case "guidance":
        return <FileText className="mr-2 h-4 w-4" />;
      case "videos":
        return <Video className="mr-2 h-4 w-4" />;
      case "posts":
        return <MessageSquare className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  const getItemCount = (type: string) => {
    return savedItems.filter((item) => {
      switch (type) {
        case "scholarships":
          return item.type === "scholarship";
        case "guidance":
          return item.type === "article";
        case "videos":
          return item.type === "video";
        case "posts":
          return item.type === "post";
        default:
          return false;
      }
    }).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">🔖 Saved Items</h1>
        <p className="text-gray-600">
          Your bookmarked scholarships, articles, videos, and community posts
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search within saved items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "scholarships" | "guidance" | "videos" | "posts")
        }
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scholarships">
            {getTabIcon("scholarships")}
            Scholarships ({getItemCount("scholarships")})
          </TabsTrigger>
          <TabsTrigger value="guidance">
            {getTabIcon("guidance")}
            Guidance ({getItemCount("guidance")})
          </TabsTrigger>
          <TabsTrigger value="videos">
            {getTabIcon("videos")}
            Videos ({getItemCount("videos")})
          </TabsTrigger>
          <TabsTrigger value="posts">
            {getTabIcon("posts")}
            Posts ({getItemCount("posts")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredItems.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#E9F2FF" }}
                >
                  <Bookmark className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2">No saved items yet</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? "No results found for your search. Try different keywords."
                    : "Start bookmarking scholarships, articles, videos, and posts to see them here."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all overflow-hidden">
                    {item.thumbnail && (
                      <ImageWithFallback
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary">
                          {item.type === "scholarship" && "Scholarship"}
                          {item.type === "article" && "Article"}
                          {item.type === "video" && "Video"}
                          {item.type === "post" && "Community Post"}
                        </Badge>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>

                      <h3 className="mb-2 line-clamp-2">{item.title}</h3>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Metadata */}
                      {item.metadata && (
                        <div className="space-y-1 mb-3 text-sm text-gray-600">
                          {item.metadata.country && (
                            <div>{item.metadata.country}</div>
                          )}
                          {item.metadata.deadline && (
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {item.metadata.deadline}
                              </Badge>
                            </div>
                          )}
                          {item.metadata.author && (
                            <div>By {item.metadata.author}</div>
                          )}
                          {item.metadata.duration && (
                            <div>Duration: {item.metadata.duration}</div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-gray-500">
                          Saved {item.savedDate}
                        </span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
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
  );
}
