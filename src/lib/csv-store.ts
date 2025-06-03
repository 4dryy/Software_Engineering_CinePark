
// THIS FILE IS FOR DEMONSTRATION PURPOSES ONLY AND USES AN INSECURE CSV-BASED USER STORE.
// DO NOT USE THIS IN A PRODUCTION ENVIRONMENT.
import fs from 'fs/promises';
import path from 'path';
import type { User } from './types';

const USERS_CSV_PATH = path.join(process.cwd(), 'src', 'data', 'users.csv');
const USERS_CSV_PATH_TEMP = path.join(process.cwd(), 'src', 'data', 'users.csv.tmp');
const DATA_DIR_PATH = path.dirname(USERS_CSV_PATH);

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR_PATH);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`Data directory not found. Creating: ${DATA_DIR_PATH}`);
      try {
        await fs.mkdir(DATA_DIR_PATH, { recursive: true });
        console.log(`Data directory created: ${DATA_DIR_PATH}`);
      } catch (dirError) {
        console.error('Fatal: Failed to create data directory:', dirError);
        throw new Error('Failed to create data directory.');
      }
    } else {
      console.error('Fatal: Error accessing data directory:', error);
      throw new Error('Error accessing data directory.');
    }
  }
}

// Basic CSV parsing
function parseCSV(csvString: string): Record<string, string>[] {
  const lines = csvString.trim().split('\n');
  if (lines.length === 0) return [];

  const headerLine = lines.shift(); // Get and remove header line
  if (!headerLine) return [];

  const headers = headerLine.split(',');
  const numHeaders = headers.length;

  return lines.map(line => {
    if (!line.trim()) return null; // Skip empty lines

    const parts = line.split(',');
    const obj: Record<string, string> = {};

    for (let i = 0; i < numHeaders - 1; i++) {
      obj[headers[i]] = parts[i] || '';
    }

    if (numHeaders > 0) {
      obj[headers[numHeaders - 1]] = parts.slice(numHeaders - 1).join(',') || '';
    }
    
    return obj;
  }).filter(obj => obj !== null) as Record<string, string>[];
}

function toCSVString(users: User[]): string {
  const headers = ['id', 'email', 'password', 'name', 'quizResults'];
  const headerString = headers.join(',');
  
  const lines = users.map(user => {
    return headers.map(header => {
      const value = user[header as keyof User];
      return value === undefined || value === null ? '' : String(value);
    }).join(',');
  });
  return `${headerString}\n${lines.join('\n')}\n`;
}


export async function readUsers(): Promise<User[]> {
  await ensureDataDir(); // Ensure directory exists before read attempt

  try {
    const data = await fs.readFile(USERS_CSV_PATH, 'utf-8');
    const parsedData = parseCSV(data);
    return parsedData.map(item => ({
      id: item.id,
      email: item.email,
      password: item.password,
      name: item.name,
      quizResults: item.quizResults || '', // Ensure quizResults is at least an empty string
    }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`Users file not found. Creating: ${USERS_CSV_PATH}`);
      try {
        // Create an empty file with headers
        await fs.writeFile(USERS_CSV_PATH, 'id,email,password,name,quizResults\n', 'utf-8');
        console.log(`Users file created: ${USERS_CSV_PATH}`);
        return []; // Return empty array as the file is new
      } catch (initError) {
        console.error('Fatal: Failed to initialize users.csv:', initError);
        throw new Error('Failed to initialize users.csv.');
      }
    }
    console.error('Error reading users.csv:', error);
    // Consider if you should throw or return empty for other read errors
    // For now, returning empty to prevent crashes, but logging is important.
    return [];
  }
}

export async function writeUsers(users: User[]): Promise<void> {
  await ensureDataDir(); // Ensure directory exists before write attempt

  const csvString = toCSVString(users);
  try {
    // Atomic write: write to temp file first, then rename
    await fs.writeFile(USERS_CSV_PATH_TEMP, csvString, 'utf-8');
    await fs.rename(USERS_CSV_PATH_TEMP, USERS_CSV_PATH);
    // console.log(`Users data written successfully to ${USERS_CSV_PATH}`);
  } catch (error) {
    console.error('Fatal: Failed to write users.csv:', error);
    try {
      // Attempt to clean up temp file if rename failed or writeFile failed and temp exists
      await fs.stat(USERS_CSV_PATH_TEMP); 
      await fs.unlink(USERS_CSV_PATH_TEMP);
      console.log("Cleaned up temporary file: ", USERS_CSV_PATH_TEMP);
    } catch (cleanupError: any) {
      if (cleanupError.code !== 'ENOENT') { // Ignore if temp file doesn't exist
        console.error('Error during cleanup of temp users.csv.tmp:', cleanupError);
      }
    }
    throw new Error('Could not update user data due to a write error.');
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find(user => user.email === email);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find(user => user.id === id);
}

export async function addUser(newUser: User): Promise<User> {
  const users = await readUsers();
  if (users.find(user => user.email === newUser.email)) {
    throw new Error('User with this email already exists.');
  }
  const userToAdd = { ...newUser, quizResults: newUser.quizResults || '' };
  users.push(userToAdd);
  await writeUsers(users);
  return userToAdd;
}

export async function updateUser(updatedUser: User): Promise<User | undefined> {
  let users = await readUsers();
  const userIndex = users.findIndex(user => user.id === updatedUser.id);
  if (userIndex === -1) {
    console.warn(`Attempted to update non-existent user with ID: ${updatedUser.id}`);
    return undefined; 
  }
  users[userIndex] = { 
    ...users[userIndex], 
    ...updatedUser, 
    quizResults: typeof updatedUser.quizResults === 'string' 
                   ? updatedUser.quizResults 
                   : (users[userIndex].quizResults || '') // Ensure it's a string
  };
  await writeUsers(users);
  return users[userIndex];
}
