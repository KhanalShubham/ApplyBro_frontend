import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Clock,
  MapPin,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Grid3x3,
  List,
} from "lucide-react";
import { motion } from "motion/react";
import { ScholarshipDetailPage } from "./ScholarshipDetailPage";
import { scholarshipService } from "@/services/scholarshipService";
import { Scholarship } from "@/types/scholarship";
import { Loader } from "../ui/loader";
import { getImageUrl } from "@/shared/lib/imageUtils";

export function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "bookmarked" | "recommended">("all");
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("all");
  const [selectedField, setSelectedField] = useState("all");
  const [gpaRange, setGpaRange] = useState([2.5]);
  const [sortBy, setSortBy] = useState("deadline");

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState<string[]>([]); // Strings for _id

  const fetchScholarships = async () => {
    try {
      setIsLoading(true);
      const response = await scholarshipService.getScholarships(
        1,
        100, // Fetch more for client-side sorting/filtering convenience if needed, or implement full server-side
        searchQuery,
        {
          country: selectedCountry,
          degree: selectedDegree,
          field: selectedField
        }
      );
      if (response.data && response.data.data) {
        setScholarships(response.data.data.scholarships || []);
      }
    } catch (error) {
      console.error("Failed to fetch scholarships", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchScholarships();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry, selectedDegree, selectedField]);

  // Helper to get country flag (simplified)
  const getCountryFlag = (countryName: string) => {
    const flags: { [key: string]: string } = {
      "USA": "🇺🇸", "United States": "🇺🇸",
      "Germany": "🇩🇪",
      "UK": "🇬🇧", "United Kingdom": "🇬🇧",
      "Australia": "🇦🇺",
      "Japan": "🇯🇵",
      "Europe": "🇪🇺",
      "Nepal": "🇳🇵",
      "Canada": "🇨🇦"
    };
    return flags[countryName] || "🌍";
  };

  // Helper to calculate days left
  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return 0;
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Client-side filtering/sorting for things not handled by backend or for refining
  const filteredScholarships = scholarships.map(s => ({
    ...s,
    // Normalize fields if needed
    id: s._id,
    name: s.title || s.name || "Untitled",
    countryFlag: getCountryFlag(s.country),
    degree: s.level || s.degree,
    daysLeft: getDaysLeft(s.deadline),
    gpaRequired: s.gpaRequired || 0, // Default to 0 if missing
    amount: s.amount || "See Details", // Default
    imageUrl: s.imageUrl || "", // Preserve imageUrl from backend
  })).filter((scholarship) => {
    // Backend handles search, country, degree, field largely, but we can double check or handle bookmarks here
    const matchesGPA = scholarship.gpaRequired <= 4.0; // Placeholder logic, adjust if gpaRange is effectively used

    // For bookmarks, we need local state persistence or another API endpoint
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "bookmarked" && bookmarkedScholarships.includes(scholarship.id)) ||
      (activeTab === "recommended" && (scholarship.gpaRequired || 0) <= 3.5); // Placeholder recommendation logic

    return matchesGPA && matchesTab;
  });

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === "deadline") return a.daysLeft - b.daysLeft;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedScholarships((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };


  const [showDetailPage, setShowDetailPage] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const handleApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setShowDetailPage(true);
  };

  if (showDetailPage && selectedScholarship) {
    return (
      <ScholarshipDetailPage
        scholarship={selectedScholarship}
        onBack={() => {
          setShowDetailPage(false);
          setSelectedScholarship(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">🎓 Scholarships</h1>
        <p className="text-gray-600">
          Discover and apply to scholarships that match your profile
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search scholarships or universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFilterExpanded(!filterExpanded)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {filterExpanded ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expandable Filters */}
          {filterExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t"
            >
              <div>
                <label className="text-sm mb-2 block text-gray-600">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block text-gray-600">Degree</label>
                <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Degrees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Degrees</SelectItem>
                    <SelectItem value="+2">+2</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block text-gray-600">Field of Study</label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Science & Technology">
                      Science & Technology
                    </SelectItem>
                    <SelectItem value="All Fields">All Fields</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block text-gray-600">
                  Minimum GPA: {gpaRange[0].toFixed(1)}
                </label>
                <Slider
                  value={gpaRange}
                  onValueChange={setGpaRange}
                  min={2.0}
                  max={4.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tabs and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            style={
              activeTab === "all"
                ? { backgroundColor: "#007BFF" }
                : undefined
            }
          >
            All Scholarships
          </Button>
          <Button
            variant={activeTab === "recommended" ? "default" : "outline"}
            onClick={() => setActiveTab("recommended")}
            style={
              activeTab === "recommended"
                ? { backgroundColor: "#007BFF" }
                : undefined
            }
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Recommended
          </Button>
          <Button
            variant={activeTab === "bookmarked" ? "default" : "outline"}
            onClick={() => setActiveTab("bookmarked")}
            style={
              activeTab === "bookmarked"
                ? { backgroundColor: "#007BFF" }
                : undefined
            }
          >
            <BookmarkCheck className="mr-2 h-4 w-4" />
            Bookmarked ({bookmarkedScholarships.length})
          </Button>
        </div>

        <div className="flex gap-1 border rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"
              }`}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"
              }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {sortedScholarships.length} scholarship{sortedScholarships.length !== 1 ? "s" : ""}
      </div>

      {/* Scholarships Grid/List */}
      {sortedScholarships.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2">No scholarships found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query to find more scholarships.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCountry("all");
                setSelectedDegree("all");
                setSelectedField("all");
                setGpaRange([2.5]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {sortedScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`hover:shadow-xl transition-all h-full overflow-hidden ${viewMode === "list" ? "flex" : ""
                  }`}
              >
                {/* Scholarship Image */}
                {scholarship.imageUrl && scholarship.imageUrl.trim() !== '' && (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(scholarship.imageUrl)}
                      alt={scholarship.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", scholarship.imageUrl);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{scholarship.countryFlag}</span>
                      <Badge
                        className={
                          scholarship.status === "closed" || scholarship.daysLeft < 7
                            ? "bg-orange-500 text-white"
                            : "bg-green-500 text-white"
                        }
                      >
                        {scholarship.status}
                      </Badge>
                    </div>
                    <button
                      onClick={() => toggleBookmark(scholarship.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {bookmarkedScholarships.includes(scholarship.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-blue-600 fill-blue-600" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <h3 className="mb-2">{scholarship.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {scholarship.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      {scholarship.degree} • {scholarship.field}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {scholarship.daysLeft} days left
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {scholarship.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Amount</div>
                      <div className="text-lg text-blue-600">{scholarship.amount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Min. GPA</div>
                      <div className="text-lg">{scholarship.gpaRequired}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      style={{ backgroundColor: "#007BFF" }}
                      onClick={() => handleApply(scholarship)}
                    >
                      Apply Now
                    </Button>
                    <Button variant="outline" onClick={() => handleApply(scholarship)}>
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full-screen Scholarship Detail Page Overlay removed as it is now conditional return */}
    </div>
  );
}
