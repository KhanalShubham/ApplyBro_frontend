import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  Award,
  CalendarDays,
  CheckCircle,
  ExternalLink,
  FileCheck,
  FileWarning,
  ListChecks,
  MapPin,
  Shield,
  Target,
  Upload,
  X,
  Compass,
  ChevronRight,
  Bell,
  Share2,
  Save,
  Info,
  Activity,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { cn } from "./ui/utils";

export interface ScholarshipDocument {
  type: string;
  status: "uploaded" | "missing" | "invalid";
  helper: string;
  sample?: string;
}

export interface ScholarshipIntake {
  id: string;
  title: string;
  period: string;
  open: string;
  close: string;
  decision: string;
  orientation: string;
  estimate: string;
}

export interface ScholarshipEligibilityRule {
  rule: string;
  status: "matched" | "partial" | "missing";
  gap?: string;
}

export interface ScholarshipConsultancy {
  id: string;
  name: string;
  city: string;
  phone: string;
  website?: string;
  rating: number;
  services: string[];
  hours: string;
}

export interface ScholarshipMapCity {
  city: string;
  coordinates: [number, number];
  courses: { name: string; college: string }[];
  consultancies: ScholarshipConsultancy[];
}

export interface ScholarshipDetail {
  id: number;
  title: string;
  college: string;
  country: string;
  flag: string;
  amount: string;
  deadline: string;
  verified: boolean;
  overview: {
    summary: string;
    duration: string;
    benefits: string[];
    officialLink: string;
    eligibilityScore: number;
    matches: { label: string; value: string; positive?: boolean }[];
  };
  eligibility: ScholarshipEligibilityRule[];
  documents: ScholarshipDocument[];
  intakes: ScholarshipIntake[];
  map: ScholarshipMapCity[];
  nextSteps: { title: string; description: string }[];
  recommendedActions: string[];
  externalApplyUrl: string;
}

interface ScholarshipApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: ScholarshipDetail | null;
}

const PHASES = ["Overview", "Eligibility", "Documents", "Intake & Timeline", "Local Support", "Submit"];

const LOGO_URL = "/mnt/data/bb93b293-695f-4e0a-acee-8d1c15e82b06.png";

export function ScholarshipApplicationModal({ open, onOpenChange, detail }: ScholarshipApplicationModalProps) {
  const [activePhase, setActivePhase] = useState(PHASES[0]);
  const [simulatedGpa, setSimulatedGpa] = useState(3.2);
  const [preferredCountry, setPreferredCountry] = useState("USA");
  const [documents, setDocuments] = useState<ScholarshipDocument[]>([]);
  const [documentUploadProgress, setDocumentUploadProgress] = useState<Record<string, number>>({});
  const [selectedIntake, setSelectedIntake] = useState<string | null>(null);
  const [reminderDays, setReminderDays] = useState("7");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Kathmandu");

  useEffect(() => {
    if (detail) {
      setDocuments(detail.documents);
      setSelectedIntake(detail.intakes[0]?.id ?? null);
      setSimulatedGpa(3.2);
      setPreferredCountry(detail.country);
      setWizardStep(0);
    }
  }, [detail, open]);

  const handleDocumentUpload = (type: string, file?: File) => {
    if (!file) return;
    setDocumentUploadProgress((prev) => ({ ...prev, [type]: 10 }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocumentUploadProgress((prev) => ({ ...prev, [type]: 100 }));
      setDocuments((prev) =>
        prev.map((doc) => (doc.type === type ? { ...doc, status: "uploaded" as const } : doc))
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const activeCity = useMemo(() => {
    if (!detail) return null;
    return detail.map.find((city) => city.city === selectedCity) ?? detail.map[0];
  }, [detail, selectedCity]);

  const dsInsights = useMemo(
    () =>
      detail
        ? [
            {
              label: "Predicted acceptance",
              value: "68%",
              description: "Based on ApplyBro cohorts with similar GPA & field",
            },
            {
              label: "Profile strength",
              value: "High",
              description: "Leadership & GPA align strongly with this program",
            },
            {
              label: "Timeline risk",
              value: "Low",
              description: "You still have 9+ weeks before final deadline",
            },
          ]
        : [],
    [detail]
  );

  const progressValue = useMemo(() => {
    if (!documents.length) return 0;
    const uploaded = documents.filter((doc) => doc.status === "uploaded").length;
    return Math.round((uploaded / documents.length) * 100);
  }, [documents]);

  const handleWizardSubmit = () => {
    console.log("apply_submit", {
      scholarshipId: detail?.id,
      intake: selectedIntake,
      docs: documents,
    });
    setWizardOpen(false);
  };

  const eligibilityScore = useMemo(() => {
    if (!detail) return 0;
    const total = detail.eligibility.length;
    const matched =
      detail.eligibility.filter((rule) => rule.status === "matched").length +
      (simulatedGpa >= 3.5 ? 1 : 0);
    return Math.min(100, Math.round((matched / (total + 1)) * 100));
  }, [detail, simulatedGpa]);

  if (!detail) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1300px] h-[92vh] p-0 overflow-hidden border-none shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0B4B9C] to-[#1A66C8] text-white">
          <div>
            <p className="text-sm text-white/70">
              Apply — {detail.college}, {detail.country}
            </p>
            <h2 className="text-2xl font-semibold">{detail.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => console.log("apply_click_share")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => console.log("apply_click_save")}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(92vh-64px)] overflow-hidden">
          <ScrollArea className="w-full lg:w-3/5 pr-3">
            <div className="space-y-6 pb-12">
              <Card className="shadow-xl border-none bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <ImageWithFallback
                      src={LOGO_URL}
                      alt="ApplyBro Logo"
                      className="h-16 w-16 rounded-2xl object-contain bg-white p-2 shadow border border-slate-100"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">{detail.college}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold text-slate-900">{detail.title}</h3>
                        {detail.verified && (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Deadline</p>
                      <p className="text-2xl font-semibold text-rose-600">{detail.deadline}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {dsInsights.map((insight) => (
                      <div key={insight.label} className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{insight.label}</p>
                        <p className="text-2xl font-semibold text-slate-900 mt-1">{insight.value}</p>
                        <p className="text-xs text-slate-500">{insight.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto">
                    {PHASES.map((phase, idx) => (
                      <button
                        key={phase}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full border transition-all",
                          activePhase === phase
                            ? "bg-[#0B4B9C] text-white border-[#0B4B9C]"
                            : "border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
                        )}
                        onClick={() => setActivePhase(phase)}
                      >
                        <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        {phase}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Accordion
                type="single"
                collapsible
                value={activePhase}
                onValueChange={(val) => val && setActivePhase(val)}
              >
              <AccordionItem value="Overview">
                <AccordionTrigger>Overview</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-slate-700">{detail.overview.summary}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-slate-500">Funding</p>
                        <p className="text-xl font-semibold text-blue-600">{detail.amount}</p>
                        <p className="text-sm text-slate-500 mt-1">Duration: {detail.overview.duration}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-slate-500">Eligibility match</p>
                        <div className="flex items-center gap-2">
                          <Progress value={detail.overview.eligibilityScore} className="flex-1" />
                          <span className="text-sm font-semibold text-blue-600">
                            {detail.overview.eligibilityScore}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {detail.overview.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detail.overview.matches.map((match) => (
                      <Badge
                        key={match.label}
                        className={cn(
                          "border text-xs",
                          match.positive ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-slate-200"
                        )}
                      >
                        {match.label}: {match.value}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button asChild variant="outline">
                      <a href={detail.overview.officialLink} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Official page
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => console.log("apply_click_save")}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="Eligibility">
                <AccordionTrigger>Eligibility</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600">Simulate GPA ({simulatedGpa.toFixed(1)})</label>
                    <Slider min={2.0} max={4.0} step={0.1} value={[simulatedGpa]} onValueChange={(val) => setSimulatedGpa(val[0])} />
                  </div>
                  <div className="grid gap-3">
                    {detail.eligibility.map((rule) => (
                      <div
                        key={rule.rule}
                        className="flex items-start justify-between rounded-lg border border-slate-200 p-3 text-sm"
                      >
                        <p className="pr-4 text-slate-700">{rule.rule}</p>
                        <Badge
                          className={cn(
                            "whitespace-nowrap",
                            rule.status === "matched" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                            rule.status === "partial" && "bg-amber-50 text-amber-700 border-amber-200",
                            rule.status === "missing" && "bg-rose-50 text-rose-700 border-rose-200"
                          )}
                        >
                          {rule.status === "matched" && "Matched"}
                          {rule.status === "partial" && `Partial ${rule.gap ? `(${rule.gap})` : ""}`}
                          {rule.status === "missing" && "Not matched"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-500">
                    Simulated eligibility: <span className="font-semibold text-blue-600">{eligibilityScore}%</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="Documents">
                <AccordionTrigger>Documents</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="text-sm text-slate-500">Upload or manage required documents</div>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <Card key={doc.type}>
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-800">{doc.type}</p>
                            <p className="text-sm text-slate-500">{doc.helper}</p>
                          </div>
                          <div className="flex flex-col gap-2 md:items-end">
                            <Badge
                              className={cn(
                                "w-fit",
                                doc.status === "uploaded" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                doc.status === "missing" && "bg-slate-100 text-slate-700",
                                doc.status === "invalid" && "bg-rose-50 text-rose-700 border-rose-200"
                              )}
                            >
                              {doc.status === "uploaded" && "Uploaded"}
                              {doc.status === "missing" && "Missing"}
                              {doc.status === "invalid" && "Needs Attention"}
                            </Badge>
                            <div className="flex gap-2">
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleDocumentUpload(doc.type, e.target.files?.[0])}
                                />
                                <Button variant="outline" size="sm">
                                  <Upload className="h-3 w-3 mr-1" /> Upload
                                </Button>
                              </label>
                              <Button variant="outline" size="sm">
                                <Info className="h-3 w-3 mr-1" />
                                Help
                              </Button>
                            </div>
                            {documentUploadProgress[doc.type] && documentUploadProgress[doc.type] < 100 && (
                              <Progress value={documentUploadProgress[doc.type]} className="w-32" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="Intake & Timeline">
                <AccordionTrigger>Intake & Timeline</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid gap-4">
                    {detail.intakes.map((intake) => (
                      <Card
                        key={intake.id}
                        className={cn(
                          "cursor-pointer border-2",
                          selectedIntake === intake.id ? "border-blue-500" : "border-transparent"
                        )}
                        onClick={() => setSelectedIntake(intake.id)}
                      >
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{intake.title}</p>
                            <Badge variant="outline">{intake.period}</Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-600">
                            <p>Opens: {intake.open}</p>
                            <p>Closes: {intake.close}</p>
                            <p>Decision: {intake.decision}</p>
                            <p>Orientation: {intake.orientation}</p>
                          </div>
                          <p className="text-xs text-slate-500">Prep time: {intake.estimate}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" onClick={() => console.log("reminder_set", selectedIntake, reminderDays)}>
                      <Bell className="h-4 w-4 mr-2" />
                      Reminder ({reminderDays} days)
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={reminderDays}
                      onChange={(e) => setReminderDays(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-slate-500">days before deadline</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="Local Support">
                <AccordionTrigger>Local Support & Map</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {detail.map.map((city) => (
                      <Button
                        key={city.city}
                        size="sm"
                        variant={selectedCity === city.city ? "default" : "outline"}
                        onClick={() => setSelectedCity(city.city)}
                      >
                        {city.city}
                      </Button>
                    ))}
                  </div>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100">
                        <ImageWithFallback
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Nepal_location_map.svg/1024px-Nepal_location_map.svg.png"
                          alt="Nepal map"
                          className="object-cover h-full w-full opacity-80"
                        />
                        {activeCity?.courses.map((course, idx) => (
                          <div
                            key={course.name}
                            className="absolute"
                            style={{ top: `${25 + idx * 20}%`, left: `${25 + (idx % 2) * 30}%` }}
                          >
                            <div className="bg-white/90 rounded-lg p-2 shadow ring-1 ring-black/5">
                              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-rose-500" />
                                {activeCity.city}
                              </p>
                              <p className="text-xs text-slate-600">
                                {course.name} • {course.college}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {activeCity?.consultancies.map((consultancy) => (
                          <div
                            key={consultancy.id}
                            className="flex flex-col md:flex-row md:items-center md:justify-between rounded-xl border border-slate-200 p-3"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">{consultancy.name}</p>
                              <p className="text-sm text-slate-500">
                                {consultancy.city} • Rating {consultancy.rating}/5
                              </p>
                              <p className="text-xs text-slate-500">
                                Services: {consultancy.services.join(", ")}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                              <Button variant="outline" size="sm" onClick={() => console.log("consultancy_contact", consultancy.id)}>
                                Contact
                              </Button>
                              {consultancy.website && (
                                <Button asChild variant="outline" size="sm">
                                  <a href={consultancy.website} target="_blank" rel="noreferrer">
                                    Website
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="Submit">
                <AccordionTrigger>Submit</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Ready to submit? Choose between the official site or our guided in-app application.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={detail.externalApplyUrl} target="_blank" rel="noreferrer">
                        External Apply <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => setWizardOpen(true)}>
                      Apply In-App
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          </ScrollArea>

          <ScrollArea className="w-full lg:w-2/5 pr-2">
            <aside className="space-y-4 pb-12">
              <Card className="shadow border-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">Checklist</p>
                    <span className="text-sm text-slate-500">{progressValue}% ready</span>
                  </div>
                  <Progress value={progressValue} />
                  <ul className="text-sm text-slate-600 space-y-2">
                    {documents.map((doc) => (
                      <li key={doc.type} className="flex items-center gap-2">
                        {doc.status === "uploaded" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : doc.status === "invalid" ? (
                          <FileWarning className="h-4 w-4 text-rose-500" />
                        ) : (
                          <FileCheck className="h-4 w-4 text-slate-400" />
                        )}
                        {doc.type}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <p className="font-semibold text-slate-800">Analytics Pulse</p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[#17A2B8]" />
                      Intake fit prediction: <span className="font-semibold text-slate-900">68%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                      Peer interest: <span className="font-semibold text-slate-900">124 students</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <p className="font-semibold text-slate-800">Recommended Next Steps</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {detail.recommendedActions.map((action) => (
                      <li key={action} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <p className="font-semibold text-slate-800">Need guidance?</p>
                  <p className="text-sm text-slate-600">
                    Chat with ApplyBro mentors and unlock templates for SOP, CV, and professor outreach.
                  </p>
                  <Button className="w-full" variant="outline">
                    <Compass className="h-4 w-4 mr-2" />
                    Talk to mentor
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </ScrollArea>
        </div>

        <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
          <DialogContent className="max-w-3xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Step {wizardStep + 1} of 5 — {detail.title}
              </p>
              <Button variant="ghost" size="icon" onClick={() => setWizardOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {wizardStep === 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Confirm Profile</h3>
                  <Input placeholder="Full Name" />
                  <Input placeholder="Email" />
                  <Textarea placeholder="Motivation summary" rows={3} />
                </div>
              )}
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Select Intake</h3>
                  <select
                    value={selectedIntake ?? ""}
                    onChange={(e) => setSelectedIntake(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    {detail.intakes.map((intake) => (
                      <option key={intake.id} value={intake.id}>
                        {intake.title} — closes {intake.close}
                      </option>
                    ))}
                  </select>
                  <Input type="date" />
                </div>
              )}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Attach Documents</h3>
                  {documents.map((doc) => (
                    <div key={doc.type} className="flex items-center justify-between border rounded-lg p-2 mb-2">
                      <span>{doc.type}</span>
                      <label className="text-sm text-blue-600 cursor-pointer">
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload(doc.type, e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {wizardStep === 3 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Short Questions</h3>
                  <Textarea placeholder="What impact will you create with this scholarship?" rows={4} />
                  <Textarea placeholder="How does this intake align with your plan?" rows={3} />
                </div>
              )}
              {wizardStep === 4 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Review & Consent</h3>
                  <p className="text-sm text-slate-600">
                    By submitting, you confirm the accuracy of provided information and consent to ApplyBro sharing your
                    data with partner institutions.
                  </p>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" className="h-4 w-4" /> I agree to the terms and understand the process.
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" disabled={wizardStep === 0} onClick={() => setWizardStep((step) => Math.max(0, step - 1))}>
                Back
              </Button>
              {wizardStep < 4 ? (
                <Button onClick={() => setWizardStep((step) => Math.min(4, step + 1))}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleWizardSubmit}>
                  Submit Application
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

