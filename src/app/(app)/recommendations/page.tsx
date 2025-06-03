
import { getCurrentUser } from "@/lib/auth-actions";
import { recommendFilms } from "@/ai/flows/recommend-films";
import { FilmCard } from "@/components/recommendations/FilmCard";
import type { FilmRecommendation, DetailedQuizAnswers } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Film, RefreshCw, WifiOff } from "lucide-react"; // Added WifiOff
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams?: { previous?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>User not authenticated. Please log in.</AlertDescription>
      </Alert>
    );
  }
  
  let quizData: DetailedQuizAnswers | null = null;
  if (user.quizResults && typeof user.quizResults === 'object') {
    quizData = user.quizResults as DetailedQuizAnswers;
  } else if (typeof user.quizResults === 'string' && user.quizResults.trim() !== '') {
    try {
      quizData = JSON.parse(user.quizResults);
    } catch (e) {
      console.error("Error parsing quiz results on recommendations page:", e);
    }
  }


  if (!quizData || 
      !quizData.personalityScores || Object.keys(quizData.personalityScores).length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Film className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>No Quiz Data Found</CardTitle>
                <CardDescription>
                You need to complete the personality quiz before we can generate film recommendations for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/quiz">Take the Quiz Now</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  let recommendations: FilmRecommendation[] = [];
  let errorOccurred = false;
  let caughtErrorMessage: string | null = null;
  let isModelOverloadedError = false; // New state for specific error

  const previousTitlesString = searchParams?.previous || "";
  const previouslyRecommendedTitles = previousTitlesString ? decodeURIComponent(previousTitlesString).split('|') : [];

  if (user && quizData && quizData.personalityScores && Object.keys(quizData.personalityScores).length > 0) {
    try {
      const quizResultsString = typeof user.quizResults === 'string' ? user.quizResults : JSON.stringify(user.quizResults);
      recommendations = await recommendFilms({
        quizResults: quizResultsString,
        location: "Barcelona", 
        previouslyRecommendedTitles: previouslyRecommendedTitles.length > 0 ? previouslyRecommendedTitles : undefined,
      });
    } catch (error) {
      console.error("Error fetching film recommendations:", error);
      errorOccurred = true;
      if (error instanceof Error) {
        caughtErrorMessage = error.message;
        if (error.message.includes("503 Service Unavailable") || error.message.toLowerCase().includes("model is overloaded")) {
          isModelOverloadedError = true;
        }
      } else {
        caughtErrorMessage = "An unknown error occurred while fetching recommendations.";
      }
    }
  } else if (!errorOccurred) { 
    errorOccurred = true;
    caughtErrorMessage = "User data or quiz results became unavailable before fetching recommendations.";
  }


  if (errorOccurred) {
     return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        {isModelOverloadedError ? <WifiOff className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        <AlertTitle>
          {isModelOverloadedError ? "Service Temporarily Busy" : "Error Generating Recommendations"}
        </AlertTitle>
        <AlertDescription>
          {isModelOverloadedError
            ? "Our film recommendation service is currently experiencing high demand. Please try again in a few moments."
            : "We couldn't generate film recommendations at this time. Please try again later."
          }
          {caughtErrorMessage && !isModelOverloadedError && <p className="mt-2 text-xs">Details: {caughtErrorMessage}</p>}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (recommendations.length === 0 && !errorOccurred) {
    return (
         <Alert className="max-w-2xl mx-auto">
            <Film className="h-4 w-4" />
            <AlertTitle>No Niche Recommendations Yet</AlertTitle>
            <AlertDescription>
                We couldn&apos;t find specific niche recommendations based on your current quiz. Try retaking the quiz with different answers, or broaden your film horizons!
                <Button asChild variant="link" className="ml-1 p-0 h-auto">
                    <Link href="/quiz">Retake Quiz</Link>
                </Button>
            </AlertDescription>
        </Alert>
    );
  }

  const currentRecommendationTitles = recommendations.map(film => film.title);
  const regenerateQueryParam = currentRecommendationTitles.length > 0 ? `?previous=${encodeURIComponent(currentRecommendationTitles.join('|'))}` : "";
  const regenerateHref = `/recommendations${regenerateQueryParam}`;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Niche Film Picks</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Based on your unique personality profile, here are some hidden gems and lesser-known films we think you&apos;ll love!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((film, index) => (
          <FilmCard key={index} film={film} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild size="lg">
          <Link href={regenerateHref}>
            <RefreshCw className="mr-2 h-5 w-5" />
            Discover More Hidden Gems
          </Link>
        </Button>
      </div>
    </div>
  );
}
