import React, { useState } from 'react';
import { ScholarshipMatch, CATEGORY_CONFIG } from '@/types/recommendation';
import { MatchScoreIndicator } from './MatchScoreIndicator';
import { MatchExplanationModal } from './MatchExplanationModal';

interface RecommendationCardProps {
    scholarshipMatch: ScholarshipMatch;
    onSave?: (scholarshipId: string) => void;
    onViewScholarship?: (scholarshipId: string) => void;
    compact?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    scholarshipMatch,
    onSave,
    onViewScholarship,
    compact = false
}) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const { scholarship, score, category, whyRecommended, daysUntilDeadline } = scholarshipMatch;
    const config = CATEGORY_CONFIG[category];

    const handleViewDetails = () => {
        if (onViewScholarship) {
            onViewScholarship(scholarship._id);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSave) {
            onSave(scholarship._id);
        }
    };

    const handleExplain = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowExplanation(true);
    };

    // Format deadline
    const formatDeadline = (deadline?: string) => {
        if (!deadline) return 'No deadline';
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Urgency indicator
    const getDeadlineUrgency = () => {
        if (daysUntilDeadline <= 7) return { text: '🔥 URGENT', color: 'text-red-600', bg: 'bg-red-50' };
        if (daysUntilDeadline <= 30) return { text: '⏰ Soon', color: 'text-orange-600', bg: 'bg-orange-50' };
        return null;
    };

    const urgency = getDeadlineUrgency();

    // Category-specific colors
    const borderColors = {
        highly_recommended: 'border-green-300 hover:border-green-400',
        partially_suitable: 'border-yellow-300 hover:border-yellow-400',
        explore_and_prepare: 'border-blue-300 hover:border-blue-400'
    };

    const bgColors = {
        highly_recommended: 'bg-green-50',
        partially_suitable: 'bg-yellow-50',
        explore_and_prepare: 'bg-blue-50'
    };

    if (compact) {
        return (
            <>
                <div
                    className={`recommendation-card-compact border-2 ${borderColors[category]} rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white`}
                    onClick={handleViewDetails}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{scholarship.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <span>🌍 {scholarship.country}</span>
                                {scholarship.level && <span>• {scholarship.level}</span>}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="font-bold text-lg" style={{ color: CATEGORY_CONFIG[category].color }}>
                                {score}%
                            </div>
                            <div className="text-xs text-gray-500">match</div>
                        </div>
                    </div>
                </div>
                <MatchExplanationModal
                    scholarshipId={scholarship._id}
                    isOpen={showExplanation}
                    onClose={() => setShowExplanation(false)}
                />
            </>
        );
    }

    return (
        <>
            <div
                className={`recommendation-card border-2 ${borderColors[category]} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white`}
            >
                {/* Header with Image */}
                <div className={`relative ${bgColors[category]} p-6 pb-4`}>
                    {urgency && (
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${urgency.bg} ${urgency.color} mb-3`}>
                            {urgency.text}
                        </div>
                    )}

                    <div className="flex items-start gap-4">
                        {scholarship.imageUrl && (
                            <img
                                src={scholarship.imageUrl}
                                alt={scholarship.title}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                                {scholarship.title}
                            </h3>
                            {scholarship.university?.name && (
                                <p className="text-sm text-gray-600 truncate">
                                    {scholarship.university.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Match Score */}
                    <div className="mt-4">
                        <MatchScoreIndicator
                            score={score}
                            category={category}
                            showLabel={false}
                            size="md"
                        />
                    </div>

                    {/* Category Badge */}
                    <div className="mt-3">
                        <span className="inline-flex items-center gap-1 text-sm font-medium">
                            <span className="text-lg">{config.emoji}</span>
                            <span className={`${category === 'highly_recommended' ? 'text-green-700' :
                                category === 'partially_suitable' ? 'text-yellow-700' :
                                    'text-blue-700'
                                }`}>
                                {config.label}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 pt-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">🌍</span>
                            <span className="text-gray-700">{scholarship.country}</span>
                        </div>
                        {scholarship.level && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">🎓</span>
                                <span className="text-gray-700">{scholarship.level}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">📅</span>
                            <span className="text-gray-700">{formatDeadline(scholarship.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">💰</span>
                            <span className="text-gray-700">{scholarship.amount || 'Full Tuition'}</span>
                        </div>
                    </div>

                    {/* Why Recommended */}
                    {whyRecommended.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Why this matches you:</h4>
                            <ul className="space-y-1">
                                {whyRecommended.slice(0, 3).map((reason, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                                        <span className="flex-1">{reason}</span>
                                    </li>
                                ))}
                            </ul>
                            {whyRecommended.length > 3 && (
                                <button
                                    onClick={handleExplain}
                                    className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                                >
                                    +{whyRecommended.length - 3} more reasons
                                </button>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleViewDetails}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                            View Details
                        </button>
                        <button
                            onClick={handleExplain}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            title="Why recommended?"
                        >
                            💡
                        </button>
                        {onSave && (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                title="Save scholarship"
                            >
                                🔖
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Explanation Modal */}
            <MatchExplanationModal
                scholarshipId={scholarship._id}
                isOpen={showExplanation}
                onClose={() => setShowExplanation(false)}
            />
        </>
    );
};
