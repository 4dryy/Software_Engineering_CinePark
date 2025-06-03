
export interface User {
  id: string;
  email: string;
  password?: string; // Password should not be sent to client
  name: string;
  quizResults?: string; // JSON string of DetailedQuizAnswers
}

// Old QuizAnswers structure - keeping for reference or potential future merging
export interface LegacyQuizAnswers {
  genres: string[];
  mood: string;
  actors: string;
  directors: string;
  lookingFor: string;
}

// New Detailed Quiz Answer Structure
export interface PersonalityScores {
  openness?: string;
  conscientiousness?: string;
  extraversion?: string;
  agreeableness?: string;
  neuroticism?: string;
}

export interface MovieRatingInput {
  movieId: string; // Corresponds to MovieToRate.id
  title: string;
  rating?: number; // 1-5, optional if skipped
}

export interface DetailedQuizAnswers {
  personalityScores: PersonalityScores;
  movieRatings: MovieRatingInput[];
  // Optionally, include old fields if we add a step for them:
  // legacyPreferences?: LegacyQuizAnswers;
}


// Types for AI Film Recommendations (based on current AI flow)
// This will likely need to be updated when AI flow consumes DetailedQuizAnswers
export interface FilmRecommendation {
  title: string;
  genre: string;
  description: string;
  why: string;
}

export interface LocalFilmRecommendation {
 films: string[];
}
