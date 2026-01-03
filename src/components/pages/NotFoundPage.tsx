
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "../ui/button";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-gray-200 overflow-hidden">
            {/* Header / Logo Area */}
            <div className="absolute top-0 left-0 p-6 md:p-10 z-20">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <img src={logo} alt="ApplyBro Logo" className="h-10 w-auto group-hover:scale-105 transition-transform" />
                    <span className="text-xl font-bold text-gray-900">ApplyBro</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 lg:gap-20">

                {/* Text Section */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center items-start z-10 pt-20 lg:pt-0 pl-0 lg:pl-12">

                    {/* Top Label */}
                    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest mb-6">
                        Not Found
                    </h2>

                    {/* Top Thick Bar */}
                    <div className="h-3 w-48 bg-black mb-10"></div>

                    {/* Massive Graphic Text */}
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-black text-black leading-[0.9] mb-10 tracking-tighter uppercase whitespace-nowrap">
                        THE PAGE<br />
                        YOU ARE<br />
                        LOOKING FOR<br />
                        CANNOT BE<br />
                        FOUND
                    </h1>

                    {/* Bottom Thick Bar */}
                    <div className="h-3 w-full max-w-2xl bg-black mb-10"></div>

                    {/* Description */}
                    <p className="text-xl text-gray-700 font-medium mb-12 max-w-lg leading-relaxed">
                        We sent this guy to find out what happened.
                        <br className="hidden md:block" />
                        Rest assured, it will be dealt with.
                    </p>

                    {/* Navigation Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="h-14 px-8 border-2 border-black text-black hover:bg-black hover:text-white font-bold text-lg rounded-none uppercase tracking-wide transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </Button>
                        <Button
                            onClick={() => navigate("/")}
                            className="h-14 px-8 bg-blue-600 border-2 border-blue-600 hover:border-blue-700 text-white hover:bg-blue-700 font-bold text-lg rounded-none uppercase tracking-wide transition-all shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Homepage
                        </Button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-[55%] h-[50vh] lg:h-screen flex items-end justify-center lg:justify-end relative pointer-events-none">
                    <img
                        src="https://pngimg.com/uploads/chuck_norris/chuck_norris_PNG14.png"
                        alt="Chuck Norris"
                        className="h-full w-full object-contain object-bottom filter drop-shadow-2xl scale-125 origin-bottom relative -right-10 lg:right-0"
                    />
                    {/* Gradient Fade at bottom to blend if needed on smaller screens, optional */}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent lg:hidden"></div>
                </div>
            </div>
        </div>
    );
}
