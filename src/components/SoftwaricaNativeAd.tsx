import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Globe, GraduationCap, ArrowRight, Lightbulb, Building2, CheckCircle2, ExternalLink, Info } from "lucide-react";
import softwaricaHero from "../assets/softwarica_hero.png";

export function SoftwaricaNativeAd() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white group mb-6">
                <CardContent className="p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">S</div>
                            <div className="flex flex-col gap-0.5">
                                <h4 className="font-bold text-slate-900 text-sm leading-none">Softwarica College</h4>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[10px] hover:bg-blue-100 w-fit flex items-center gap-1 font-medium border border-blue-100 px-2 py-0.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Official Academic Partner
                                </Badge>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-md">Sponsored</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">Start in Nepal. <br className="hidden sm:block" /> Graduate Globally.</h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed max-w-xl">
                                    Study IT & Business programs in Nepal with international credit transfer pathways to the UK & Europe. Save costs without compromising quality.
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                {[
                                    { icon: Globe, text: "UK-affiliated degrees" },
                                    { icon: Building2, text: "International credit transfer" },
                                    { icon: GraduationCap, text: "World-class IT Faculty" },
                                    { icon: CheckCircle2, text: "Career-focused curriculum" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[14px] text-slate-700">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Contextual Tip */}
                            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700">
                                    <span className="font-semibold text-slate-900">Recommended</span> for students planning international transfer or seeking British accreditation.
                                </span>
                            </div>
                        </div>

                        {/* CTA Side */}
                        <div className="flex flex-col justify-end lg:items-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6">
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold h-11"
                            >
                                Explore Transfer Options <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <p className="text-[10px] text-slate-400 text-center lg:text-right max-w-[200px] leading-tight">
                                Sponsored content. ApplyBro does not influence admission decisions.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
                    <div className="h-40 w-full relative">
                        <img src={softwaricaHero} className="w-full h-full object-cover" alt="Softwarica Campus" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-semibold mb-2 text-cyan-100">
                                Partner College
                            </div>
                            <h2 className="text-2xl font-bold">Softwarica College of IT & E-Commerce</h2>
                            <p className="text-sm text-blue-100/90 flex items-center gap-2 mt-1">
                                <Building2 className="w-3.5 h-3.5" /> Dillibazar, Kathmandu • Estd. 2010
                            </p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 bg-white">
                        <div>
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4 text-blue-600" /> About the College
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed text-justify">
                                Softwarica College works in collaboration with <strong>Coventry University, UK</strong>, to offer world-class IT education in Nepal.
                                Focusing on practical learning and real-world innovation, they provide students with robust pathways to widely recognized British degrees and opportunities to transfer credits internationally after 1 or 2 years.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h5 className="font-bold text-sm text-slate-800 mb-3">Programs Eligible</h5>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> BSc (Hons) Computing</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> BSc (Hons) Ethical Hacking</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> BSc (Hons) Data Science & AI</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h5 className="font-bold text-sm text-slate-800 mb-3">Transfer Pathways</h5>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-green-500" /> 2 Years Nepal + 1 Year UK</li>
                                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-green-500" /> 1 Year Nepal + 2 Years UK</li>
                                    <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-blue-500" /> Full Degree in Nepal (3 Years)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button variant="ghost" onClick={() => setIsOpen(false)}>Close</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.open('https://softwarica.edu.np', '_blank')}>
                                Visit Official Website <ExternalLink className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
