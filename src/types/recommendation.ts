import { Scholarship } from './scholarship';

/**
 * Enhanced Recommendation Types
 * Based on ApplyBro Recommendation System specification
 */

export interface ScholarshipMatch {
    scholarship: Scholarship;
    score: number;
    eligible: boolean;
    category: 'highly_recommended' | 'partially_suitable' | 'explore_and_prepare';
    matchedCriteria: string[];
    failedCriteria: string[];
    whyRecommended: string[];
    whyNot: string[];
    preparationSteps: string[];
    daysUntilDeadline: number;
    details: {
        userGPA?: number;
        userIELTS?: number;
        userLevel?: string;
        userField?: string;
    };
}

export interface RecommendationStats {
    totalAnalyzed: number;
    eligibleCount: number;
    missingData: string[];
    hasDocuments: boolean;
    documentCount: number;
}

export interface EnhancedRecommendationsResponse {
    highlyRecommended: ScholarshipMatch[];
    partiallyRecommended: ScholarshipMatch[];
    exploreAndPrepare: ScholarshipMatch[];
    stats: RecommendationStats;
}

export interface MatchExplanation {
    scholarship: {
        id: string;
        title: string;
        country: string;
        deadline: Date;
    };
    score: number;
    eligible: boolean;
    category: 'highly_recommended' | 'partially_suitable' | 'explore_and_prepare';
    matchedCriteria: string[];
    failedCriteria: string[];
    whyRecommended: string[];
    whyNot: string[];
    preparationSteps: string[];
    daysUntilDeadline: number;
    details: {
        userGPA?: number;
        userIELTS?: number;
        userLevel?: string;
        userField?: string;
    };
}

export interface MatchExplanationResponse {
    status: 'success';
    data: MatchExplanation;
}

export interface EnhancedRecommendationsApiResponse {
    status: 'success';
    data: EnhancedRecommendationsResponse;
}

// Category badge configurations
// Category badge configurations
export const CATEGORY_CONFIG = {
    highly_recommended: {
        label: 'Highly Recommended',
        color: 'green',
        emoji: '',
        description: 'Best matches for you',
        minScore: 80
    },
    partially_suitable: {
        label: 'Worth Exploring',
        color: 'yellow',
        emoji: '',
        description: 'Good options with some gaps',
        minScore: 60
    },
    explore_and_prepare: {
        label: 'Prepare for These',
        color: 'red',
        emoji: '',
        description: 'Future opportunities to work towards',
        minScore: 0
    }
} as const;

export type CategoryType = keyof typeof CATEGORY_CONFIG;
