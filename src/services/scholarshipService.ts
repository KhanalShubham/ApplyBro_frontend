import { axiosClient } from "@/shared/lib/axiosClient";
import { ScholarshipsResponse } from "@/types/scholarship";

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

    getScholarshipById: async (id: string) => {
        return axiosClient.get(`/scholarships/${id}`);
    }
};
