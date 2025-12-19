import { axiosClient } from "@/shared/lib/axiosClient";
import { ScholarshipsResponse } from "@/types/scholarship";
import { ScholarshipMatchResponse } from "@/types/scholarshipMatch";
import type {
    EnhancedRecommendationsApiResponse,
    MatchExplanationResponse
} from "@/types/recommendation";

export const scholarshipService = {
    getScholarships: async (
        page = 1,
        pageSize = 20,
        search = "",
        filters?: {
            country?: string;
            degree?: string;
            field?: string;
            minGpa?: number;
        }
    ) => {
        const params: any = { page, pageSize, search };
        if (filters) {
            if (filters.country && filters.country !== "all") params.country = filters.country;
            if (filters.degree && filters.degree !== "all") params.level = filters.degree;
            if (filters.field && filters.field !== "all") params.field = filters.field;
            // if (filters.minGpa) params.minGpa = filters.minGpa; // If backend supports it
        }

        return axiosClient.get<ScholarshipsResponse>(`/scholarships`, { params });
    },

    getRecommendations: async (limit = 5) => {
        const response = await axiosClient.get<{ status: string; data: { scholarships: any[] } }>(`/scholarships/recommendations`, { params: { limit } });
        return response.data;
    },

    /**
     * Get enhanced personalized recommendations with three-tier categorization
     * @param limit - Maximum number of scholarships to return per category
     * @returns Enhanced recommendations with explanations and stats
     */
    getEnhancedRecommendations: async (limit = 30) => {
        const response = await axiosClient.get<EnhancedRecommendationsApiResponse>(
            `/scholarships/recommendations/enhanced`,
            { params: { limit } }
        );
        return response.data;
    },

    /**
     * Get detailed match explanation for a specific scholarship
     * @param scholarshipId - ID of the scholarship to explain
     * @returns Detailed match explanation with scores and reasons
     */
    getMatchExplanation: async (scholarshipId: string) => {
        const response = await axiosClient.get<MatchExplanationResponse>(
            `/scholarships/${scholarshipId}/match-explanation`
        );
        return response.data;
    },

    getScholarshipById: async (id: string) => {
        return axiosClient.get(`/scholarships/${id}`);
    },

    /**
     * Get matched scholarships based on user's documents and profile
     * @param documentId - Optional specific document ID to match against
     */
    getMatchedScholarships: async (documentId?: string): Promise<ScholarshipMatchResponse> => {
        const params = documentId ? { documentId } : {};
        const response = await axiosClient.get<ScholarshipMatchResponse>(
            '/scholarships/match',
            { params }
        );
        return response.data;
    },

    /**
     * Trigger scholarship matching for a specific document
     * @param documentId - Document ID to match scholarships for
     */
    triggerMatch: async (documentId: string): Promise<ScholarshipMatchResponse> => {
        const response = await axiosClient.post<ScholarshipMatchResponse>(
            '/scholarships/match',
            { documentId }
        );
        return response.data;
    },
};

