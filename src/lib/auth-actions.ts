
'use server';
// THIS FILE IS FOR DEMONSTRATION PURPOSES ONLY AND USES AN INSECURE CSV-BASED USER STORE
// AND PLAINTEXT PASSWORD COMPARISON. DO NOT USE THIS IN A PRODUCTION ENVIRONMENT.

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addUser, getUserByEmail, getUserById } from './csv-store';
import type { User, DetailedQuizAnswers } from './types';
import { v4 as uuidv4 } from 'uuid'; // For generating user IDs

const SESSION_COOKIE_NAME = 'cinematch_session'; 

// --- Schemas ---
const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const SignupSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


// --- Session Management ---
export async function createSession(userId: string) {
  cookies().set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });
}

export async function getSessionUserId(): Promise<string | undefined> {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}

export async function getCurrentUser(): Promise<(Omit<User, 'quizResults'> & { quizResults?: DetailedQuizAnswers | string | null }) | null> {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    return null;
  }

  try {
    const userFromDb = await getUserById(sessionUserId);

    if (!userFromDb) {
      // User ID in session cookie, but user not in DB (e.g., deleted, or DB error).
      // AppLayout will handle calling logout() to clear the cookie and redirect.
      return null;
    }

    const { password, quizResults: quizResultsString, ...userWithoutPassword } = userFromDb;
    
    let parsedQuizResults: DetailedQuizAnswers | string | null = quizResultsString || null;

    if (quizResultsString && typeof quizResultsString === 'string' && quizResultsString.trim() !== '') {
      try {
        parsedQuizResults = JSON.parse(quizResultsString) as DetailedQuizAnswers;
      } catch (e) {
        console.error("Failed to parse quiz results in getCurrentUser, returning raw string:", e);
        // Keep parsedQuizResults as the original string if parsing fails, Profile page can show raw data.
        parsedQuizResults = quizResultsString; 
      }
    } else if (quizResultsString === '' || quizResultsString === null) {
        parsedQuizResults = null; // Explicitly null if empty or actually null
    }


    return { ...userWithoutPassword, quizResults: parsedQuizResults };

  } catch (error) {
    console.error('Error fetching current user in getCurrentUser:', error);
    // AppLayout will handle logout if this function returns null
    return null; 
  }
}


export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/landing');
}

// --- Authentication Actions ---
export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) { 
      return { message: 'Invalid email or password.' };
    }

    await createSession(user.id);
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
  redirect('/dashboard');
}


export async function signup(prevState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password, 
      quizResults: '', // Initialize with empty string for quiz results
    };

    const createdUser = await addUser(newUser);
    await createSession(createdUser.id);
    
  } catch (error) {
     if (error instanceof Error && error.message === 'User with this email already exists.') {
        return { message: error.message };
    }
    console.error('Signup error:', error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
  redirect('/dashboard');
}

