import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const creditTransferService = {
    // Get all Nepal colleges
    async getColleges() {
        const response = await api.get('/credit-transfer/colleges');
        return response.data;
    },

    // Get programs for a specific college
    async getCollegePrograms(collegeId: string) {
        const response = await api.get(`/credit-transfer/colleges/${collegeId}/programs`);
        return response.data;
    },

    // Get courses for a specific college and program
    async getCourses(collegeId: string, programName?: string) {
        const params = programName ? { programName } : {};
        const response = await api.get(`/credit-transfer/colleges/${collegeId}/courses`, { params });
        return response.data;
    },

    // Find matching universities
    async findMatchingUniversities(data: {
        collegeId: string;
        programName: string;
        creditsCompleted: number;
        preferredCountries?: string[];
        currentYear?: number;
    }) {
        const response = await api.post('/credit-transfer/match', data);
        return response.data;
    },

    // Get credit mapping for a specific university
    async getCreditMapping(universityId: string, collegeId: string, programName: string) {
        const response = await api.get(`/credit-transfer/mapping/${universityId}`, {
            params: { collegeId, programName },
        });
        return response.data;
    },

    // Save credit transfer request
    async saveCreditTransferRequest(data: {
        currentCollege: string;
        currentProgram: string;
        currentYear: number;
        currentSemester?: number;
        creditsCompleted: number;
        preferredCountries?: string[];
        transcriptUrl?: string;
        syllabusUrl?: string;
        savedUniversities?: string[];
    }) {
        const response = await api.post('/credit-transfer/request', data);
        return response.data;
    },

    // Get user's credit transfer request
    async getUserCreditTransferRequest() {
        const response = await api.get('/credit-transfer/request');
        return response.data;
    },

    // Toggle saved university
    async toggleSavedUniversity(universityId: string) {
        const response = await api.post('/credit-transfer/toggle-saved', { universityId });
        return response.data;
    },
};
