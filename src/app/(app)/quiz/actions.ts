
"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth-actions";
import { updateUser } from "@/lib/csv-store";
import { redirect } from "next/navigation";
import type { DetailedQuizAnswers, PersonalityScores, MovieRatingInput } from "@/lib/types";
import { quizDefinition, type PersonalitySection } from "@/lib/quiz-data";

// Personality scores are now mandatory for each section if that section is "reached"
// The client side ensures navigation. Server-side, if a key is missing, it means that
// section was not filled.
const PersonalityScoresSchema = z.object({
  openness: z.string({ required_error: "Openness selection is required." }),
  conscientiousness: z.string({ required_error: "Conscientiousness selection is required." }),
  extraversion: z.string({ required_error: "Extraversion selection is required." }),
  agreeableness: z.string({ required_error: "Agreeableness selection is required." }),
  neuroticism: z.string({ required_error: "Neuroticism selection is required." }),
});


const MovieRatingInputSchema = z.object({
  movieId: z.string(),
  title: z.string(),
  // Rating is now truly optional. If not provided, it means the user skipped rating this movie.
  rating: z.coerce.number().min(1).max(5).optional(), 
});

const DetailedQuizAnswersSchema = z.object({
  personalityScores: PersonalityScoresSchema,
  // Movie ratings array itself is optional, but if provided, items should match schema.
  // For now, we'll make it optional at the top level, implying the whole section can be skipped,
  // though client logic currently populates it with undefined ratings.
  movieRatings: z.array(MovieRatingInputSchema).optional(), 
});


export async function saveQuizResultsAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { message: "User not authenticated.", errors: null };
  }

  const rawPersonalityScores: Partial<PersonalityScores> = {};
  const rawMovieRatings: MovieRatingInput[] = [];

  const personalitySectionIds = quizDefinition
    .filter(s => s.type === 'personality')
    .map(s => (s as PersonalitySection).id);

  for (const id of personalitySectionIds) {
    const value = formData.get(`personalityScores.${id}`) as string | null;
    if (value) { // Only add if a value was actually provided
      rawPersonalityScores[id as keyof PersonalityScores] = value;
    }
  }
  
  const movieRatingEntries: Record<number, Partial<MovieRatingInput>> = {};
  formData.forEach((value, key) => {
    const match = key.match(/^movieRatings\[(\d+)\]\.(movieId|title|rating)$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const field = match[2] as keyof MovieRatingInput; // movieId, title, or rating
      if (!movieRatingEntries[index]) {
        movieRatingEntries[index] = {};
      }
      // If field is 'rating', it might be a string like "3" or undefined if not rated.
      // If it's movieId or title, it will be a string.
      movieRatingEntries[index][field] = value as any; 
    }
  });

  for (const index in movieRatingEntries) {
    const entry = movieRatingEntries[index];
    if (entry.movieId && entry.title) {
       // Ensure rating is a number or undefined, not an empty string if not provided.
       const ratingValue = entry.rating; // This could be a string like "3" or undefined
       rawMovieRatings.push({
           movieId: entry.movieId,
           title: entry.title,
           // rating will be coerced by Zod or remain undefined if not present
           rating: ratingValue !== undefined ? (ratingValue as any) : undefined 
       });
    }
  }


  const rawData: Partial<DetailedQuizAnswers> = {
    personalityScores: rawPersonalityScores as PersonalityScores,
    movieRatings: rawMovieRatings.length > 0 ? rawMovieRatings : undefined, // Make array undefined if empty
  };
  
  const validatedFields = DetailedQuizAnswersSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    // Custom message to guide the user
    let message = "Please complete all personality sections. ";
    // Check if there are specific movie rating errors (though less likely with current optional setup)
    if(fieldErrors.movieRatings) {
        message += "There was an issue with movie ratings.";
    }
    
    return {
      message: message,
      errors: fieldErrors, // Return the Zod errors object
    };
  }
  
  const quizResultsString = JSON.stringify(validatedFields.data);

  try {
    await updateUser({ ...user, quizResults: quizResultsString });
  } catch (error) {
    console.error("Failed to save quiz results:", error);
    return { message: "Failed to save quiz results. Please try again.", errors: null };
  }
  
  redirect("/dashboard"); // Redirect to dashboard as requested
}

    