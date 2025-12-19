import React, { useEffect, useState } from 'react';
import { scholarshipService } from '@/services/scholarshipService';
import { EnhancedRecommendationsResponse } from '@/types/recommendation';
import { RecommendationCard } from './RecommendationCard';
import { PreparationGuide } from './PreparationGuide';

interface RecommendationsPageProps {
    onSectionChange?: (section: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onSectionChange }) => {
    const [recommendations, setRecommendations] = useState<EnhancedRecommendationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState({
        highly: true,
        partially: true,
        explore: false
    });

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

    const toggleSection = (section: 'highly' | 'partially' | 'explore') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSave = (scholarshipId: string) => {
        // TODO: Implement save functionality
        console.log('Save scholarship:', scholarshipId);
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
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
                        <div className="h-24 bg-gray-200 rounded mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-96 bg-gray-200 rounded-xl" />
                            ))}
                        </div>
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
                        <div className="text-6xl mb-4">😞</div>
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        🎯 Your Scholarship Recommendations
                    </h1>
                    <p className="text-gray-600">
                        Personalized matches based on your profile and documents
                    </p>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{stats.totalAnalyzed}</div>
                            <div className="text-sm text-gray-600 mt-1">Scholarships Analyzed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{highlyRecommended.length}</div>
                            <div className="text-sm text-gray-600 mt-1">Highly Recommended</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600">{partiallyRecommended.length}</div>
                            <div className="text-sm text-gray-600 mt-1">Worth Exploring</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{exploreAndPrepare.length}</div>
                            <div className="text-sm text-gray-600 mt-1">Prepare For</div>
                        </div>
                    </div>

                    {/* Document Status */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={stats.hasDocuments ? 'text-green-500' : 'text-orange-500'}>
                                    {stats.hasDocuments ? '✓' : '⚠️'}
                                </span>
                                <span className="text-sm text-gray-700">
                                    {stats.hasDocuments
                                        ? `${stats.documentCount} document${stats.documentCount > 1 ? 's' : ''} uploaded`
                                        : 'No documents uploaded'}
                                </span>
                            </div>
                            {stats.missingData.length > 0 && (
                                <div className="text-sm text-orange-600">
                                    Missing: {stats.missingData.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Missing Data Guide */}
                {stats.missingData.length > 0 && (
                    <div className="mb-8">
                        <PreparationGuide missingData={stats.missingData} />
                    </div>
                )}

                {/* No Recommendations */}
                {totalRecommendations === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
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

                {/* Highly Recommended Section */}
                {highlyRecommended.length > 0 && (
                    <div className="mb-8">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl px-6 py-4 cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors"
                            onClick={() => toggleSection('highly')}
                        >
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🟢</span>
                                    <div>
                                        <h2 className="text-xl font-bold">Highly Recommended</h2>
                                        <p className="text-sm text-green-100">Best matches for your profile</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                                        {highlyRecommended.length}
                                    </span>
                                    <span className="text-2xl transform transition-transform" style={{
                                        transform: expandedSections.highly ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ▼
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.highly && (
                            <div className="bg-white rounded-b-xl shadow-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {highlyRecommended.map((match, index) => (
                                        <RecommendationCard
                                            key={match.scholarship._id}
                                            scholarshipMatch={match}
                                            onSave={handleSave}
                                            onViewScholarship={handleViewScholarship}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Partially Suitable Section */}
                {partiallyRecommended.length > 0 && (
                    <div className="mb-8">
                        <div
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-xl px-6 py-4 cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                            onClick={() => toggleSection('partially')}
                        >
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🟡</span>
                                    <div>
                                        <h2 className="text-xl font-bold">Worth Exploring</h2>
                                        <p className="text-sm text-yellow-100">Good options with minor gaps</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                                        {partiallyRecommended.length}
                                    </span>
                                    <span className="text-2xl transform transition-transform" style={{
                                        transform: expandedSections.partially ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ▼
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.partially && (
                            <div className="bg-white rounded-b-xl shadow-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {partiallyRecommended.map((match, index) => (
                                        <RecommendationCard
                                            key={match.scholarship._id}
                                            scholarshipMatch={match}
                                            onSave={handleSave}
                                            onViewScholarship={handleViewScholarship}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Explore & Prepare Section */}
                {exploreAndPrepare.length > 0 && (
                    <div className="mb-8">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl px-6 py-4 cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors"
                            onClick={() => toggleSection('explore')}
                        >
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔵</span>
                                    <div>
                                        <h2 className="text-xl font-bold">Prepare for These</h2>
                                        <p className="text-sm text-blue-100">Future opportunities to work towards</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                                        {exploreAndPrepare.length}
                                    </span>
                                    <span className="text-2xl transform transition-transform" style={{
                                        transform: expandedSections.explore ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ▼
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.explore && (
                            <div className="bg-white rounded-b-xl shadow-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {exploreAndPrepare.map((match, index) => (
                                        <RecommendationCard
                                            key={match.scholarship._id}
                                            scholarshipMatch={match}
                                            onSave={handleSave}
                                            onViewScholarship={handleViewScholarship}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Motivational Footer */}
                {totalRecommendations > 0 && (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">🌟 Keep Going!</h3>
                        <p className="text-purple-100">
                            You have {highlyRecommended.length} amazing scholarship{highlyRecommended.length !== 1 ? 's' : ''} waiting for you.
                            Start applying today and make your dreams come true!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
