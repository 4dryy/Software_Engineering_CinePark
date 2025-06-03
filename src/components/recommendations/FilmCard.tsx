
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FilmRecommendation } from "@/lib/types";
// Removed Image and Star imports as they are no longer used.
// Removed Button import

interface FilmCardProps {
  film: FilmRecommendation;
}

export function FilmCard({ film }: FilmCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        {/* Image component and its container div removed */}
        <CardTitle className="text-2xl">{film.title}</CardTitle>
        <Badge variant="secondary" className="w-fit">{film.genre}</Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <CardDescription>{film.description}</CardDescription>
        <div>
          <h4 className="font-semibold text-sm text-accent mb-1">Why you might like it:</h4>
          <p className="text-xs text-muted-foreground">{film.why}</p>
        </div>
      </CardContent>
      {/* CardFooter with the "More Info" button removed */}
    </Card>
  );
}
