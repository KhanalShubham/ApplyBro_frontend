interface PremiumBackgroundProps {
    children: React.ReactNode;
}

export function PremiumBackground({ children }: PremiumBackgroundProps) {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans bg-gradient-to-br from-blue-50 via-white to-blue-50">

            {/* SOFT ATMOSPHERIC OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200/20 via-transparent to-blue-900/40" />

            {/* LIGHT GLOW CENTER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[700px] bg-white/20 blur-[140px] rounded-full" />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                {children}
            </div>
        </div>
    );
}
