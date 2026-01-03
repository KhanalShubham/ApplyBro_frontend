import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    GraduationCap,
    Building2,
    BookOpen,
    Globe,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MapPin,
    DollarSign,
    Calendar,
    Bookmark,
    ExternalLink,
    Upload,
    Loader2,
    Search,
} from 'lucide-react';
import { creditTransferService } from '@/services/creditTransferService';
import { toast } from 'sonner';

import softwaricaImg from '../../assets/softwarica.jpg';
import aceImg from '../../assets/AceInternationalBusinessSchool.jpg';
import texasImg from '../../assets/Texas.jpg';
import asianImg from '../../assets/AsianInstituteofTechnologyandManagement.jpg';
import balmikiImg from '../../assets/Balmiki_School.jpg';
import techspireImg from '../../assets/Techspirie.jpg';
import sunwayImg from '../../assets/sunway.jpg';
import biratnagarImg from '../../assets/biratnagar.jpg';

interface College {
    _id: string;
    name: string;
    affiliation: string;
    location?: string;
    programs?: Array<{ name: string; duration: string; totalCredits: number }>;
    imageUrl?: string;
}

interface Program {
    name: string;
    duration: string;
    totalCredits: number;
}


interface University {
    _id: string;
    name: string;
    country: string;
    city?: string;
    programName: string;
    totalCredits: number;
    duration?: { years: number; semesters: number };
    tuitionRange?: { min: number; max: number; currency: string };
    entryRequirements?: {
        minGPA?: number;
        englishTest?: string;
        minScore?: number;
        otherRequirements?: string[];
    };
    website?: string;
    imageUrl?: string;
    isVerified: boolean;
}

interface CreditTransferInfo {
    totalTransferable: number;
    remainingCredits: number;
    remainingSemesters: number | null;
    acceptanceBreakdown: {
        full: number;
        partial: number;
        none: number;
    };
    matchScore: number;
    creditBreakdown: Array<{
        courseName: string;
        creditValue: number;
        acceptanceStatus: 'full' | 'partial' | 'none';
        creditsTransferred: number;
        equivalentCourseName?: string;
        verificationStatus: string;
    }>;
}

interface MatchResult {
    university: University;
    creditTransfer: CreditTransferInfo;
}

const COUNTRIES = [
    { value: 'UK', label: '🇬🇧 United Kingdom', flag: '🇬🇧' },
    { value: 'Australia', label: '🇦🇺 Australia', flag: '🇦🇺' },
    { value: 'USA', label: '🇺🇸 United States', flag: '🇺🇸' },
    { value: 'Canada', label: '🇨🇦 Canada', flag: '🇨🇦' },
    { value: 'Europe', label: '🇪🇺 Europe', flag: '🇪🇺' },
];

const COLLEGE_IMAGES: Record<string, string> = {
    'Ace International Business School': aceImg,
    'The British College': 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop',
    'Herald College Kathmandu': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop',
    'Islington College': 'https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?q=80&w=1000&auto=format&fit=crop',
    'Softwarica College of IT and E-Commerce': softwaricaImg,
    'Texas College of Management and IT': texasImg,
    'Global College International': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    'British International College': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop',
    'Asian Institute of Technology and Management': asianImg,
    'Balmiki Lincoln College': balmikiImg,
    'Techspire College': techspireImg,
    'Sunway College': sunwayImg,
    'Biratnagar International College': biratnagarImg,
    'Nepal Business College': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop',
    'Padmashree College': 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1000&auto=format&fit=crop',
    'Silver Mountain School of Hotel Management': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop',
    'Phoenix College of Management': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop',
    'Stamford College': 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=1000&auto=format&fit=crop',
    'Patan College for Professional Studies': 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1000&auto=format&fit=crop',
    'Presidential Graduate School': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
    'Pokhara Lincoln International College': 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop',
    'The London College': 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop',
    'Virinchi College': 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1000&auto=format&fit=crop',
    'The Westminster College': 'https://images.unsplash.com/photo-1492538430083-0127211933a9?q=80&w=1000&auto=format&fit=crop',
    'Western Mega College': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop',
    'Yeti International College': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
};

const getRandomImage = (id: string) => {
    // Curated list of high-quality, reliable campus images from Unsplash
    const images = [
        'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop', // Modern glass building
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop', // Classic campus
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop', // Lecture hall
        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1000&auto=format&fit=crop', // Library
        'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1000&auto=format&fit=crop', // Modern interior
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop', // Corporate office style
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop', // Hotel/Hospitality style
        'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=1000&auto=format&fit=crop', // Classic brick
    ];
    // Simple hash to get consistent image for same ID
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % images.length;
    return images[index];
};

export function CreditTransferPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [colleges, setColleges] = useState<College[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [savedUniversities, setSavedUniversities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCreditMapping, setSelectedCreditMapping] = useState<any>(null);
    const [viewingMappingFor, setViewingMappingFor] = useState<string | null>(null);
    const [collegeSearch, setCollegeSearch] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        selectedCollege: '',
        selectedProgram: '',
        currentYear: '',
        currentSemester: '',
        creditsCompleted: '',
        preferredCountries: [] as string[],
    });

    // Load colleges on mount
    useEffect(() => {
        loadColleges();
        loadUserRequest();
    }, []);

    const loadColleges = async () => {
        try {
            const response = await creditTransferService.getColleges();
            setColleges(response.data || []);
        } catch (error) {
            console.error('Failed to load colleges:', error);
            toast.error('Failed to load colleges');
        }
    };

    const loadUserRequest = async () => {
        try {
            const response = await creditTransferService.getUserCreditTransferRequest();
            if (response.data) {
                setSavedUniversities(response.data.savedUniversities?.map((u: any) => u._id || u) || []);
            }
        } catch (error) {
            // User might not have a request yet
            console.log('No existing request found');
        }
    };

    const handleCollegeChange = async (collegeId: string) => {
        setFormData({ ...formData, selectedCollege: collegeId, selectedProgram: '' });

        // Load programs for selected college and navigate
        try {
            const college = colleges.find(c => c._id === collegeId);
            if (college?.programs) {
                setPrograms(college.programs);
            } else {
                const response = await creditTransferService.getCollegePrograms(collegeId);
                setPrograms(response.data || []);
            }
            // Auto-navigate to next step
            setStep(2);
        } catch (error) {
            console.error('Failed to load programs:', error);
            toast.error('Failed to load programs');
        }
    };

    const toggleCountry = (country: string) => {
        const current = formData.preferredCountries;
        if (current.includes(country)) {
            setFormData({
                ...formData,
                preferredCountries: current.filter(c => c !== country),
            });
        } else {
            setFormData({
                ...formData,
                preferredCountries: [...current, country],
            });
        }
    };

    const handleFindMatches = async () => {
        if (!formData.selectedCollege || !formData.selectedProgram || !formData.creditsCompleted) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await creditTransferService.findMatchingUniversities({
                collegeId: formData.selectedCollege,
                programName: formData.selectedProgram,
                creditsCompleted: parseInt(formData.creditsCompleted),
                preferredCountries: formData.preferredCountries.length > 0 ? formData.preferredCountries : undefined,
                currentYear: formData.currentYear ? parseInt(formData.currentYear) : undefined,
            });

            setMatches(response.data.universities || []);
            setStep(4);

            if (response.data.universities.length === 0) {
                toast.info('No matching universities found. Try adjusting your preferences.');
            } else {
                toast.success(`Found ${response.data.universities.length} matching universities!`);
            }
        } catch (error: any) {
            console.error('Failed to find matches:', error);
            toast.error(error.response?.data?.message || 'Failed to find matching universities');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSave = async (universityId: string) => {
        try {
            await creditTransferService.toggleSavedUniversity(universityId);

            if (savedUniversities.includes(universityId)) {
                setSavedUniversities(savedUniversities.filter(id => id !== universityId));
                toast.success('University removed from saved list');
            } else {
                setSavedUniversities([...savedUniversities, universityId]);
                toast.success('University saved!');
            }
        } catch (error: any) {
            console.error('Failed to toggle save:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to save universities');
            } else {
                toast.error('Failed to update saved universities');
            }
        }
    };

    const viewCreditMapping = async (universityId: string) => {
        setIsLoading(true);
        setViewingMappingFor(universityId);

        try {
            const response = await creditTransferService.getCreditMapping(
                universityId,
                formData.selectedCollege,
                formData.selectedProgram
            );
            setSelectedCreditMapping(response.data);
        } catch (error) {
            console.error('Failed to load credit mapping:', error);
            toast.error('Failed to load credit details');
        } finally {
            setIsLoading(false);
        }
    };

    const getAcceptanceIcon = (status: string) => {
        switch (status) {
            case 'full':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'partial':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            default:
                return <XCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const getAcceptanceBadge = (status: string) => {
        const variants: Record<string, { bg: string; text: string; label: string }> = {
            full: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Accepted' },
            partial: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Partial' },
            none: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Not Accepted' },
        };

        const variant = variants[status] || variants.none;

        return (
            <Badge className={`${variant.bg} ${variant.text} border-0`}>
                {variant.label}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                        <GraduationCap className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Credit Transfer
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Transfer Your Credits. Continue Your Degree Abroad.
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Already studying Bachelor's in Nepal? Find universities abroad that accept your credits.
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 md:gap-4">
                        {[
                            { num: 1, label: 'College' },
                            { num: 2, label: 'Program' },
                            { num: 3, label: 'Preferences' },
                            { num: 4, label: 'Results' },
                        ].map((s, idx) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= s.num
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400'
                                        }`}
                                >
                                    {step > s.num ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <span className="font-semibold">{s.num}</span>
                                    )}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                                    {s.label}
                                </span>
                                {idx < 3 && (
                                    <div
                                        className={`w-8 md:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-blue-500" />
                                        Select Your Current College
                                    </CardTitle>
                                    <CardDescription>
                                        Choose the college where you're currently studying
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="relative mb-6">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                placeholder="Search for your college..."
                                                value={collegeSearch}
                                                onChange={(e) => setCollegeSearch(e.target.value)}
                                                className="pl-10 h-12 text-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                            {colleges
                                                .filter(c => c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
                                                    c.affiliation.toLowerCase().includes(collegeSearch.toLowerCase()))
                                                .map((college) => (
                                                    <div
                                                        key={college._id}
                                                        onClick={() => handleCollegeChange(college._id)}
                                                        className={`
                                                        relative rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden flex flex-col h-full
                                                        ${formData.selectedCollege === college._id
                                                                ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20'
                                                                : 'border-gray-100 dark:border-gray-800 hover:border-blue-300 hover:shadow-xl'
                                                            }
                                                    `}
                                                    >
                                                        {/* College Image Header */}
                                                        <div className="h-48 w-full relative overflow-hidden">
                                                            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 transition-opacity ${formData.selectedCollege === college._id ? 'opacity-80' : 'opacity-60 group-hover:opacity-40'}`} />
                                                            <img
                                                                src={COLLEGE_IMAGES[college.name] || college.imageUrl || getRandomImage(college._id)}
                                                                alt={college.name}
                                                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                                            />
                                                            {formData.selectedCollege === college._id && (
                                                                <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg animate-in zoom-in duration-300">
                                                                    <CheckCircle2 className="h-5 w-5 text-blue-600 fill-blue-50" />
                                                                </div>
                                                            )}
                                                            <div className="absolute bottom-3 left-3 z-20">
                                                                <div className={`
                                                                    h-10 w-10 rounded-xl flex items-center justify-center text-base font-bold shadow-lg backdrop-blur-md transition-all duration-300
                                                                    ${formData.selectedCollege === college._id
                                                                        ? 'bg-blue-600 text-white scale-110'
                                                                        : 'bg-white/90 text-gray-800'
                                                                    }
                                                                `}>
                                                                    {college.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Card Body */}
                                                        <div className={`p-4 flex-1 flex flex-col bg-white dark:bg-gray-800 transition-colors ${formData.selectedCollege === college._id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                            <h3 className={`font-bold text-base mb-2 leading-tight line-clamp-2 min-h-[2.5rem] ${formData.selectedCollege === college._id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                                                                }`}>
                                                                {college.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/50">
                                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                                <span className="truncate">{college.affiliation}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        {colleges.filter(c => c.name.toLowerCase().includes(collegeSearch.toLowerCase())).length === 0 && (
                                            <div className="text-center py-12 text-gray-500">
                                                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                                <p>No colleges found matching "{collegeSearch}"</p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Next button removed - auto navigation on card click */}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-blue-500" />
                                        Academic Details
                                    </CardTitle>
                                    <CardDescription>
                                        Tell us about your current program and progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="program">Current Degree *</Label>
                                        <Select
                                            value={formData.selectedProgram}
                                            onValueChange={(value: string) =>
                                                setFormData({ ...formData, selectedProgram: value })
                                            }
                                        >
                                            <SelectTrigger id="program" className="mt-2">
                                                <SelectValue placeholder="Select your program" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {programs.map((program, idx) => (
                                                    <SelectItem key={idx} value={program.name}>
                                                        {program.name} {program.duration && `(${program.duration})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="year">Current Year *</Label>
                                            <Select
                                                value={formData.currentYear}
                                                onValueChange={(value: string) =>
                                                    setFormData({ ...formData, currentYear: value })
                                                }
                                            >
                                                <SelectTrigger id="year" className="mt-2">
                                                    <SelectValue placeholder="Select year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Year 1</SelectItem>
                                                    <SelectItem value="2">Year 2</SelectItem>
                                                    <SelectItem value="3">Year 3</SelectItem>
                                                    <SelectItem value="4">Year 4</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="credits">Credits Completed *</Label>
                                            <Input
                                                id="credits"
                                                type="number"
                                                placeholder="e.g., 60"
                                                value={formData.creditsCompleted}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, creditsCompleted: e.target.value })
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button
                                            onClick={() => setStep(3)}
                                            disabled={!formData.selectedProgram || !formData.currentYear || !formData.creditsCompleted}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-blue-500" />
                                        Preferred Destinations
                                    </CardTitle>
                                    <CardDescription>
                                        Select countries you're interested in (optional)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {COUNTRIES.map((country) => (
                                            <button
                                                key={country.value}
                                                onClick={() => toggleCountry(country.value)}
                                                className={`p-4 rounded-lg border-2 transition-all text-left ${formData.preferredCountries.includes(country.value)
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{country.flag}</div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {country.value}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(2)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <div className="flex gap-2">
                                            {formData.preferredCountries.length === 1 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => navigate(`/scholarships?country=${formData.preferredCountries[0]}`)}
                                                    className="border-blue-200 hover:bg-blue-50 text-blue-600"
                                                >
                                                    <GraduationCap className="mr-2 h-4 w-4" />
                                                    View Scholarships
                                                </Button>
                                            )}
                                            <Button
                                                onClick={handleFindMatches}
                                                disabled={isLoading}
                                                className="bg-blue-500 hover:bg-blue-600"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Finding Matches...
                                                    </>
                                                ) : (
                                                    <>
                                                        Find Matches
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {matches.length} Matching {matches.length === 1 ? 'University' : 'Universities'}
                                </h2>
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(3)}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Modify Search
                                </Button>
                            </div>

                            {matches.length === 0 ? (
                                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                    <CardContent className="py-12 text-center">
                                        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            No Matches Found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            We couldn't find any universities matching your criteria. Try adjusting your preferences.
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <Button onClick={() => setStep(3)} variant="outline">
                                                Adjust Preferences
                                            </Button>
                                            {formData.preferredCountries.length > 0 && (
                                                <Button
                                                    onClick={() => navigate(`/scholarships?country=${formData.preferredCountries[0]}`)}
                                                    className="bg-blue-500 hover:bg-blue-600"
                                                >
                                                    View Scholarships in {formData.preferredCountries[0]}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {matches.map((match) => (
                                        <Card
                                            key={match.university._id}
                                            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow overflow-hidden"
                                        >
                                            <CardContent className="p-0">
                                                {/* University Image Header - Full Width */}
                                                <div className="h-48 w-full relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                                    {match.university.imageUrl ? (
                                                        <img
                                                            src={match.university.imageUrl}
                                                            alt={match.university.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                            <GraduationCap className="h-16 w-16 text-gray-300" />
                                                        </div>
                                                    )}

                                                    {/* Floating Stats on Image */}
                                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                                                            <div className="text-xl font-extrabold text-blue-600 leading-none">
                                                                {match.creditTransfer.matchScore}<span className="text-sm">%</span>
                                                            </div>
                                                            <div className="text-xs font-semibold text-gray-600 leading-tight">
                                                                Match
                                                            </div>
                                                        </div>
                                                        {match.university.isVerified && (
                                                            <div className="bg-blue-600/90 backdrop-blur-md px-2 py-1.5 rounded-lg shadow-lg flex items-center justify-center">
                                                                <CheckCircle2 className="h-5 w-5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Title Overlay */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                                        <h3 className="text-2xl font-bold text-white mb-1 shadow-sm">
                                                            {match.university.name}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                                                            <span className="flex items-center gap-1.5">
                                                                <MapPin className="h-4 w-4 text-blue-300" />
                                                                {match.university.city}, {match.university.country}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Building2 className="h-4 w-4 text-blue-300" />
                                                                {match.university.programName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* University Info */}
                                                <div className="flex-1">
                                                    {/* University Info Body */}
                                                    <div className="flex-1 p-4">
                                                        {/* Location & Details are preserved below, but the main header is removed */}

                                                        {/* Location & Details */}
                                                        <div className="flex flex-wrap gap-3 mb-4">
                                                            {match.university.tuitionRange && (
                                                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                                    <DollarSign className="h-4 w-4" />
                                                                    {match.university.tuitionRange.currency}{' '}
                                                                    {match.university.tuitionRange.min.toLocaleString()} -{' '}
                                                                    {match.university.tuitionRange.max.toLocaleString()}
                                                                </div>
                                                            )}
                                                            {match.creditTransfer.remainingSemesters && (
                                                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                                    <Calendar className="h-4 w-4" />
                                                                    {match.creditTransfer.remainingSemesters} semesters remaining
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Credit Transfer Summary */}
                                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
                                                            <div className="grid grid-cols-2 gap-3 text-center">
                                                                <div>
                                                                    <div className="text-2xl font-bold text-green-500">
                                                                        {match.creditTransfer.totalTransferable}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                        Credits Transferable
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                        {match.creditTransfer.remainingCredits}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                        Credits Remaining
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-bold text-green-600">
                                                                        {match.creditTransfer.acceptanceBreakdown.full}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                        Full Acceptance
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-bold text-yellow-600">
                                                                        {match.creditTransfer.acceptanceBreakdown.partial}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                        Partial Acceptance
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => viewCreditMapping(match.university._id)}
                                                                disabled={isLoading && viewingMappingFor === match.university._id}
                                                            >
                                                                {isLoading && viewingMappingFor === match.university._id ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                                )}
                                                                View Credit Breakdown
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleToggleSave(match.university._id)}
                                                            >
                                                                <Bookmark
                                                                    className={`mr-2 h-4 w-4 ${savedUniversities.includes(match.university._id)
                                                                        ? 'fill-current'
                                                                        : ''
                                                                        }`}
                                                                />
                                                                {savedUniversities.includes(match.university._id) ? 'Saved' : 'Save'}
                                                            </Button>
                                                            {match.university.website && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => window.open(match.university.website, '_blank')}
                                                                >
                                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                                    Visit Website
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {/* Credit Breakdown Modal */}
                                                        {viewingMappingFor === match.university._id && selectedCreditMapping && (
                                                            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                        Credit Mapping Details
                                                                    </h4>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setViewingMappingFor(null);
                                                                            setSelectedCreditMapping(null);
                                                                        }}
                                                                    >
                                                                        Close
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                                    {selectedCreditMapping.map((mapping: any, idx: number) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                                                                        >
                                                                            <div className="flex-1">
                                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                                    {mapping.localCourseId.courseName}
                                                                                </div>
                                                                                {mapping.equivalentCourseName && (
                                                                                    <div className="text-sm text-gray-500">
                                                                                        → {mapping.equivalentCourseName}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                                    {mapping.localCourseId.creditValue} credits
                                                                                </span>
                                                                                {getAcceptanceBadge(mapping.acceptanceStatus)}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </div >
    );
}
