import React, { useState } from 'react';
import { ScholarshipMatch, CATEGORY_CONFIG } from '@/types/recommendation';
import { Globe, GraduationCap, Calendar, DollarSign, MoreHorizontal, Trophy, Zap, Layers } from 'lucide-react';
import { MatchScoreIndicator } from './MatchScoreIndicator';
import { MatchExplanationModal } from './MatchExplanationModal';

interface RecommendationTableViewProps {
    recommendations: ScholarshipMatch[];
    onView: (id: string) => void;
}

export const RecommendationTableView: React.FC<RecommendationTableViewProps> = ({ recommendations, onView }) => {
    const [selectedExplanationId, setSelectedExplanationId] = useState<string | null>(null);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No Deadline';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'highly_recommended': return <Trophy className="w-4 h-4 text-green-600" />;
            case 'partially_suitable': return <Zap className="w-4 h-4 text-yellow-600" />;
            case 'explore_and_prepare': return <Layers className="w-4 h-4 text-red-600" />;
            default: return null;
        }
    };

    const handleRowClick = (id: string) => {
        // Open the explanation modal instead of global navigation
        setSelectedExplanationId(id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Scholarship</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Match Status</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recommendations.map((match) => {
                            const { scholarship, score, category } = match;
                            const config = CATEGORY_CONFIG[category];

                            return (
                                <tr
                                    key={scholarship._id}
                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    onClick={() => handleRowClick(scholarship._id)}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            {scholarship.imageUrl ? (
                                                <img
                                                    src={scholarship.imageUrl}
                                                    alt={scholarship.title}
                                                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold flex-shrink-0 text-lg">
                                                    {scholarship.title.charAt(0)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate text-base mb-1" title={scholarship.title}>
                                                    {scholarship.title}
                                                </h4>
                                                <div className="text-sm text-gray-500 flex items-center gap-1.5 truncate">
                                                    <GraduationCap className="w-3.5 h-3.5" />
                                                    {scholarship.university?.name || 'Various Universities'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <MatchScoreIndicator score={score} category={category} size="sm" showLabel={false} />
                                                <span className="font-bold text-gray-900">{score}%</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit">
                                                {getCategoryIcon(category)}
                                                {config.label}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            {scholarship.country}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            {scholarship.amount || 'Full Tuition'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(scholarship.deadline)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView(scholarship._id);
                                            }}
                                            title="View Full Details"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Explanation Modal */}
            <MatchExplanationModal
                scholarshipId={selectedExplanationId || ''}
                isOpen={!!selectedExplanationId}
                onClose={() => setSelectedExplanationId(null)}
            />
        </div>
    );
};
