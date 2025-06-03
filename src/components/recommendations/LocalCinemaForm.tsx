// This component is no longer used by the /local-cinemas page directly.
// It can be kept for potential future use or removed.
// For now, I'll leave it in case it's needed elsewhere, but it's not active in the primary flow.

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import type { LocalFilmRecommendation } from "@/lib/types";
import { recommendLocalFilms } from "@/ai/flows/recommend-local-films";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


export function LocalCinemaForm() {
  const [preferences, setPreferences] = useState("");
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setRecommendations(null);

    if (!preferences.trim()) {
      setError("Please enter your film preferences.");
      return;
    }

    startTransition(async () => {
      try {
        // This component would now need to get quizResults from somewhere if it were to be used.
        // For now, this call will fail if not adapted as recommendLocalFilms expects quizResults.
        // This is a placeholder to show the original structure.
        const result: LocalFilmRecommendation = await recommendLocalFilms({
          // preferences: preferences, // This is no longer the expected input
          quizResults: JSON.stringify({ personalityScores: {}, movieRatings: [] }), // Placeholder, needs actual data
          location: "Barcelona",
        });
        if (result && result.films) {
             setRecommendations(result.films);
        } else {
            setError("Could not retrieve recommendations. The AI might not have found suitable matches or encountered an issue.");
            setRecommendations([]);
        }
      } catch (err) {
        console.error("Error fetching local film recommendations:", err);
        setError("Failed to get recommendations. Please try again later.");
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Local Cinema Recommender (Manual)</CardTitle>
        <CardDescription>
          Tell us your film preferences, and we&apos;ll suggest movies currently showing in cinemas near Barcelona.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferences" className="text-lg font-semibold">
              What kind of films are you in the mood for?
            </Label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., 'Looking for a funny animated movie for the family', 'A thought-provoking sci-fi film', 'An action-packed thriller with a good story'"
              rows={4}
              disabled={isPending}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full md:w-auto" size="lg">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Find Local Movies (Manual)
          </Button>
        </CardFooter>
      </form>

      {recommendations && recommendations.length > 0 && (
        <CardContent className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Recommended Films in Barcelona Cinemas:</h3>
          <ul className="list-disc list-inside space-y-2 bg-muted/50 p-4 rounded-md">
            {recommendations.map((film, index) => (
              <li key={index} className="text-foreground">{film}</li>
            ))}
          </ul>
        </CardContent>
      )}
      {recommendations && recommendations.length === 0 && !error && (
         <CardContent className="mt-6">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Matches Found</AlertTitle>
                <AlertDescription>
                    We couldn&apos;t find any local films matching your preferences right now. Try broadening your search!
                </AlertDescription>
            </Alert>
        </CardContent>
      )}
    </Card>
  );
}
