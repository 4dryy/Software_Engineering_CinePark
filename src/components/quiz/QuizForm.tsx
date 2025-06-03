
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { saveQuizResultsAction } from "@/app/(app)/quiz/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Send, ArrowLeft, ArrowRight, Star, Loader2 } from "lucide-react";
import { quizDefinition, type PersonalitySection, type MovieRatingSection, type QuizStepData, type MovieToRate } from "@/lib/quiz-data";
import type { DetailedQuizAnswers, PersonalityScores, MovieRatingInput } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

const initialState: { message: string | null; errors: Record<string, string[]> | null } = {
  message: null,
  errors: null,
};

export function QuizForm() {
  const [serverState, formAction] = useActionState(saveQuizResultsAction, initialState);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<DetailedQuizAnswers>>({
    personalityScores: {},
    movieRatings: quizDefinition
      .filter(step => step.type === 'movieRating')
      .flatMap(step => (step as MovieRatingSection).movies.map(movie => ({ movieId: movie.id, title: movie.title, rating: undefined }))),
  });

  const totalSteps = quizDefinition.length;
  const currentQuizStepData = quizDefinition[currentStep];

  useEffect(() => {
    if (serverState?.message && serverState.errors && Object.keys(serverState.errors).length > 0) { // Only show toast if there are actual field errors or a general message + errors
      toast({
        title: "Validation Error",
        description: serverState.message || "Please check the form for errors.",
        variant: "destructive",
      });
    } else if (serverState?.message && !serverState.errors) { // General error not related to field validation (e.g., server issue)
       toast({
        title: "Error",
        description: serverState.message,
        variant: "destructive",
      });
    }
    // Success toast is tricky here due to redirect. Might be better on the destination page.
  }, [serverState, toast]);

  const handlePersonalityChange = (sectionId: keyof PersonalityScores, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalityScores: {
        ...prev.personalityScores,
        [sectionId]: value,
      },
    }));
  };

  const handleMovieRatingChange = (movieId: string, title: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      movieRatings: prev.movieRatings?.map(mr =>
        mr.movieId === movieId ? { ...mr, title, rating } : mr
      ) || [{ movieId, title, rating }],
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentProgress = ((currentStep + 1) / totalSteps) * 100;

  const renderStepContent = () => {
    const stepData = currentQuizStepData;
    if (!stepData) return null;

    if (stepData.type === 'personality') {
      const section = stepData as PersonalitySection;
      // Check for errors for this specific personality section
      const sectionErrorKey = `personalityScores.${section.id}`;
      const errorForThisSection = serverState?.errors?.[sectionErrorKey]?.[0];
      
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{section.description}</p>
          <RadioGroup
            // name={section.id} // RHF would use this, but for direct state, not strictly necessary
            value={formData.personalityScores?.[section.id]}
            onValueChange={(value) => handlePersonalityChange(section.id, value)}
            className="space-y-2"
          >
            {section.options.map((option) => (
              <Label
                key={option.value}
                htmlFor={`${section.id}-${option.value}`}
                className={`flex items-center space-x-3 p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer
                  ${formData.personalityScores?.[section.id] === option.value ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-input'}`}
              >
                <RadioGroupItem value={option.value} id={`${section.id}-${option.value}`} />
                <span>{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
          {errorForThisSection && (
            <p className="text-xs text-destructive flex items-center gap-1 pt-1">
              <AlertCircle size={14}/> {errorForThisSection}
            </p>
          )}
        </div>
      );
    }

    if (stepData.type === 'movieRating') {
      const section = stepData as MovieRatingSection;
      return (
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">{section.description}</p>
          {section.movies.map((movie) => {
            const currentRating = formData.movieRatings?.find(mr => mr.movieId === movie.id)?.rating;
            const movieErrorKey = `movieRatings`; // Zod errors on arrays might be general or indexed
            const errorForThisMovie = serverState?.errors?.[movieErrorKey]?.[0]; // Simplified error display

            return (
              <div key={movie.id} className="p-4 border rounded-md space-y-3">
                <h4 className="font-semibold">{movie.title}</h4>
                <RadioGroup
                  value={currentRating?.toString()}
                  onValueChange={(value) => handleMovieRatingChange(movie.id, movie.title, parseInt(value))}
                  className="flex flex-wrap gap-2" // Added flex-wrap and gap for better responsiveness
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Label
                      key={star}
                      htmlFor={`movie-${movie.id}-star-${star}`}
                      className={`flex items-center justify-center p-2 border rounded-md w-12 h-12 hover:bg-muted/50 transition-colors cursor-pointer
                        ${currentRating === star ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-input'}`}
                    >
                      <RadioGroupItem value={star.toString()} id={`movie-${movie.id}-star-${star}`} className="sr-only" />
                      <Star className={currentRating && star <= currentRating ? "text-accent fill-accent" : "text-muted-foreground"}/>
                    </Label>
                  ))}
                </RadioGroup>
                 {errorForThisMovie && ( // Display general movie rating error if present
                    <p className="text-xs text-destructive flex items-center gap-1 pt-1">
                        <AlertCircle size={14}/> {errorForThisMovie}
                    </p>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleFormSubmit = () => {
    const submissionData = new FormData();
    
    Object.entries(formData.personalityScores || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) { // Ensure value is present
            submissionData.append(`personalityScores.${key}`, String(value));
        }
    });

    (formData.movieRatings || []).forEach((rating, index) => {
        submissionData.append(`movieRatings[${index}].movieId`, rating.movieId);
        submissionData.append(`movieRatings[${index}].title`, rating.title);
        if (rating.rating !== undefined) { // Only append rating if it's actually set
            submissionData.append(`movieRatings[${index}].rating`, rating.rating.toString());
        }
    });
    
    startTransition(() => {
        formAction(submissionData);
    });
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-primary">PERSONALITY & MOVIE QUIZ</CardTitle>
        {currentQuizStepData && <CardDescription className="text-lg">{currentQuizStepData.title}</CardDescription>}
         <div className="space-y-1 pt-2">
            <Progress value={currentProgress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground text-right">Section {currentStep + 1} of {totalSteps}</p>
        </div>
      </CardHeader>
      {/* Removed form tag from here, using buttons to control actions */}
      <CardContent className="space-y-8 min-h-[300px]">
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0 || isPending}>
          <ArrowLeft className="mr-2 h-4 w-4"/> Back
        </Button>
        {currentStep < totalSteps - 1 ? (
          <Button type="button" onClick={nextStep} className="bg-accent hover:bg-accent/90" disabled={isPending}>
            Next <ArrowRight className="ml-2 h-4 w-4"/>
          </Button>
        ) : (
          // This button will now trigger the manual submit
          <Button type="button" onClick={handleFormSubmit} className="bg-primary hover:bg-primary/90" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
            Submit Quiz & Get Recommendations
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

    