import React, { useEffect, useState } from 'react';
import { Target, AlertCircle, Search, FileCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { scholarshipService } from '@/services/scholarshipService';
import { EnhancedRecommendationsResponse } from '@/types/recommendation';
import { RecommendationTableView } from './RecommendationTableView';
import { PreparationGuide } from './PreparationGuide';

interface RecommendationsPageProps {
    onSectionChange?: (section: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onSectionChange }) => {
    const [recommendations, setRecommendations] = useState<EnhancedRecommendationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await scholarshipService.getEnhancedRecommendations(30);
            setRecommendations(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleViewScholarship = (scholarshipId: string) => {
        // Navigate to scholarships section - the scholarship detail will open there
        onSectionChange?.('scholarships');
        // Note: Individual scholarship view will be handled by ScholarshipsPage
    };

    // Loading State
    if (loading) {
        return (
            <div className="recommendations-page p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-24 bg-gray-200 rounded-xl w-full" />
                        <div className="h-16 bg-gray-200 rounded-xl w-full" />
                        <div className="h-96 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="recommendations-page p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-16 h-16 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">Oops! Something went wrong</h2>
                        <p className="text-red-700 mb-6">{error}</p>
                        <button
                            onClick={fetchRecommendations}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!recommendations) return null;

    const { highlyRecommended, partiallyRecommended, exploreAndPrepare, stats } = recommendations;
    const totalRecommendations = highlyRecommended.length + partiallyRecommended.length + exploreAndPrepare.length;

    return (
        <div className="recommendations-page p-4 lg:p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* 1. Full-Width Header */}
                <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
                    <div className="p-3 bg-purple-100 rounded-2xl flex-shrink-0">
                        <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            Your Scholarship Recommendations
                        </h1>
                        <p className="text-gray-600 text-lg">
                            We found {totalRecommendations} opportunities matching your profile
                        </p>
                    </div>
                </div>

                {/* 2. Top Stats Bar (Full Width) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
                        <div className="px-4 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalAnalyzed}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Matches Analyzed</div>
                        </div>
                        <div className="px-4 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">{highlyRecommended.length}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Highly Recommended</div>
                        </div>
                        <div className="px-4 text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-1">{partiallyRecommended.length}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Worth Exploring</div>
                        </div>
                        <div className="px-4 text-center">
                            <div className="text-3xl font-bold text-red-600 mb-1">{exploreAndPrepare.length}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Prepare For</div>
                        </div>
                    </div>

                    {/* Document Status Indicator */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {stats.hasDocuments ? (
                                <FileCheck className="w-5 h-5 text-green-500" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                                {stats.hasDocuments
                                    ? `${stats.documentCount} Document${stats.documentCount !== 1 ? 's' : ''} Uploaded & Verified`
                                    : 'Upload documents to get better matches'}
                            </span>
                        </div>
                        {stats.missingData.length > 0 && (
                            <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full font-medium">
                                Missing: {stats.missingData.slice(0, 3).join(', ')}
                            </span>
                        )}
                    </div>
                </div>

                {/* 3. Missing Data Guide (if applicable) */}
                {stats.missingData.length > 0 && (
                    <div className="w-full">
                        <PreparationGuide missingData={stats.missingData} />
                    </div>
                )}

                {/* 4. Main Recommendations Table */}
                {totalRecommendations > 0 ? (
                    <div className="w-full">
                        <RecommendationTableView
                            recommendations={[...highlyRecommended, ...partiallyRecommended, ...exploreAndPrepare]}
                            onView={handleViewScholarship}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <Search className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No recommendations yet</h2>
                        <p className="text-gray-600 mb-6">
                            Complete your profile and upload documents to get personalized scholarship recommendations
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => onSectionChange?.('settings')}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                            >
                                Complete Profile
                            </button>
                            <button
                                onClick={() => onSectionChange?.('documents')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Upload Documents
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. Motivational Footer (Bottom, Full Width) */}
                {totalRecommendations > 0 && (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="flex justify-center mb-3 bg-white/10 p-3 rounded-full">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Keep Going!</h3>
                            <p className="text-purple-100 max-w-2xl">
                                You have {highlyRecommended.length} highly recommended scholarship{highlyRecommended.length !== 1 ? 's' : ''} waiting for you.
                                Start applying today and make your dreams come true!
                            </p>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />
                    </div>
                )}
            </div>
        </div>
    );
};
