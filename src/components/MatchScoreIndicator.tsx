import React from 'react';
import { CATEGORY_CONFIG, CategoryType } from '@/types/recommendation';

interface MatchScoreIndicatorProps {
    score: number;
    category: CategoryType;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const MatchScoreIndicator: React.FC<MatchScoreIndicatorProps> = ({
    score,
    category,
    showLabel = true,
    size = 'md'
}) => {
    const config = CATEGORY_CONFIG[category];

    // Size configurations
    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    // Color configurations
    const colorClasses = {
        highly_recommended: {
            bg: 'bg-green-100',
            fill: 'bg-green-500',
            text: 'text-green-700'
        },
        partially_suitable: {
            bg: 'bg-yellow-100',
            fill: 'bg-yellow-500',
            text: 'text-yellow-700'
        },
        explore_and_prepare: {
            bg: 'bg-blue-100',
            fill: 'bg-blue-500',
            text: 'text-blue-700'
        }
    };

    const colors = colorClasses[category];

    return (
        <div className="match-score-indicator">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <div className={`w-full ${colors.bg} rounded-full overflow-hidden ${sizeClasses[size]}`}>
                        <div
                            className={`${colors.fill} ${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${score}%` }}
                        />
                    </div>
                </div>
                <div className={`font-semibold ${colors.text} ${textSizeClasses[size]} min-w-[3rem] text-right`}>
                    {score}%
                </div>
            </div>
            {showLabel && (
                <div className={`mt-2 flex items-center gap-2 ${textSizeClasses[size]}`}>
                    <span className="text-lg">{config.emoji}</span>
                    <span className={`font-medium ${colors.text}`}>
                        {config.label}
                    </span>
                </div>
            )}
        </div>
    );
};
