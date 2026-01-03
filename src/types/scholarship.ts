export interface Scholarship {
    _id: string;
    title: string;
    name?: string; // Handle potential inconsistent naming
    country: string;
    level: string | string[];
    degree?: string | string[]; // Handle potential inconsistent naming
    field?: string;
    fields?: string[];
    deadline?: string;
    status: "open" | "closed" | "upcoming";
    description?: string;
    amount?: string;
    gpaRequired?: number;
    imageUrl?: string;
    university?: {
        name: string;
        location?: {
            country: string;
            city?: string;
            address?: string;
        };
        website?: string;
    };
    requirements?: string[];
    countryFlag?: string; // Might need to be computed on frontend
    daysLeft?: number; // Computed
    isBookmarked?: boolean; // User specific
}

export interface ScholarshipsResponse {
    status: "success";
    data: {
        scholarships: Scholarship[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    };
}
