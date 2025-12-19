import React, { useEffect, useState } from 'react';
import { scholarshipService } from '@/services/scholarshipService';
import { MatchExplanation } from '@/types/recommendation';
import { MatchScoreIndicator } from './MatchScoreIndicator';
import { PreparationGuide } from './PreparationGuide';

interface MatchExplanationModalProps {
    scholarshipId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
    scholarshipId,
    isOpen,
    onClose
}) => {
    const [explanation, setExplanation] = useState<MatchExplanation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && scholarshipId) {
            fetchExplanation();
        }
    }, [isOpen, scholarshipId]);

    const fetchExplanation = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await scholarshipService.getMatchExplanation(scholarshipId);
            setExplanation(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to load match explanation');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">📊 Match Explanation</h3>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        {explanation && (
                            <p className="text-sm text-purple-100 mt-1">
                                {explanation.scholarship.title}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                <p className="font-medium">Error loading explanation</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        )}

                        {explanation && (
                            <>
                                {/* Match Score */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Overall Match Score</h4>
                                    <MatchScoreIndicator
                                        score={explanation.score}
                                        category={explanation.category}
                                        showLabel={true}
                                        size="lg"
                                    />
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Eligible:</span>
                                            <span className={`ml-2 font-semibold ${explanation.eligible ? 'text-green-600' : 'text-red-600'}`}>
                                                {explanation.eligible ? '✓ Yes' : '✗ No'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Deadline:</span>
                                            <span className="ml-2 font-semibold text-gray-900">
                                                {explanation.daysUntilDeadline} days left
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Why Recommended */}
                                {explanation.whyRecommended.length > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                                            <span className="text-xl">✓</span>
                                            <span>Why This Matches You</span>
                                        </h4>
                                        <ul className="space-y-2">
                                            {explanation.whyRecommended.map((reason, index) => (
                                                <li key={index} className="flex items-start gap-3 text-sm text-green-800">
                                                    <span className="text-green-500 mt-0.5">✓</span>
                                                    <span className="flex-1">{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Why Not Recommended */}
                                {explanation.whyNot.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                                            <span className="text-xl">✗</span>
                                            <span>Areas of Concern</span>
                                        </h4>
                                        <ul className="space-y-2">
                                            {explanation.whyNot.map((reason, index) => (
                                                <li key={index} className="flex items-start gap-3 text-sm text-red-800">
                                                    <span className="text-red-500 mt-0.5">✗</span>
                                                    <span className="flex-1">{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Your Profile Summary */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-3">Your Profile Data</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {explanation.details.userGPA && (
                                            <div>
                                                <span className="text-blue-600">GPA:</span>
                                                <span className="ml-2 font-medium text-blue-900">
                                                    {explanation.details.userGPA.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {explanation.details.userIELTS && (
                                            <div>
                                                <span className="text-blue-600">IELTS:</span>
                                                <span className="ml-2 font-medium text-blue-900">
                                                    {explanation.details.userIELTS}
                                                </span>
                                            </div>
                                        )}
                                        {explanation.details.userLevel && (
                                            <div>
                                                <span className="text-blue-600">Level:</span>
                                                <span className="ml-2 font-medium text-blue-900">
                                                    {explanation.details.userLevel}
                                                </span>
                                            </div>
                                        )}
                                        {explanation.details.userField && (
                                            <div>
                                                <span className="text-blue-600">Field:</span>
                                                <span className="ml-2 font-medium text-blue-900">
                                                    {explanation.details.userField}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Preparation Steps */}
                                {explanation.preparationSteps.length > 0 && (
                                    <PreparationGuide
                                        preparationSteps={explanation.preparationSteps}
                                    />
                                )}

                                {/* Matched Criteria Summary */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-gray-600 mb-2">✓ Matched Criteria</div>
                                        <div className="font-semibold text-green-600 text-lg">
                                            {explanation.matchedCriteria.length}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-gray-600 mb-2">✗ Failed Criteria</div>
                                        <div className="font-semibold text-red-600 text-lg">
                                            {explanation.failedCriteria.length}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
