import React from 'react';

interface PreparationGuideProps {
    missingData?: string[];
    preparationSteps?: string[];
    compact?: boolean;
}

export const PreparationGuide: React.FC<PreparationGuideProps> = ({
    missingData = [],
    preparationSteps = [],
    compact = false
}) => {
    if (missingData.length === 0 && preparationSteps.length === 0) {
        return null;
    }

    if (compact) {
        return (
            <div className="preparation-guide-compact">
                {missingData.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                        <span>⚠️</span>
                        <span>Missing: {missingData.join(', ')}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="preparation-guide space-y-4">
            {/* Missing Data Alert */}
            {missingData.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl mt-0.5">⚠️</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-orange-900 mb-2">
                                Missing Information
                            </h4>
                            <p className="text-sm text-orange-700 mb-3">
                                Complete your profile to get better scholarship matches:
                            </p>
                            <ul className="space-y-2">
                                {missingData.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-orange-800">
                                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Preparation Steps */}
            {preparationSteps.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl mt-0.5">💡</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2">
                                Next Steps to Prepare
                            </h4>
                            <ul className="space-y-2">
                                {preparationSteps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-blue-800">
                                        <span className="mt-1 flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-700">
                                            {index + 1}
                                        </span>
                                        <span className="flex-1">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Motivational Message */}
            {preparationSteps.length > 0 && (
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        🌟 <span className="font-medium">Keep going!</span> Every step brings you closer to your scholarship goals.
                    </p>
                </div>
            )}
        </div>
    );
};
