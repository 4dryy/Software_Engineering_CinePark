import { Film } from 'lucide-react';

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };
  return (
    <div className="flex items-center space-x-2">
      <Film className={`text-primary ${size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10"}`} />
      <h1 className={`font-bold ${sizeClasses[size]}`}>
        <span className="text-foreground">CINE</span><span className="text-primary">PARK</span>
      </h1>
    </div>
  );
}
