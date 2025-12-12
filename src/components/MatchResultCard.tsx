import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    MapPin,
    GraduationCap,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    TrendingUp
} from 'lucide-react';
import { MatchedScholarship } from '@/types/scholarshipMatch';
import { calculateDaysLeft, formatDeadline } from '@/shared/lib/dateUtils';
import { useState } from 'react';

interface MatchResultCardProps {
    scholarship: MatchedScholarship;
    onViewDetails: (scholarship: MatchedScholarship) => void;
    onBookmark?: (scholarshipId: string) => void;
    isBookmarked?: boolean;
}

export function MatchResultCard({
    scholarship,
    onViewDetails,
    onBookmark,
    isBookmarked = false
}: MatchResultCardProps) {
    const [bookmarked, setBookmarked] = useState(isBookmarked);

    const daysLeft = scholarship.deadline ? calculateDaysLeft(scholarship.deadline) : 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-600 text-white';
        if (score >= 60) return 'bg-amber-600 text-white';
        return 'bg-red-600 text-white';
    };

    const getEligibilityBadge = (eligibility: string) => {
        const config = {
            'Eligible': { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
            'Partially Eligible': { color: 'bg-amber-100 text-amber-800 border-amber-300', icon: TrendingUp },
            'Not Eligible': { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
        };

        const { color, icon: Icon } = config[eligibility as keyof typeof config] || config['Not Eligible'];

        return (
            <Badge className={`${color} border`}>
                <Icon className="mr-1 h-3 w-3" />
                {eligibility}
            </Badge>
        );
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        onBookmark?.(scholarship._id);
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                            {scholarship.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {scholarship.university?.name || 'University'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        {/* Match Score */}
                        <Badge className={`${getScoreColor(scholarship.matchScore)} px-3 py-1 text-sm font-bold`}>
                            {scholarship.matchScore}%
                        </Badge>

                        {/* Bookmark */}
                        <button
                            onClick={handleBookmark}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        >
                            {bookmarked ? (
                                <BookmarkCheck className="h-5 w-5 text-blue-600 fill-blue-600" />
                            ) : (
                                <Bookmark className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Eligibility Badge */}
                <div className="mb-4">
                    {getEligibilityBadge(scholarship.eligibility)}
                </div>

                {/* Scholarship Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{scholarship.country}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{scholarship.level}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className={daysLeft < 30 ? 'text-red-600 font-medium' : ''}>
                            {daysLeft} days left
                        </span>
                    </div>

                    {scholarship.amount && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{scholarship.amount}</span>
                        </div>
                    )}
                </div>

                {/* Matched Criteria */}
                {scholarship.criteriaMatched && scholarship.criteriaMatched.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                            ✓ Matched Criteria ({scholarship.matchedCount}/{scholarship.totalCriteria})
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {scholarship.criteriaMatched.slice(0, 3).map((criteria, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                                    {criteria.criterion}
                                </Badge>
                            ))}
                            {scholarship.criteriaMatched.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{scholarship.criteriaMatched.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Failed Criteria */}
                {scholarship.criteriaFailed && scholarship.criteriaFailed.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                            ✗ Missing Requirements
                        </p>
                        <div className="space-y-1">
                            {scholarship.criteriaFailed.slice(0, 2).map((criteria, index) => (
                                <p key={index} className="text-xs text-red-600">
                                    • {criteria.criterion}
                                </p>
                            ))}
                            {scholarship.criteriaFailed.length > 2 && (
                                <p className="text-xs text-gray-500">
                                    +{scholarship.criteriaFailed.length - 2} more requirements
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => onViewDetails(scholarship)}
                        className="flex-1"
                        style={{ backgroundColor: '#007BFF' }}
                    >
                        View Details
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
