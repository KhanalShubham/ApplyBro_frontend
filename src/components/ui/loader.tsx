import { cn } from "./utils";

interface LoaderProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap: Record<Exclude<LoaderProps["size"], undefined>, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export function Loader({ label = "Loading...", className, size = "md" }: LoaderProps) {
  const spinnerSize = sizeMap[size] ?? sizeMap.md;

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground", className)}>
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "animate-spin rounded-full border-b-transparent border-primary",
          spinnerSize,
        )}
      />
      {label && <span className="font-medium text-foreground">{label}</span>}
    </div>
  );
}

