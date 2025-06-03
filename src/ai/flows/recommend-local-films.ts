
'use server';
/**
 * @fileOverview A local film recommendation AI agent.
 *
 * - recommendLocalFilms - A function that recommends films showing in local Barcelona cinemas based on user quiz results.
 * - RecommendLocalFilmsInput - The input type for the recommendLocalFilms function.
 * - RecommendLocalFilmsOutput - The return type for the recommendLocalFilms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Removed: import {getCinemaMovies, type LocalFilmData} from '@/services/cinema-service';

const RecommendLocalFilmsInputSchema = z.object({
  quizResults: z
    .string()
    .describe('The user quiz results, as a stringified JSON object detailing personality scores and movie ratings.'),
  location: z
    .string()
    .describe('The user’s location. This should be set to Barcelona.'),
});
export type RecommendLocalFilmsInput = z.infer<typeof RecommendLocalFilmsInputSchema>;

// This schema represents the structure of EACH film in the hardcoded list for the AI's reference
const FilmDataInPromptSchema = z.object({
  title: z.string().describe('The title of the film.'),
  characteristics: z.string().describe('Characteristics or genre of the film.'),
  cinemaName: z.string().describe('The name of the cinema where the film is playing.'),
  cinemaLocation: z.string().describe('The address of the cinema.'),
});

const RecommendedLocalFilmSchema = z.object({
  title: z.string().describe('The title of the recommended film.'),
  cinemaName: z.string().describe('The name of the cinema where this recommended film is playing.'),
  cinemaLocation: z.string().describe('The location of the cinema for this recommended film.'),
});

const RecommendLocalFilmsOutputSchema = z.object({
  recommendations: z.array(RecommendedLocalFilmSchema)
    .min(0).max(3)
    .describe('A list of recommended films. Contains 3 films if 3 or more were available from the embedded list; otherwise, contains all films that were available (0, 1, or 2).'),
});
export type RecommendLocalFilmsOutput = z.infer<typeof RecommendLocalFilmsOutputSchema>;


export async function recommendLocalFilms(input: RecommendLocalFilmsInput): Promise<RecommendLocalFilmsOutput> {
  return recommendLocalFilmsFlow(input);
}

// Tool definition removed: getLocalCinemaMovies tool is no longer used.

const hardcodedFilmData = `
Film,Film Characteristics,Cinema Name,Cinema Location
Mission: Impossible The Final Reckoning,"Action, Adventure, Thriller",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Lilo & Stitch,"Family, Comedy, Science Fiction",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
How to Train Your Dragon,"Action, Family, Fantasy",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Jurassic World Rebirth,"Science Fiction, Adventure, Thriller",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
F1: The Movie,"Action, Drama",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
From the World of John Wick: Ballerina,"Action, Thriller, Crime",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Final Destination: Bloodlines,"Horror, Mystery",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Sinners,"Horror, Thriller",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Thunderbolts*,"Action, Science Fiction, Adventure",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
One to One: John & Yoko,"Documentary, Music",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Black Bag,"Thriller, Mystery, Drama",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
The Accountant,"Crime, Thriller, Action",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Warfare,"War, Action",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Ezra,"Comedy, Drama",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Conclave,"Drama, Thriller, Mystery",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Interstellar,"Adventure, Drama, Science Fiction",Cinesa Diagonal Mar,"Avinguda Diagonal, 3, 08019 Barcelona"
Perfect Days,"Drama",Cinemes Verdi,"Carrer de Verdi, 32, 08012 Barcelona"
The Seed of the Sacred Fig,"Drama, Political",Cinemes Verdi,"Carrer de Verdi, 32, 08012 Barcelona"
La Chimera,"Fantasy, Romance, Drama",Cinemes Verdi,"Carrer de Verdi, 32, 08012 Barcelona"
Robot Dreams,"Animation, Adventure, Drama",Cinemes Verdi,"Carrer de Verdi, 32, 08012 Barcelona"
20,000 Species of Bees,"Drama, Family",Cinemes Verdi,"Carrer de Verdi, 32, 08012 Barcelona"
The Promised Land,"Historical, Drama",Cinemes Verdi,"Carrer de Verdi, 32, 08012 Barcelona"
Kidnapped: The Abduction of Edgardo Mortara,"Drama, Historical",Cinemes Balmes,"Carrer de Balmes, 422, 08022 Barcelona"
Io Capitano,"Adventure, Drama",Cinemes Balmes,"Carrer de Balmes, 422, 08022 Barcelona"
The Animal Kingdom,"Fantasy, Drama",Cinemes Balmes,"Carrer de Balmes, 422, 08022 Barcelona"
L'Amour et les forets,"Drama, Romance",Cinemes Balmes,"Carrer de Balmes, 422, 08022 Barcelona"
Oppenheimer,"Biography, Drama, History",Cinemes Bosque,"Rambla de Prat, 16, 08012 Barcelona"
Barbie,"Comedy, Fantasy",Cinemes Bosque,"Rambla de Prat, 16, 08012 Barcelona"
Killers of the Flower Moon,"Crime, Drama, History",Cinemes Bosque,"Rambla de Prat, 16, 08012 Barcelona"
`;

const prompt = ai.definePrompt({
  name: 'recommendLocalFilmsPrompt',
  input: {schema: RecommendLocalFilmsInputSchema},
  output: {schema: RecommendLocalFilmsOutputSchema},
  // tools: [getLocalCinemaMovies], // Tool removed
  prompt: `You are a film recommendation expert. Your task is to recommend films that are currently playing in local cinemas in {{{location}}} (primarily Barcelona) that would specifically appeal to a user based on their detailed personality quiz results.

The following is a list of movies currently playing in local cinemas in Barcelona. Each line represents a film with its title, characteristics (genre), cinema name, and cinema location, in CSV format (Film,Film Characteristics,Cinema Name,Cinema Location):
${hardcodedFilmData}

CRITICAL INSTRUCTION: The films you recommend MUST be selected EXCLUSIVELY from the list of movies provided ABOVE. Do NOT recommend films solely because they were mentioned or rated highly in the user's quiz results, unless those same films are also present in the list above. The user's quiz results (including their movie ratings) are for understanding their preferences, which you should use to select suitable films from the *local cinema list embedded in this prompt*.

Carefully analyze the user's quiz results provided below. These results include their personality scores (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) and their ratings for a set of example movies (which are for preference understanding only).
User Quiz Results:
{{{quizResults}}}

Based on the list of locally available movies (provided ABOVE) and the user's quiz results:

Your output for the "recommendations" field MUST adhere STRICTLY to the following rules. THIS IS A MANDATORY REQUIREMENT:
1.  IF the embedded list of movies above is effectively empty (which it is not in this version of the prompt), your "recommendations" array in the output JSON MUST be empty.
2.  Given the embedded list of movies:
    a. You MUST analyze these available movies against the user's quiz results.
    b. Your "recommendations" array in the output JSON MUST then be populated as follows:
        i.  If the embedded list provided 3 or more movies, you MUST select exactly 3 movies from this list. Choose the 3 movies whose 'characteristics' (from the embedded list) most closely align with the user's personality profile. It is MANDATORY to select 3 movies in this case, even if the alignment is not perfect for all of them. Prioritize making a selection over finding no matches.
        ii. If the embedded list provided 1 or 2 movies, you MUST include ALL of those movies in your "recommendations" array.
    c. It is MANDATORY to populate the "recommendations" array according to these rules based on the embedded list. Do not return an empty "recommendations" array.

For each film you recommend (sourced ONLY from the embedded list), provide:
1.  \`title\`: The film's title (from the embedded list).
2.  \`cinemaName\`: The name of the cinema where this specific film is playing (from the embedded list).
3.  \`cinemaLocation\`: The location (address) of that cinema (from the embedded list).

Format your output as a JSON object with a "recommendations" key. The value of "recommendations" should be an array of film objects as described above.
Example for 3 recommendations: { "recommendations": [{"title": "Film Title 1", "cinemaName": "Cinema ABC", "cinemaLocation": "123 Main St"}, {"title": "Film Title 2", "cinemaName": "Cinema XYZ", "cinemaLocation": "456 Oak Ave"}, {"title": "Film Title 3", "cinemaName": "Cinema 123", "cinemaLocation": "789 Pine Rd"}] }.
Ensure the film titles, cinema names, and locations are accurate based on the data from the embedded list. Do not invent films or use films from outside this list. Adherence to the number of recommendations specified above is mandatory.`,
});

const recommendLocalFilmsFlow = ai.defineFlow(
  {
    name: 'recommendLocalFilmsFlow',
    inputSchema: RecommendLocalFilmsInputSchema,
    outputSchema: RecommendLocalFilmsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.recommendations) {
      console.warn('AI failed to return recommendations or the recommendations key. Defaulting to empty array.');
      return { recommendations: [] }; 
    }
    // Ensure the output adheres to the min/max constraints, though the prompt should handle this.
    // This is a safety net.
    if (output.recommendations.length > 3) {
        output.recommendations = output.recommendations.slice(0,3);
    }
    return output;
  }
);

