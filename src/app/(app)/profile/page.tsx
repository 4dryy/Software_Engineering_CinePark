
import { getCurrentUser, logout } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut, Edit3, UserCircle2, FileText } from "lucide-react";
import type { DetailedQuizAnswers, PersonalityScores } from "@/lib/types";
import { quizDefinition, type PersonalitySection, type QuizOption } from "@/lib/quiz-data"; // Import quizDefinition and types

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    // This case should ideally be handled by the AppLayout, which would call logout.
    // If somehow reached, it's a fallback.
    return <p>User not found. Please log in.</p>;
  }
  
  let detailedQuizResults: DetailedQuizAnswers | null = null;
  let rawQuizResultsString: string | null = null;

  if (user.quizResults && typeof user.quizResults === 'string' && user.quizResults.trim() !== '') {
    rawQuizResultsString = user.quizResults; // Store the raw string
    try {
      // getCurrentUser now returns quizResults as an object if parsing was successful.
      // So, if user.quizResults is already an object, we can use it directly.
      // This check is for robustness, in case it's ever a string at this point.
      if (typeof user.quizResults === 'object') {
        detailedQuizResults = user.quizResults as DetailedQuizAnswers;
      } else {
        detailedQuizResults = JSON.parse(user.quizResults);
      }
    } catch (e) {
      console.error("Error parsing detailed quiz results on profile page:", e);
      // detailedQuizResults remains null
    }
  } else if (user.quizResults && typeof user.quizResults === 'object') {
    // If getCurrentUser already parsed it (which it should)
    detailedQuizResults = user.quizResults as DetailedQuizAnswers;
    rawQuizResultsString = JSON.stringify(user.quizResults); // Re-stringify for raw view if needed
  }

  const getPersonalityTraitLabel = (traitId: keyof PersonalityScores): string | null => {
    if (!detailedQuizResults?.personalityScores) return null;

    const scoreValue = detailedQuizResults.personalityScores[traitId];
    if (!scoreValue) return "Not answered";

    const section = quizDefinition.find(
      (s) => s.id === traitId && s.type === 'personality'
    ) as PersonalitySection | undefined;

    const option = section?.options.find((opt) => opt.value === scoreValue);
    return option?.label || "Unknown option";
  };

  const personalityTraitsOrder: (keyof PersonalityScores)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];


  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={`https://placehold.co/100x100.png?text=${user.name?.[0] || 'U'}`} alt={user.name || "User"} data-ai-hint="profile person" />
              <AvatarFallback><UserCircle2 size={48}/></AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl">{user.name}</CardTitle>
          <CardDescription className="text-lg">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Account Details</h3>
            <Separator className="mb-4" />
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Not Implemented)
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-accent flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Latest Quiz Results
            </h3>
            <Separator className="mb-4 border-accent/50" />
            {detailedQuizResults ? (
              <div className="space-y-4 bg-card-foreground/5 p-4 rounded-md">
                <div>
                  <h4 className="font-medium text-md mb-2">Personality Insights:</h4>
                  {detailedQuizResults.personalityScores && Object.keys(detailedQuizResults.personalityScores).length > 0 ? (
                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                      {personalityTraitsOrder.map(traitKey => {
                        const traitLabel = traitKey.charAt(0).toUpperCase() + traitKey.slice(1);
                        const selectedOptionLabel = getPersonalityTraitLabel(traitKey);
                        if (detailedQuizResults?.personalityScores?.[traitKey]) { // Only show if answered
                          return (
                            <li key={traitKey}>
                              <strong>{traitLabel}:</strong> {selectedOptionLabel}
                            </li>
                          );
                        }
                        return null;
                      })}
                    </ul>
                  ) : (
                     <p className="text-xs text-muted-foreground">No personality traits recorded.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-md mb-2 mt-3">Movie Ratings:</h4>
                  {detailedQuizResults.movieRatings && detailedQuizResults.movieRatings.length > 0 ? (
                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                      {detailedQuizResults.movieRatings.map(rating => (
                        <li key={rating.movieId}>
                          <strong>{rating.title}:</strong> {rating.rating ? `${rating.rating} / 5 stars` : 'Not rated'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">No movies rated.</p>
                  )}
                </div>
                 {rawQuizResultsString && (
                    <details className="mt-4 text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View Raw Data (for debugging)</summary>
                        <pre className="mt-2 p-2 bg-muted rounded-sm overflow-auto text-[10px]">{JSON.stringify(JSON.parse(rawQuizResultsString), null, 2)}</pre>
                    </details>
                 )}
              </div>
            ) : (
               <p className="text-muted-foreground">You haven&apos;t taken the personality quiz yet. Take it now to get personalized film recommendations!</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <form action={logout} className="w-full">
            <Button variant="destructive" className="w-full" type="submit">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
