import { useState } from 'react';

import { Button } from '../ui/button';

import { Badge } from '../ui/badge';

import { Progress } from '../ui/progress';

import { Checkbox } from '../ui/checkbox';

import { 

  ArrowLeft, Check, AlertCircle, XCircle, Upload, Eye, Bookmark, 

  Share2, ExternalLink, MapPin, Phone, Calendar, FileText,

  GraduationCap, DollarSign, Clock, Award

} from 'lucide-react';

interface ScholarshipPageProps {

  onBack: () => void;

}

type Step = 'overview' | 'eligibility' | 'documents' | 'intake' | 'submit' | 'success';

interface Document {

  id: string;

  name: string;

  status: 'uploaded' | 'missing' | 'needs-review';

  helper?: string;

  fileSize?: string;

  fileFormat?: string;

  required?: boolean;

}

interface EligibilityItem {

  id: string;

  text: string;

  status: 'met' | 'uncertain' | 'not-met';

}

interface Intake {

  id: string;

  name: string;

  applyBy: string;

  decisionBy: string;

  startDate: string;

}

export function ScholarshipDetailPage({ onBack }: ScholarshipPageProps) {

  const [currentStep, setCurrentStep] = useState<Step>('overview');

  const [selectedIntake, setSelectedIntake] = useState<string>('fall-2026');

  const [confirmChecked, setConfirmChecked] = useState(false);

  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const steps = [

    { id: 'overview', label: 'Overview' },

    { id: 'eligibility', label: 'Eligibility' },

    { id: 'documents', label: 'Documents' },

    { id: 'intake', label: 'Intake & Timeline' },

    { id: 'submit', label: 'Submit' },

  ];

  const [documents, setDocuments] = useState<Document[]>([

    { 

      id: '1', 

      name: 'Academic Transcript', 

      status: 'uploaded',

      helper: 'Official transcript from your institution, signed and stamped by registrar',

      fileSize: 'Max 5MB',

      fileFormat: 'PDF, JPG, PNG',

      required: true

    },

    { 

      id: '2', 

      name: 'Degree Certificate', 

      status: 'uploaded',

      helper: 'Scanned copy of your completed degree certificate',

      fileSize: 'Max 5MB',

      fileFormat: 'PDF, JPG, PNG',

      required: true

    },

    { 

      id: '3', 

      name: 'Passport Copy', 

      status: 'missing',

      helper: 'Clear scan of passport bio page. Must be valid for at least 6 months',

      fileSize: 'Max 3MB',

      fileFormat: 'PDF, JPG, PNG',

      required: true

    },

    { 

      id: '4', 

      name: 'CV / Resume', 

      status: 'needs-review',

      helper: 'Updated resume highlighting academic achievements, work experience, and skills',

      fileSize: 'Max 2MB',

      fileFormat: 'PDF, DOC, DOCX',

      required: true

    },

    { 

      id: '5', 

      name: 'Statement of Purpose (SOP)', 

      status: 'missing',

      helper: 'Personal statement explaining your motivation, goals, and why you deserve this scholarship. Max 1000 words',

      fileSize: 'Max 2MB',

      fileFormat: 'PDF, DOC, DOCX',

      required: true

    },

    { 

      id: '6', 

      name: 'Recommendation Letters', 

      status: 'missing',

      helper: 'At least two recommendation letters from professors or employers. Each letter should be on official letterhead',

      fileSize: 'Max 2MB per letter',

      fileFormat: 'PDF',

      required: true

    },

    { 

      id: '7', 

      name: 'English Language Test Results', 

      status: 'missing',

      helper: 'IELTS, TOEFL, or equivalent test scores. Minimum IELTS 7.0 or TOEFL 90',

      fileSize: 'Max 2MB',

      fileFormat: 'PDF, JPG, PNG',

      required: true

    },

    { 

      id: '8', 

      name: 'Financial Statement', 

      status: 'missing',

      helper: 'Bank statement or financial affidavit showing ability to cover living expenses (if required)',

      fileSize: 'Max 3MB',

      fileFormat: 'PDF',

      required: false

    },

  ]);

  const eligibilityItems: EligibilityItem[] = [

    { id: '1', text: 'Minimum GPA 3.0', status: 'met' },

    { id: '2', text: 'IELTS 7.0 or above', status: 'uncertain' },

    { id: '3', text: 'Only for STEM majors', status: 'met' },

    { id: '4', text: 'Age between 17-26', status: 'met' },

  ];

  const intakes: Intake[] = [

    { id: 'spring-2026', name: 'Spring 2026', applyBy: '15 Jan 2026', decisionBy: '28 Feb 2026', startDate: '1 Apr 2026' },

    { id: 'fall-2026', name: 'Fall 2026', applyBy: '31 Aug 2026', decisionBy: '15 Oct 2026', startDate: '1 Nov 2026' },

  ];

  const nepalCities = [

    { 

      id: 'kathmandu', 

      name: 'Kathmandu', 

      x: '50%', 

      y: '35%',

      consultancies: [

        { name: 'Global Education Consultancy', field: 'Engineering & IT' },

        { name: 'Study Abroad Nepal', field: 'All Fields' },

        { name: 'Tokyo Education Partners', field: 'Japan Specialists' },

      ]

    },

    { 

      id: 'pokhara', 

      name: 'Pokhara', 

      x: '30%', 

      y: '40%',

      consultancies: [

        { name: 'Pokhara Study Hub', field: 'Engineering' },

        { name: 'Mountain Education', field: 'All Fields' },

      ]

    },

    { 

      id: 'biratnagar', 

      name: 'Biratnagar', 

      x: '75%', 

      y: '30%',

      consultancies: [

        { name: 'Eastern Education Center', field: 'STEM Programs' },

      ]

    },

  ];

  const getCurrentStepIndex = () => {

    if (currentStep === 'success') return steps.length;

    return steps.findIndex(s => s.id === currentStep);

  };

  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const allDocumentsReady = documents.every(doc => doc.status === 'uploaded');

  const handleDrag = (e: React.DragEvent) => {

    e.preventDefault();

    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {

      setDragActive(true);

    } else if (e.type === "dragleave") {

      setDragActive(false);

    }

  };

  const handleDrop = (e: React.DragEvent) => {

    e.preventDefault();

    e.stopPropagation();

    setDragActive(false);

    // Handle file upload logic here

  };

  const handleSubmit = () => {

    setCurrentStep('success');

  };

  const renderStepContent = () => {

    switch (currentStep) {

      case 'overview':

        return (

          <div className="space-y-8 max-w-6xl">

            <div>

              <h3 className="text-[#0F172A] mb-4 text-2xl">About this Scholarship</h3>

              <p className="text-gray-600 text-lg leading-relaxed">

                The Full Ride Engineering Scholarship at Tokyo University is a prestigious program designed to support 

                exceptional international students pursuing their Bachelor's degree in Engineering. This scholarship covers 

                full tuition fees, provides a monthly living stipend, and includes health insurance coverage.

              </p>

            </div>

            <div>

              <h4 className="text-[#0F172A] mb-5 text-xl">Key Details</h4>

              <div className="grid grid-cols-2 gap-6">

                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                      <DollarSign className="w-6 h-6 text-[#0B4B9C]" />

                    </div>

                    <span className="text-gray-600">Funding</span>

                  </div>

                  <p className="text-[#0F172A] text-xl">Full tuition + stipend</p>

                </div>

                <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border border-teal-200 hover:shadow-lg transition-shadow">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                      <GraduationCap className="w-6 h-6 text-[#17A2B8]" />

                    </div>

                    <span className="text-gray-600">Level</span>

                  </div>

                  <p className="text-[#0F172A] text-xl">Bachelor</p>

                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-lg transition-shadow">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                      <Award className="w-6 h-6 text-[#F59E0B]" />

                    </div>

                    <span className="text-gray-600">Field</span>

                  </div>

                  <p className="text-[#0F172A] text-xl">Computer Science</p>

                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-shadow">

                  <div className="flex items-center gap-3 mb-3">

                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                      <Clock className="w-6 h-6 text-purple-600" />

                    </div>

                    <span className="text-gray-600">Duration</span>

                  </div>

                  <p className="text-[#0F172A] text-xl">4 years</p>

                </div>

              </div>

            </div>

            <div className="flex gap-4 pt-4">

              <Button 

                onClick={() => setCurrentStep('eligibility')}

                className="flex-1 bg-[#0B4B9C] hover:bg-[#083a7a] text-white h-14 text-lg"

              >

                Continue to Eligibility

              </Button>

              <Button 

                variant="outline"

                className="flex-1 border-[#0B4B9C] text-[#0B4B9C] hover:bg-blue-50 h-14 text-lg"

              >

                <ExternalLink className="w-5 h-5 mr-2" />

                View Official Page

              </Button>

            </div>

          </div>

        );

      case 'eligibility':

        return (

          <div className="space-y-8 max-w-6xl">

            <div>

              <h3 className="text-[#0F172A] mb-4 text-2xl">Check if you are eligible</h3>

              <p className="text-gray-600 text-lg mb-6">

                This is auto-checked from your profile and documents. You can update your profile later.

              </p>

            </div>

            <div className="space-y-4">

              {eligibilityItems.map((item) => (

                <div 

                  key={item.id}

                  className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all hover:shadow-md ${

                    item.status === 'met' 

                      ? 'bg-green-50 border-green-200' 

                      : item.status === 'uncertain'

                      ? 'bg-yellow-50 border-yellow-200'

                      : 'bg-red-50 border-red-200'

                  }`}

                >

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${

                    item.status === 'met' 

                      ? 'bg-green-100' 

                      : item.status === 'uncertain'

                      ? 'bg-yellow-100'

                      : 'bg-red-100'

                  }`}>

                    {item.status === 'met' && (

                      <Check className="w-6 h-6 text-green-600" />

                    )}

                    {item.status === 'uncertain' && (

                      <AlertCircle className="w-6 h-6 text-yellow-600" />

                    )}

                    {item.status === 'not-met' && (

                      <XCircle className="w-6 h-6 text-red-600" />

                    )}

                  </div>

                  <span className={`text-lg ${

                    item.status === 'met' 

                      ? 'text-green-800' 

                      : item.status === 'uncertain'

                      ? 'text-yellow-800'

                      : 'text-red-800'

                  }`}>

                    {item.text}

                  </span>

                </div>

              ))}

            </div>

            <div className="flex gap-4 pt-4">

              <Button 

                onClick={() => setCurrentStep('documents')}

                className="flex-1 bg-[#0B4B9C] hover:bg-[#083a7a] text-white h-14 text-lg"

              >

                Continue to Documents

              </Button>

              <Button 

                variant="outline"

                className="flex-1 border-gray-300 hover:bg-gray-50 h-14 text-lg"

              >

                Update Profile

              </Button>

            </div>

          </div>

        );

      case 'documents':

        return (

          <div className="space-y-8 max-w-6xl">

            <div>

              <h3 className="text-[#0F172A] mb-2 text-2xl">Upload or confirm required documents</h3>

              <p className="text-gray-600 text-sm">

                Please upload all required documents. You can continue even if some optional documents are missing.

              </p>

            </div>

            <div className="space-y-4">

              {documents.map((doc) => (

                <div 

                  key={doc.id}

                  className="p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#0B4B9C] hover:shadow-md transition-all"

                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4 flex-1">

                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">

                        <FileText className="w-6 h-6 text-gray-600" />

                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-3 mb-2">

                          <p className="text-[#0F172A] text-lg font-semibold">{doc.name}</p>

                          {doc.required && (

                            <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">

                              Required

                            </Badge>

                          )}

                          {!doc.required && (

                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">

                              Optional

                            </Badge>

                          )}

                          <Badge 

                            variant={

                              doc.status === 'uploaded' 

                                ? 'default' 

                                : doc.status === 'needs-review'

                                ? 'outline'

                                : 'destructive'

                            }

                            className={`${

                              doc.status === 'uploaded'

                                ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-300'

                                : doc.status === 'needs-review'

                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'

                                : 'bg-red-100 text-red-700 border-red-300'

                            }`}

                          >

                            {doc.status === 'uploaded' ? 'Uploaded' : doc.status === 'needs-review' ? 'Needs Review' : 'Missing'}

                          </Badge>

                        </div>

                        {doc.helper && (

                          <p className="text-gray-600 text-sm mb-3">{doc.helper}</p>

                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">

                          {doc.fileFormat && (

                            <span className="flex items-center gap-1">

                              <FileText className="w-3 h-3" />

                              {doc.fileFormat}

                            </span>

                          )}

                          {doc.fileSize && (

                            <span className="flex items-center gap-1">

                              <span>📦</span>

                              {doc.fileSize}

                            </span>

                          )}

                        </div>

                      </div>

                    </div>

                    <div className="flex gap-3 flex-shrink-0">

                      {doc.status === 'uploaded' ? (

                        <>

                          <Button size="default" variant="outline" className="border-gray-300">

                            <Eye className="w-4 h-4 mr-2" />

                            Preview

                          </Button>

                          <Button size="default" variant="outline" className="border-gray-300">

                            Replace

                          </Button>

                        </>

                      ) : (

                        <Button size="default" className="bg-[#0B4B9C] hover:bg-[#083a7a]">

                          <Upload className="w-4 h-4 mr-2" />

                          Upload

                        </Button>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <div 

              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${

                dragActive ? 'border-[#0B4B9C] bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'

              }`}

              onDragEnter={handleDrag}

              onDragLeave={handleDrag}

              onDragOver={handleDrag}

              onDrop={handleDrop}

              onClick={() => {

                // Trigger file input click

                const input = document.createElement('input');

                input.type = 'file';

                input.multiple = true;

                input.click();

              }}

            >

              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />

              <p className="text-[#0F172A] text-lg mb-2 font-semibold">Drag and drop files here</p>

              <p className="text-gray-600 text-sm">or click to browse and select files</p>

              <p className="text-gray-500 text-xs mt-2">Supports PDF, JPG, PNG, DOC, DOCX formats</p>

            </div>

            {/* Continue Button - Always Visible */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200 bg-white rounded-lg shadow-md">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="text-sm text-gray-600">

                  <span className="font-semibold text-[#0B4B9C]">{documents.filter(d => d.status === 'uploaded').length}</span> of{' '}

                  <span className="font-semibold">{documents.filter(d => d.required).length}</span> required documents uploaded

                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">

                  <Button 

                    variant="outline"

                    onClick={() => setCurrentStep('eligibility')}

                    className="border-gray-300 flex-1 sm:flex-none h-12"

                  >

                    ← Back

                  </Button>

                  <Button 

                    onClick={() => setCurrentStep('intake')}

                    className="bg-[#0B4B9C] hover:bg-[#083a7a] text-white h-12 text-lg px-8 flex-1 sm:flex-none shadow-md"

                  >

                    Continue to Intake Selection →

                  </Button>

                </div>

              </div>

            </div>

          </div>

        );

      case 'intake':

        return (

          <div className="space-y-8 max-w-6xl">

            <div>

              <h3 className="text-[#0F172A] mb-4 text-2xl">Choose your intake</h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {intakes.map((intake) => (

                <div

                  key={intake.id}

                  onClick={() => setSelectedIntake(intake.id)}

                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${

                    selectedIntake === intake.id

                      ? 'border-[#0B4B9C] bg-blue-50 shadow-lg scale-105'

                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'

                  }`}

                >

                  <div className="flex items-center justify-between mb-4">

                    <h4 className="text-[#0F172A] text-xl">{intake.name}</h4>

                    {selectedIntake === intake.id && (

                      <div className="w-8 h-8 rounded-full bg-[#0B4B9C] flex items-center justify-center">

                        <Check className="w-5 h-5 text-white" />

                      </div>

                    )}

                  </div>

                  <div className="space-y-3">

                    <div className="flex items-center gap-3 text-gray-600">

                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">

                        <Calendar className="w-4 h-4 text-[#F59E0B]" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">Apply by</p>

                        <p className="text-[#0F172A]">{intake.applyBy}</p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">

                        <Clock className="w-4 h-4 text-[#17A2B8]" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">Decision by</p>

                        <p className="text-[#0F172A]">{intake.decisionBy}</p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">

                        <GraduationCap className="w-4 h-4 text-[#0B4B9C]" />

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">Starts</p>

                        <p className="text-[#0F172A]">{intake.startDate}</p>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <div className="p-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-200">

              <h4 className="text-[#0F172A] mb-6 text-xl">Application Timeline</h4>

              <div className="relative py-4">

                <div className="absolute top-9 left-0 right-0 h-1 bg-gradient-to-r from-[#0B4B9C] via-[#17A2B8] to-[#F59E0B] rounded-full"></div>

                <div className="grid grid-cols-4 gap-2 relative">

                  {['Apply', 'Decision', 'Visa', 'Arrival'].map((phase, idx) => (

                    <div key={phase} className="text-center">

                      <div className="w-14 h-14 rounded-full bg-white border-4 border-[#0B4B9C] flex items-center justify-center mx-auto mb-3 shadow-md">

                        <span className="text-[#0B4B9C] text-lg">{idx + 1}</span>

                      </div>

                      <p className="text-gray-600">{phase}</p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            <Button 

              onClick={() => setCurrentStep('submit')}

              className="w-full bg-[#0B4B9C] hover:bg-[#083a7a] text-white h-14 text-lg"

            >

              Continue to Review & Apply →

            </Button>

          </div>

        );

      case 'submit':

        const uploadedDocs = documents.filter(d => d.status === 'uploaded');

        const missingRequiredDocs = documents.filter(d => d.required && d.status === 'missing');

        return (

          <div className="space-y-8 max-w-6xl pb-8">

            <div>

              <h3 className="text-[#0F172A] mb-2 text-2xl">Review Your Application</h3>

              <p className="text-gray-600 text-sm">

                Review all details before applying on the official college website.

              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Selected Intake Card */}

              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">

                <div className="flex items-center gap-3 mb-4">

                  <Calendar className="w-6 h-6 text-[#0B4B9C]" />

                  <h4 className="text-[#0F172A] text-lg font-semibold">Selected Intake</h4>

                </div>

                <p className="text-2xl font-bold text-[#0B4B9C] mb-2">

                  {intakes.find(i => i.id === selectedIntake)?.name}

                </p>

                <p className="text-gray-600 text-sm">

                  Application Deadline: {intakes.find(i => i.id === selectedIntake)?.applyBy}

                </p>

              </div>

              {/* Eligibility Status Card */}

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">

                <div className="flex items-center gap-3 mb-4">

                  <Award className="w-6 h-6 text-green-600" />

                  <h4 className="text-[#0F172A] text-lg font-semibold">Eligibility Status</h4>

                </div>

                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-2 text-lg mb-2">

                  85% Match

                </Badge>

                <p className="text-gray-600 text-sm">

                  {eligibilityItems.filter(e => e.status === 'met').length} of {eligibilityItems.length} criteria met

                </p>

              </div>

            </div>

            {/* Required Documents Summary */}

            <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">

              <div className="flex items-center justify-between mb-6">

                <h4 className="text-[#0F172A] text-xl font-semibold">All Documents Summary</h4>

                <Badge className={missingRequiredDocs.length === 0 

                  ? "bg-green-100 text-green-700 border-green-300" 

                  : "bg-orange-100 text-orange-700 border-orange-300"

                }>

                  {uploadedDocs.length} of {documents.length} documents uploaded

                </Badge>

              </div>

              <div className="space-y-3">

                {documents.map((doc) => (

                  <div 

                    key={doc.id}

                    className={`flex items-center justify-between p-4 rounded-xl border-2 ${

                      doc.status === 'uploaded' 

                        ? 'bg-green-50 border-green-200' 

                        : doc.status === 'needs-review'

                        ? 'bg-yellow-50 border-yellow-200'

                        : 'bg-red-50 border-red-200'

                    }`}

                  >

                    <div className="flex items-center gap-3">

                      {doc.status === 'uploaded' ? (

                        <Check className="w-5 h-5 text-green-600" />

                      ) : doc.status === 'needs-review' ? (

                        <AlertCircle className="w-5 h-5 text-yellow-600" />

                      ) : (

                        <XCircle className="w-5 h-5 text-red-600" />

                      )}

                      <span className={`font-medium ${

                        doc.status === 'uploaded' 

                          ? 'text-green-800' 

                          : doc.status === 'needs-review'

                          ? 'text-yellow-800'

                          : 'text-red-800'

                      }`}>

                        {doc.name}

                      </span>

                    </div>

                    <Badge 

                      variant={doc.status === 'uploaded' ? 'default' : 'destructive'}

                      className={doc.status === 'uploaded' 

                        ? 'bg-green-100 text-green-700 border-green-300' 

                        : 'bg-red-100 text-red-700 border-red-300'

                      }

                    >

                      {doc.status === 'uploaded' ? 'Ready' : doc.status === 'needs-review' ? 'Review Needed' : 'Missing'}

                    </Badge>

                  </div>

                ))}

              </div>

              {missingRequiredDocs.length > 0 && (

                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">

                  <p className="text-orange-800 text-sm">

                    ⚠️ You have {missingRequiredDocs.length} required document{missingRequiredDocs.length > 1 ? 's' : ''} missing. 

                    Please upload {missingRequiredDocs.length > 1 ? 'them' : 'it'} before applying on the official website.

                  </p>

                </div>

              )}

            </div>

            {/* Important Note */}

            <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">

              <div className="flex items-start gap-3">

                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />

                <div>

                  <h4 className="text-[#0B4B9C] font-semibold mb-2">Important Information</h4>

                  <p className="text-gray-700 text-sm leading-relaxed mb-3">

                    ApplyBro does not submit your application or documents to the college. You need to apply directly on the official college website using the link below. Make sure to upload all required documents on their portal.

                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed">

                    This application wizard helps you prepare your documents and understand the requirements. Use it as a checklist before applying on the official website.

                  </p>

                </div>

              </div>

            </div>

            {/* Action Buttons */}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <Button 

                variant="outline"

                onClick={() => setCurrentStep('intake')}

                className="border-gray-300 h-14 text-lg"

              >

                ← Back to Intake Selection

              </Button>

              <Button 

                onClick={() => window.open('https://www.u-tokyo.ac.jp/en/admissions/', '_blank')}

                className="flex-1 bg-[#0B4B9C] hover:bg-[#083a7a] text-white h-14 text-lg shadow-lg"

              >

                <ExternalLink className="w-5 h-5 mr-2" />

                Apply on Tokyo University Official Website

              </Button>

            </div>

          </div>

        );

      case 'success':

        return (

          <div className="text-center py-16 space-y-8 max-w-2xl mx-auto">

            <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center mx-auto">

              <Check className="w-12 h-12 text-green-600" />

            </div>

            <div>

              <h3 className="text-[#0F172A] mb-3 text-3xl">Ready to Apply!</h3>

              <p className="text-gray-600 text-lg mb-4">

                You've completed the application preparation. All your information is ready.

              </p>

              <p className="text-gray-600 text-sm">

                Remember to apply on the official Tokyo University website using the link provided in the previous step.

              </p>

            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl border border-blue-200">

              <p className="text-gray-600 mb-3">Next Steps</p>

              <ul className="text-left text-gray-700 space-y-2 mb-4">

                <li className="flex items-start gap-2">

                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                  <span>Review all documents one more time</span>

                </li>

                <li className="flex items-start gap-2">

                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                  <span>Visit the official Tokyo University application portal</span>

                </li>

                <li className="flex items-start gap-2">

                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                  <span>Upload your documents on their website</span>

                </li>

                <li className="flex items-start gap-2">

                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                  <span>Complete the application form and submit</span>

                </li>

              </ul>

            </div>

            <div className="flex gap-4">

              <Button 

                variant="outline"

                onClick={() => setCurrentStep('submit')}

                className="flex-1 border-gray-300 h-14 text-lg"

              >

                ← Back to Review

              </Button>

              <Button 

                onClick={() => window.open('https://www.u-tokyo.ac.jp/en/admissions/', '_blank')}

                className="flex-1 bg-[#0B4B9C] hover:bg-[#083a7a] text-white h-14 text-lg"

              >

                <ExternalLink className="w-5 h-5 mr-2" />

                Go to Official Website

              </Button>

            </div>

            <Button 

              onClick={onBack}

              variant="ghost"

              className="w-full text-gray-600 hover:text-gray-900"

            >

              Return to Scholarships

            </Button>

          </div>

        );

      default:

        return null;

    }

  };

  return (

    <div className="min-h-screen bg-white fixed inset-0 z-50 overflow-y-auto">

      {/* Header */}

      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

        <div className="max-w-[1800px] mx-auto px-8 py-6">

          <div className="flex items-start justify-between mb-6">

            <div className="flex items-start gap-4">

              <Button 

                size="default" 

                variant="ghost" 

                onClick={onBack}

                className="hover:bg-gray-100 mt-1"

              >

                <ArrowLeft className="w-6 h-6" />

              </Button>

              <div className="flex-1">

                <div className="flex items-center gap-3 mb-3">

                  <h2 className="text-[#0F172A] text-3xl">Full Ride Engineering Scholarship – Tokyo University</h2>

                </div>

                <div className="flex items-center gap-4 flex-wrap">

                  <div className="flex items-center gap-2">

                    <span className="text-2xl">🇯🇵</span>

                    <span className="text-gray-600">Japan</span>

                  </div>

                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1.5">

                    <Check className="w-4 h-4 mr-1" />

                    Verified

                  </Badge>

                  <Badge variant="outline" className="bg-[#F59E0B] bg-opacity-10 text-[#F59E0B] border-[#F59E0B] px-3 py-1.5">

                    Deadline: 31 Aug 2026

                  </Badge>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <Button size="default" variant="ghost" className="hover:bg-gray-100">

                <Bookmark className="w-5 h-5" />

              </Button>

              <Button size="default" variant="ghost" className="hover:bg-gray-100">

                <Share2 className="w-5 h-5" />

              </Button>

            </div>

          </div>

          {/* Stepper */}

          {currentStep !== 'success' && (

            <div className="flex items-center gap-3 overflow-x-auto pb-2">

              {steps.map((step, index) => (

                <div key={step.id} className="flex items-center">

                  <div

                    className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${

                      steps.findIndex(s => s.id === currentStep) >= index

                        ? 'bg-[#0B4B9C] text-white'

                        : 'bg-gray-200 text-gray-600'

                    }`}

                  >

                    {step.label}

                  </div>

                  {index < steps.length - 1 && (

                    <div className={`w-12 h-1 mx-2 ${

                      steps.findIndex(s => s.id === currentStep) > index

                        ? 'bg-[#0B4B9C]'

                        : 'bg-gray-300'

                    }`} />

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* Main Content */}

      <div className="max-w-[1800px] mx-auto">

        <div className="flex">

          {/* Left Content Area */}

          <div className="flex-1 p-12 relative" style={{ minHeight: 'calc(100vh - 200px)' }}>

            {renderStepContent()}

          </div>

          {/* Right Sidebar */}

          {currentStep !== 'success' && (

            <div className="w-[480px] border-l border-gray-200 bg-gray-50 p-8 space-y-6 min-h-screen">

              {/* Progress Card */}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

                <h4 className="text-[#0F172A] mb-5 text-xl">Your Progress</h4>

                <Progress value={progress} className="mb-5 h-3" />

                <p className="text-gray-600 mb-6">{Math.round(progress)}% Complete</p>

                <div className="space-y-4">

                  {[

                    { label: 'Overview Reviewed', done: getCurrentStepIndex() >= 0 },

                    { label: 'Eligibility Checked', done: getCurrentStepIndex() >= 1 },

                    { label: 'Documents Prepared', done: getCurrentStepIndex() >= 2 },

                    { label: 'Intake Selected', done: getCurrentStepIndex() >= 3 },

                    { label: 'Ready to Apply', done: getCurrentStepIndex() >= 4 },

                  ].map((item, idx) => (

                    <div key={idx} className="flex items-center gap-3">

                      {item.done ? (

                        <Check className="w-5 h-5 text-green-600" />

                      ) : (

                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />

                      )}

                      <span className={`${item.done ? 'text-[#0F172A]' : 'text-gray-400'}`}>

                        {item.label}

                      </span>

                    </div>

                  ))}

                </div>

              </div>

              {/* Map Card */}

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

                <h4 className="text-[#0F172A] mb-5 text-xl">Local Support in Nepal</h4>

                <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 mb-5" style={{ height: '220px' }}>

                  {/* Simple Nepal Map Shape */}

                  <svg viewBox="0 0 200 120" className="w-full h-full opacity-20 absolute inset-0">

                    <path

                      d="M 10,60 L 30,40 L 50,35 L 70,30 L 90,35 L 110,40 L 130,45 L 150,50 L 170,55 L 185,65 L 180,80 L 170,85 L 150,88 L 130,85 L 110,82 L 90,78 L 70,75 L 50,72 L 30,70 Z"

                      fill="currentColor"

                      className="text-green-600"

                    />

                  </svg>

                  

                  {/* City Markers */}

                  {nepalCities.map((city) => (

                    <div

                      key={city.id}

                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"

                      style={{ left: city.x, top: city.y }}

                      onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}

                    >

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${

                        selectedCity === city.id

                          ? 'bg-[#0B4B9C] scale-125'

                          : 'bg-white border-2 border-[#0B4B9C] group-hover:scale-110'

                      }`}>

                        <MapPin className={`w-5 h-5 ${

                          selectedCity === city.id ? 'text-white' : 'text-[#0B4B9C]'

                        }`} />

                      </div>

                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">

                        <span className="text-sm bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">

                          {city.name}

                        </span>

                      </div>

                    </div>

                  ))}

                </div>

                {selectedCity && (

                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">

                    <p className="text-[#0B4B9C] mb-3">

                      {nepalCities.find(c => c.id === selectedCity)?.name}

                    </p>

                    {nepalCities.find(c => c.id === selectedCity)?.consultancies.map((cons, idx) => (

                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">

                        <p className="text-[#0F172A] mb-1">{cons.name}</p>

                        <p className="text-sm text-gray-600 mb-3">Specialized in: {cons.field}</p>

                        <Button size="sm" variant="outline" className="w-full border-[#17A2B8] text-[#17A2B8] hover:bg-teal-50">

                          <Phone className="w-4 h-4 mr-2" />

                          Contact

                        </Button>

                      </div>

                    ))}

                  </div>

                )}

              </div>

              {/* Help Card */}

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">

                <h4 className="text-[#0F172A] mb-3 text-xl">Help & Tips</h4>

                <p className="text-gray-600 mb-5">Not sure how to proceed?</p>

                <div className="space-y-3">

                  <button className="w-full text-left text-[#0B4B9C] hover:underline">

                    • How to write a strong SOP

                  </button>

                  <button className="w-full text-left text-[#0B4B9C] hover:underline">

                    • Visa interview tips for Japan

                  </button>

                  <button className="w-full text-left text-[#0B4B9C] hover:underline">

                    • Document preparation guide

                  </button>

                </div>

                <Button 

                  size="default" 

                  className="w-full mt-5 bg-[#F59E0B] hover:bg-[#d97706] text-white"

                >

                  Need Help?

                </Button>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}