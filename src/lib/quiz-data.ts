
export interface QuizOption {
  value: string;
  label: string;
}

export interface PersonalitySection {
  id: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  type: 'personality';
  title: string;
  description: string;
  options: QuizOption[]; // User selects one statement that best describes them
}

export interface MovieToRate {
  id: string;
  title: string;
  // posterUrl?: string; // Optional: for displaying movie posters in the quiz
}

export interface MovieRatingSection {
  id: 'movieRatings';
  type: 'movieRating';
  title: string;
  description: string;
  movies: MovieToRate[];
}

export type QuizStepData = PersonalitySection | MovieRatingSection;

export const quizDefinition: QuizStepData[] = [
  {
    id: 'openness',
    type: 'personality',
    title: 'Openness to Experience',
    description: "Let's start with Openness to Experience (linked to a love for creative, unconventional, or thought-provoking films). Select one option that best describes you.",
    options: [
      { value: 'o1', label: 'I love movies that make me think or see the world differently.' },
      { value: 'o2', label: 'I enjoy discovering lesser-known film genres or styles.' },
      { value: 'o3', label: 'I prefer unusual stories over the typical ones.' },
      { value: 'o4', label: "I'm drawn to visually creative or artistic movies." },
      { value: 'o5', label: 'I like exploring philosophical or existential themes in films.' },
      { value: 'o6', label: 'I find complex or non-linear plots fascinating.' },
    ],
  },
  {
    id: 'conscientiousness',
    type: 'personality',
    title: 'Conscientiousness',
    description: 'This trait reflects responsibility, organization, and goal-oriented behavior. Select one option that best describes you.',
    options: [
      { value: 'c1', label: 'I appreciate well-structured plots and clear storytelling.' },
      { value: 'c2', label: 'I prefer movies with a strong moral message or that uphold values.' },
      { value: 'c3', label: "I'm detail-oriented and notice continuity or plot holes." },
      { value: 'c4', label: 'I like films that inspire me to be productive or achieve something.' },
      { value: 'c5', label: 'I finish movies I start, even if I’m not fully enjoying them.' },
      { value: 'c6', label: 'I enjoy films that require focus and attention to subtle details.' },
    ],
  },
  {
    id: 'extraversion',
    type: 'personality',
    title: 'Extraversion',
    description: 'This trait is about sociability, assertiveness, and seeking excitement. Select one option that best describes you.',
    options: [
      { value: 'e1', label: 'I enjoy high-energy, action-packed, or very social movies.' },
      { value: 'e2', label: 'I love watching movies with a group of friends.' },
      { value: 'e3', label: 'I prefer films that are stimulating and exciting from start to finish.' },
      { value: 'e4', label: 'I often talk about movies I’ve seen and enjoy discussing them.' },
      { value: 'e5', label: 'I like movies with charismatic, outgoing protagonists.' },
      { value: 'e6', label: 'I seek out blockbusters and popular, talked-about films.' },
    ],
  },
  {
    id: 'agreeableness',
    type: 'personality',
    title: 'Agreeableness',
    description: 'This trait relates to compassion, cooperation, and empathy. Select one option that best describes you.',
    options: [
      { value: 'a1', label: 'I prefer heartwarming stories and movies with positive resolutions.' },
      { value: 'a2', label: 'I connect deeply with characters and their emotional journeys.' },
      { value: 'a3', label: 'I dislike films with excessive conflict or cruelty.' },
      { value: 'a4', label: 'I enjoy movies that promote cooperation and understanding.' },
      { value: 'a5', label: 'I often feel what the characters are feeling (empathy).' },
      { value: 'a6', label: 'I prefer movies where characters are kind and supportive of each other.' },
    ],
  },
  {
    id: 'neuroticism',
    type: 'personality',
    title: 'Neuroticism (Emotional Stability)',
    description: 'This trait involves sensitivity to stress and negative emotions. Select one option that best describes you in relation to films.',
    options: [
      { value: 'n1', label: 'I am strongly affected by intense or emotionally distressing scenes.' },
      { value: 'n2', label: 'I prefer movies that are lighthearted and avoid heavy topics.' },
      { value: 'n3', label: 'I sometimes find thrillers or horror movies too stressful.' },
      { value: 'n4', label: 'I enjoy films that explore complex emotions, even if challenging.' },
      { value: 'n5', label: 'I often reflect on a movie’s emotional impact long after watching it.' },
      { value: 'n6', label: 'I seek out films that offer comfort or emotional release.' },
    ],
  },
  {
    id: 'movieRatings',
    type: 'movieRating',
    title: 'Movie Ratings',
    description: 'Please rate the following movies on a scale of 1 (Dislike) to 5 (Love). You can skip movies you haven\'t seen or don\'t wish to rate.',
    movies: [
      { id: 'movie_1', title: 'Inception (2010)' },
      { id: 'movie_2', title: 'Parasite (2019)' },
      { id: 'movie_3', title: 'The Shawshank Redemption (1994)' },
      { id: 'movie_4', title: 'Spirited Away (2001)' },
      { id: 'movie_5', title: 'Mad Max: Fury Road (2015)' },
      { id: 'movie_6', title: 'La La Land (2016)' },
    ],
  },
];
