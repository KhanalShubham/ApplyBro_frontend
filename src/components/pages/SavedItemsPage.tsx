import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { guidanceService, SavedItem as ApiSavedItem } from "@/services/guidanceService";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

interface SavedItemUI {
  id: string; // The Content ID (not the saved record ID)
  savedRecordId: string; // The actual SavedItem document ID
  type: "scholarship" | "article" | "video" | "post" | "test" | "faq";
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
  const [activeTab, setActiveTab] = useState<"scholarships" | "guidance" | "videos" | "posts">("scholarships");
  const [savedItems, setSavedItems] = useState<SavedItemUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedItems = async () => {
    try {
      setIsLoading(true);
      const response = await guidanceService.getSavedItems();
      if (response.data && (response.data as any).data) {
        const rawItems: ApiSavedItem[] = (response.data as any).data;
        const mappedItems: SavedItemUI[] = rawItems.map(item => {
          const details = item.details || {};
          let metadata: SavedItemUI['metadata'] = {};

          if (item.itemType === 'scholarship') {
            metadata = {
              country: details.location?.country || details.country,
              deadline: details.deadline ? new Date(details.deadline).toLocaleDateString() : 'N/A'
            };
          } else if (item.itemType === 'post') {
            metadata = { author: details.author?.name || 'Unknown' };
          } else {
            // Guidance types
            metadata = { duration: details.duration || details.readTime };
          }

          return {
            id: item.itemId,
            savedRecordId: item._id,
            type: item.itemType as any,
            title: details.title || "Untitled",
            description: details.description || details.content?.substring(0, 100),
            thumbnail: details.thumbnail || details.imageUrl, // Handle scholarships imageUrl vs guidance thumbnail
            savedDate: new Date(item.createdAt).toLocaleDateString(),
            metadata
          };
        });
        setSavedItems(mappedItems);
      }
    } catch (error) {
      console.error("Failed to fetch saved items", error);
      toast.error("Failed to load saved items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const handleRemove = async (contentId: string) => { // Expect ContentId for deletion as per controller
    try {
      await guidanceService.unsaveItem(contentId);
      setSavedItems(savedItems.filter((item) => item.id !== contentId));
      toast.success("Item removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const getFilteredItems = () => {
    let filtered = savedItems;

    // Filter by tab
    switch (activeTab) {
      case "scholarships":
        filtered = filtered.filter((item) => item.type === "scholarship");
        break;
      case "guidance":
        filtered = filtered.filter((item) => item.type === "article" || item.type === "test" || item.type === "faq");
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

  const getItemCount = (tab: string) => {
    // Count based on tab logic
    return savedItems.filter((item) => {
      switch (tab) {
        case "scholarships":
          return item.type === "scholarship";
        case "guidance":
          return item.type === "article" || item.type === "test" || item.type === "faq";
        case "videos":
          return item.type === "video";
        case "posts":
          return item.type === "post";
        default:
          return false;
      }
    }).length;
  };

  if (isLoading) return <Loader className="min-h-[400px]" />;

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
        onValueChange={(value: string) =>
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
                          {item.type === "faq" && "FAQ"}
                          {item.type === "test" && "Test"}
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
