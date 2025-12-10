import { AlertCircle } from "lucide-react";
import { cn } from "./utils";

interface ErrorBannerProps {
  message: string;
  className?: string;
  title?: string;
}

export function ErrorBanner({ message, className, title = "Something went wrong" }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-semibold text-red-900">{title}</p>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

