/**
 * Scholarship matching type definitions
 */

import { Scholarship } from './scholarship';

export type MatchEligibility = 'Eligible' | 'Partially Eligible' | 'Not Eligible';

export interface MatchCriteria {
    criterion: string;
    required: any;
    actual: any;
    matched: boolean;
    weight?: number;
}

export interface MatchedScholarship extends Scholarship {
    matchScore: number; // 0-100
    eligibility: MatchEligibility;
    criteriaMatched: MatchCriteria[];
    criteriaFailed: MatchCriteria[];
    matchedCount: number;
    totalCriteria: number;
    matchPercentage: number;
}

export interface ScholarshipMatchResponse {
    status: 'success';
    data: {
        matches: MatchedScholarship[];
        totalMatches: number;
        userProfile?: {
            level?: string;
            gpa?: number;
            field?: string;
            ieltsScore?: number;
        };
    };
}

export interface MatchFilters {
    eligibility?: MatchEligibility | 'All';
    minScore?: number;
    country?: string;
    level?: string;
}

export type MatchSortBy = 'score' | 'deadline' | 'country' | 'funding';
