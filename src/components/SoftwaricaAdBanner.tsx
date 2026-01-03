import { useState } from "react";
import { Button } from "./ui/button";
import { X, ExternalLink } from "lucide-react";
import softwaricaHero from "../assets/softwarica_hero.png";

export function SoftwaricaAdBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative w-full shadow-lg mb-6 group animate-in fade-in zoom-in duration-500 overflow-hidden rounded-xl bg-slate-900 border border-slate-800">

            {/* Main Wrapper with Fixed Ultra-Small Height */}
            <div className="relative h-[120px] md:h-[150px] w-full flex items-center bg-black">

                {/* Image Section - Object Contain to see full poster or Cover to fill */}
                {/* Using object-cover with object-top to focus on the header part of the poster if cropped, 
                    OR object-contain to show the full poster letterboxed */}
                <img
                    src={softwaricaHero}
                    alt="Softwarica College"
                    className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/40" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6">

                    {/* Left: Compact Text Info */}
                    <div className="flex flex-col justify-center max-w-[60%]">
                        <div className="inline-flex items-center gap-2 mb-1">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-800">
                                Admissions Open
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow-md">
                            Softwarica College
                        </h3>
                        <p className="text-blue-200 text-xs md:text-sm font-medium line-clamp-1 opacity-90">
                            Coventry University UK Degree • IT & E-Commerce
                        </p>
                    </div>

                    {/* Right: Tiny Actions */}
                    <div className="flex flex-col gap-2 z-10">
                        <Button
                            onClick={() => window.open('https://softwarica.edu.np', '_blank')}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold h-7 px-3 text-[10px] md:h-8 md:text-xs md:px-4 shadow-lg shadow-cyan-900/40 whitespace-nowrap"
                        >
                            Apply Now
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => window.open('https://softwarica.edu.np', '_blank')}
                            className="text-white hover:text-cyan-300 h-6 px-2 text-[10px] md:text-xs hover:bg-white/5 justify-end"
                        >
                            Visit Website <ExternalLink className="ml-1 w-3 h-3" />
                        </Button>
                    </div>

                </div>

                {/* Tiny Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-red-500 text-white/70 hover:text-white rounded-full transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>

            </div>
        </div>
    );
}
