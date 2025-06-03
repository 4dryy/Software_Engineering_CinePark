
import { getCurrentUser } from "@/lib/auth-actions";
import { recommendLocalFilms, type RecommendLocalFilmsOutput, type RecommendLocalFilmsInput } from "@/ai/flows/recommend-local-films";
import type { DetailedQuizAnswers } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Film, ListChecks, AlertCircle, Clapperboard, MapPin, WifiOff } from "lucide-react"; // Added MapPin and WifiOff

// Helper type, inferred from the AI flow's output schema for individual recommendations
type RecommendedLocalFilm = RecommendLocalFilmsOutput['recommendations'][number];

export default async function LocalCinemasPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
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
      console.error("Error parsing quiz results on local cinemas page:", e);
    }
  }

  if (!quizData || !quizData.personalityScores || Object.keys(quizData.personalityScores).length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card className="max-w-lg mx-auto shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <ListChecks className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>Quiz Data Needed</CardTitle>
            <CardDescription>
              Please complete your personality quiz. We need your results to recommend local films tailored to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/quiz">Take the Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  let recommendations: RecommendedLocalFilm[] = [];
  let errorOccurred = false;
  let caughtErrorMessage: string | null = null;
  let isModelOverloadedError = false;

  try {
    const quizResultsString = typeof user.quizResults === 'string' ? user.quizResults : JSON.stringify(user.quizResults);
    const flowInput: RecommendLocalFilmsInput = {
      quizResults: quizResultsString,
      location: "Barcelona",
    };
    const result = await recommendLocalFilms(flowInput);
    if (result && result.recommendations) {
      recommendations = result.recommendations;
    } else {
      recommendations = []; 
    }
  } catch (error) {
    console.error("Error fetching local film recommendations:", error);
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

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Clapperboard className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl md:text-3xl">Local Films For You in Barcelona</CardTitle>
          </div>
          <CardDescription>
            Based on your personality quiz, here are some films currently playing in Barcelona cinemas that you might enjoy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorOccurred ? (
            <Alert variant="destructive">
              {isModelOverloadedError ? <WifiOff className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>
                {isModelOverloadedError ? "Service Temporarily Busy" : "Error Generating Recommendations"}
              </AlertTitle>
              <AlertDescription>
                {isModelOverloadedError 
                  ? "Our film recommendation service is currently experiencing high demand. Please try again in a few moments."
                  : "We couldn't generate local film recommendations at this time. Please try again later."
                }
                {caughtErrorMessage && !isModelOverloadedError && <p className="mt-2 text-xs">Details: {caughtErrorMessage}</p>}
              </AlertDescription>
            </Alert>
          ) : recommendations.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-accent">Our Picks From Local Cinemas:</h3>
              {recommendations.map((film, index) => (
                <Card key={index} className="bg-card-foreground/5 p-4 shadow-md">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-xl text-primary">{film.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clapperboard className="h-4 w-4 mr-2 text-accent" /> 
                      <span>{film.cinemaName}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-accent" />
                      <span>{film.cinemaLocation}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <Film className="h-4 w-4" />
              <AlertTitle>No Specific Matches Found</AlertTitle>
              <AlertDescription>
                We couldn't find specific local films in Barcelona perfectly matching your profile right now. 
                You can always check general listings or try our broader film recommendations!
                 <Button asChild variant="link" className="ml-1 p-0 h-auto">
                    <Link href="/recommendations">View General Recommendations</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
         <CardFooter className="flex justify-end pt-6 mt-4 border-t">
            <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
