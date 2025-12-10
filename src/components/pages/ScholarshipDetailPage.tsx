
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowLeft, Check, ExternalLink, MapPin,
  GraduationCap, DollarSign, Clock, Award
} from 'lucide-react';
import { Scholarship } from '@/types/scholarship';

interface ScholarshipPageProps {
  scholarship: Scholarship;
  onBack: () => void;
}

export function ScholarshipDetailPage({ scholarship, onBack }: ScholarshipPageProps) {
  console.log("Scholarship Detail Data:", scholarship);
  // Use requirements from the scholarship object, falling back to empty list if undefined
  const requirements = scholarship.requirements || [];

  // Calculate display values
  const daysLeft = scholarship.deadline ? Math.ceil((new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleApply = () => {
    if (scholarship.university?.website) {
      window.open(scholarship.university.website, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Image */}
      <div className="h-64 md:h-80 w-full relative bg-slate-900">
        {scholarship.imageUrl && scholarship.imageUrl.trim() !== '' && (
          <img
            src={scholarship.imageUrl}
            alt={scholarship.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", scholarship.imageUrl);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 text-white hover:bg-white/20 hover:text-white"
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="absolute bottom-8 left-6 md:left-12">
          <Badge className="bg-blue-600 hover:bg-blue-700 mb-2 border-none text-white">
            {scholarship.status === 'open' ? 'Accepting Applications' : scholarship.status}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-black">{scholarship.title}</h1>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">{scholarship.university?.name}</span>
            <span>•</span>
            <span>{scholarship.country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-4">About the Scholarship</h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {scholarship.description || "No description provided."}
              </p>
            </section>

            {/* Key Details Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-2 text-blue-800 font-medium">
                  <GraduationCap className="w-5 h-5" />
                  Level
                </div>
                <div className="text-xl font-bold text-[#0F172A]">{scholarship.level || scholarship.degree}</div>
              </div>
              <div className="p-5 bg-teal-50 rounded-xl border border-teal-100">
                <div className="flex items-center gap-3 mb-2 text-teal-800 font-medium">
                  <DollarSign className="w-5 h-5" />
                  Amount
                </div>
                <div className="text-xl font-bold text-[#0F172A]">{scholarship.amount || "Not specified"}</div>
              </div>
              <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2 text-purple-800 font-medium">
                  <Clock className="w-5 h-5" />
                  Deadline
                </div>
                <div className="text-xl font-bold text-[#0F172A]">
                  {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "No Deadline"}
                </div>
              </div>
              <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-2 text-orange-800 font-medium">
                  <Award className="w-5 h-5" />
                  Status
                </div>
                <div className="text-xl font-bold text-[#0F172A] capitalize">{scholarship.status}</div>
              </div>
            </section>

            {/* Requirements / Eligibility */}
            {requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Eligibility Requirements</h2>
                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 mt-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700 text-lg">{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-6">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Application Deadline</p>
                <div className="text-2xl font-bold text-[#0F172A] mb-1">
                  {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "TBA"}
                </div>
                {daysLeft > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    {daysLeft} days left
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                  onClick={handleApply}
                  disabled={!scholarship.university?.website}
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg"
                  onClick={handleApply}
                  disabled={!scholarship.university?.website}
                >
                  Visit Website
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-semibold mb-3 text-sm text-gray-900">University Details</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{scholarship.university?.name}</div>
                      <div>{scholarship.university?.location?.address}</div>
                      <div>{scholarship.university?.location?.city}, {scholarship.university?.location?.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}