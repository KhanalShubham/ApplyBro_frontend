import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader } from './ui/loader';
import { MatchResultCard } from './MatchResultCard';
import { MatchedScholarship, MatchFilters, MatchSortBy } from '@/types/scholarshipMatch';
import { Filter, SortAsc, Search } from 'lucide-react';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';

interface MatchResultsListProps {
    matches: MatchedScholarship[];
    isLoading?: boolean;
    onBookmark?: (scholarshipId: string) => void;
    bookmarkedIds?: string[];
}

export function MatchResultsList({
    matches,
    isLoading = false,
    onBookmark,
    bookmarkedIds = []
}: MatchResultsListProps) {
    const [filters, setFilters] = useState<MatchFilters>({
        eligibility: 'All',
        minScore: 0,
    });
    const [sortBy, setSortBy] = useState<MatchSortBy>('score');
    const [selectedScholarship, setSelectedScholarship] = useState<MatchedScholarship | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter matches
    const filteredMatches = matches.filter((match) => {
        if (filters.eligibility && filters.eligibility !== 'All' && match.eligibility !== filters.eligibility) {
            return false;
        }
        if (filters.minScore && match.matchScore < filters.minScore) {
            return false;
        }
        if (filters.country && match.country !== filters.country) {
            return false;
        }
        if (filters.level && match.level !== filters.level) {
            return false;
        }
        return true;
    });

    // Sort matches
    const sortedMatches = [...filteredMatches].sort((a, b) => {
        switch (sortBy) {
            case 'score':
                return b.matchScore - a.matchScore;
            case 'deadline':
                if (!a.deadline || !b.deadline) return 0;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            case 'country':
                return a.country.localeCompare(b.country);
            case 'funding':
                // Assuming amount is a string like "$10,000" - simple comparison
                return (b.amount || '').localeCompare(a.amount || '');
            default:
                return 0;
        }
    });

    const handleViewDetails = (scholarship: MatchedScholarship) => {
        setSelectedScholarship(scholarship);
        setShowDetail(true);
    };

    const handleBack = () => {
        setShowDetail(false);
        setSelectedScholarship(null);
    };

    // Count by eligibility
    const eligibilityCounts = {
        all: matches.length,
        eligible: matches.filter(m => m.eligibility === 'Eligible').length,
        partial: matches.filter(m => m.eligibility === 'Partially Eligible').length,
        notEligible: matches.filter(m => m.eligibility === 'Not Eligible').length,
    };

    if (showDetail && selectedScholarship) {
        return <ScholarshipDetailPage scholarship={selectedScholarship} onBack={handleBack} />;
    }

    if (isLoading) {
        return <Loader className="min-h-[400px]" />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">🎓 Matched Scholarships</h2>
                <p className="text-gray-600">
                    Based on your uploaded documents, we found {matches.length} scholarship{matches.length !== 1 ? 's' : ''} that match your profile
                </p>
            </div>

            {/* Filters and Sort */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Eligibility Filter Chips */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={filters.eligibility === 'All' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, eligibility: 'All' })}
                                    style={filters.eligibility === 'All' ? { backgroundColor: '#007BFF' } : {}}
                                >
                                    All ({eligibilityCounts.all})
                                </Button>
                                <Button
                                    variant={filters.eligibility === 'Eligible' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, eligibility: 'Eligible' })}
                                    className={filters.eligibility === 'Eligible' ? 'bg-green-600 hover:bg-green-700' : ''}
                                >
                                    Eligible ({eligibilityCounts.eligible})
                                </Button>
                                <Button
                                    variant={filters.eligibility === 'Partially Eligible' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, eligibility: 'Partially Eligible' })}
                                    className={filters.eligibility === 'Partially Eligible' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                >
                                    Partial ({eligibilityCounts.partial})
                                </Button>
                                <Button
                                    variant={filters.eligibility === 'Not Eligible' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, eligibility: 'Not Eligible' })}
                                    className={filters.eligibility === 'Not Eligible' ? 'bg-red-600 hover:bg-red-700' : ''}
                                >
                                    Not Eligible ({eligibilityCounts.notEligible})
                                </Button>
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex gap-2">
                            <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as MatchSortBy)}>
                                <SelectTrigger className="w-[180px]">
                                    <SortAsc className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="score">Best Match</SelectItem>
                                    <SelectItem value="deadline">Deadline</SelectItem>
                                    <SelectItem value="country">Country</SelectItem>
                                    <SelectItem value="funding">Funding Amount</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {sortedMatches.length} of {matches.length} scholarships
                </p>
                {sortedMatches.length > 0 && (
                    <Badge variant="secondary">
                        Avg. Match: {Math.round(sortedMatches.reduce((sum, m) => sum + m.matchScore, 0) / sortedMatches.length)}%
                    </Badge>
                )}
            </div>

            {/* Results Grid */}
            {sortedMatches.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mb-2">No scholarships match your filters</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your filters to see more results.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setFilters({ eligibility: 'All', minScore: 0 })}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedMatches.map((match) => (
                        <MatchResultCard
                            key={match._id}
                            scholarship={match}
                            onViewDetails={handleViewDetails}
                            onBookmark={onBookmark}
                            isBookmarked={bookmarkedIds.includes(match._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
