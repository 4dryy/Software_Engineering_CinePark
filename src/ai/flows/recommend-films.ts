
'use server';
/**
 * @fileOverview AI agent for recommending films based on user quiz results.
 *
 * - recommendFilms - A function that handles the film recommendation process.
 * - RecommendFilmsInput - The input type for the recommendFilms function.
 * - RecommendFilmsOutput - The return type for the recommendFilms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendFilmsInputSchema = z.object({
  quizResults: z
    .string()
    .describe('The user quiz results, as a stringified JSON object detailing personality scores and movie ratings.'),
  location: z.string().describe('The user\u0027s location (e.g., city) for filtering cinema options.'),
  previouslyRecommendedTitles: z.array(z.string()).optional().describe('A list of film titles that were previously recommended and should be avoided if possible.'),
});
export type RecommendFilmsInput = z.infer<typeof RecommendFilmsInputSchema>;

const FilmRecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended film.'),
  genre: z.string().describe('The specific genre(s) of the film, possibly including niche sub-genres.'),
  description: z.string().describe('A short synopsis of the film, highlighting its unique aspects.'),
  why: z.string().describe('Why this specific niche film is recommended based on the quiz results and personality traits. Explain what makes it a hidden gem for this user.'),
});

const RecommendFilmsOutputSchema = z.array(FilmRecommendationSchema);
export type RecommendFilmsOutput = z.infer<typeof RecommendFilmsOutputSchema>;

const getLocalCinemaList = ai.defineTool({
  name: 'getLocalCinemaList',
  description: 'Gets a list of movies currently playing in local cinemas.',
  inputSchema: z.object({
    location: z.string().describe('The user\u0027s location (e.g., city).'),
  }),
  outputSchema: z.string().describe('A list of movies playing in local cinemas, formatted as a string.'),
}, async (input) => {
  // TODO: Implement the logic to fetch movies playing in local cinemas.
  // For now, return a placeholder.
  return `Placeholder: List of movies playing near ${input.location}`;
});

export async function recommendFilms(input: RecommendFilmsInput): Promise<RecommendFilmsOutput> {
  return recommendFilmsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFilmsPrompt',
  input: {schema: RecommendFilmsInputSchema},
  output: {schema: RecommendFilmsOutputSchema},
  tools: [getLocalCinemaList],
  prompt: `You are a film connoisseur specializing in uncovering hidden gems and niche cinema that resonate deeply with individual personalities. Your primary goal is to recommend 3 unique, lesser-known films based on a user's detailed personality quiz results.

You MUST prioritize films that are:
- Independent, art-house, cult classics, or foreign films that may not have had wide distribution.
- Rich in artistic value, unique storytelling, strong directorial vision, or cultural depth.
- Highly relevant to the specific nuances of the user's personality profile as revealed in their quiz answers (e.g., high Openness might lead to more experimental films; high Agreeableness to heartwarming but obscure indie dramas).

You MUST AVOID recommending:
- Mainstream blockbusters, current box office hits, or very popular, widely-known movies, UNLESS such a film is an *exceptionally* perfect and non-obvious fit for the user's niche personality profile. The bar for recommending a well-known film is very high.

The user's quiz results (personality scores and movie ratings) are:
{{{quizResults}}}

{{#if previouslyRecommendedTitles}}
Critically, AVOID recommending the following films as they were recently suggested:
{{#each previouslyRecommendedTitles}}
- {{{this}}}
{{/each}}
{{/if}}

For each of the 3 recommendations, provide:
1.  \`title\`: The film's title.
2.  \`genre\`: The specific genre(s), possibly including niche sub-genres.
3.  \`description\`: A concise synopsis highlighting what makes the film unique or noteworthy.
4.  \`why\`: A detailed explanation of *why this specific niche film* is recommended for this user. Directly link your reasoning to their personality traits, movie ratings, or specific answers from the quiz. Explain what makes it a 'hidden gem' for them.

While focusing on niche films, ensure they are generally well-regarded within their circles or have a notable cult following. They should be discoverable (e.g., available on some streaming services, for rent, or in specialty cinemas), even if not widely known.

Use the \`getLocalCinemaList\` tool to check if any of these niche recommendations are surprisingly playing in local cinemas near the user's location: {{{location}}}. If so, highlight this as a special opportunity in the 'why' section.

Format your output as a JSON array of exactly 3 film recommendations. Ensure the film titles are accurate.`,
});

const recommendFilmsFlow = ai.defineFlow(
  {
    name: 'recommendFilmsFlow',
    inputSchema: RecommendFilmsInputSchema,
    outputSchema: RecommendFilmsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
