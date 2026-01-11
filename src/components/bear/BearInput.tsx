import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from "@/components/ui/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const BearInput = forwardRef<HTMLInputElement, InputProps>(function BearInput(
    { error, className = '', ...props },
    ref
) {
    // Utilizing a custom color for the bear theme: #D2691E (Chocolate)
    return (
        <div className="w-full relative">
            <input
                ref={ref}
                className={cn(
                    "w-full px-4 py-2 rounded border border-gray-300 focus:border-[#D2691E] focus:ring-1 focus:ring-[#D2691E] focus:outline-none",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 font-medium ml-1">{error}</p>
            )}
        </div>
    );
});

export default BearInput;
