
// src/services/cinema-service.ts
import fs from 'fs/promises';
import path from 'path';

const BARCELONA_FILMS_CSV_PATH = path.join(process.cwd(), 'src', 'data', 'barcelona_films.csv');

export interface LocalFilmData {
  title: string;
  characteristics: string;
  cinemaName: string;
  cinemaLocation: string;
}

/**
 * Parses a single line of CSV text, attempting to respect quotes.
 * @param line - A string representing a single line from a CSV file.
 * @returns An array of strings, where each string is a field from the CSV line.
 */
function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                currentField += '"';
                i++; 
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            fields.push(currentField.trim());
            currentField = '';
        } else {
            currentField += char;
        }
    }
    fields.push(currentField.trim());
    return fields;
}


export async function getCinemaMovies(location: string): Promise<LocalFilmData[]> {
  if (location && location.toLowerCase().includes('barcelona')) {
    console.log(`Fetching cinema movies for Barcelona from CSV: ${BARCELONA_FILMS_CSV_PATH}`);
    try {
      const fileContent = await fs.readFile(BARCELONA_FILMS_CSV_PATH, 'utf-8');
      const lines = fileContent.trim().split('\n');

      if (lines.length === 0) {
        console.log(`CSV file is empty: ${BARCELONA_FILMS_CSV_PATH}`);
        return [];
      }

      const headerLine = lines.shift(); 
      if (!headerLine || lines.length === 0) {
        console.log(`CSV file only contains a header or is empty after removing header: ${BARCELONA_FILMS_CSV_PATH}`);
        return [];
      }
      
      const films: LocalFilmData[] = [];
      for (const line of lines) {
        if (!line.trim()) continue; 
        
        const fields = parseCsvLine(line);
        if (fields.length >= 4) { 
          films.push({
            title: fields[0],
            characteristics: fields[1],
            cinemaName: fields[2],
            cinemaLocation: fields[3],
          });
        } else {
          console.warn(`Could not parse all fields from CSV line: "${line}" in ${BARCELONA_FILMS_CSV_PATH}. Expected 4 fields, got ${fields.length}.`);
        }
      }
      
      console.log(`Successfully parsed ${films.length} film entries from ${BARCELONA_FILMS_CSV_PATH}`);
      return films;

    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn(`Barcelona films file not found: ${BARCELONA_FILMS_CSV_PATH}. Returning empty list.`);
      } else {
        console.error(`Error reading or parsing ${BARCELONA_FILMS_CSV_PATH}:`, error);
      }
      return [];
    }
  }

  console.log(`Mock Service: No specific CSV for location: ${location}. Returning default mock list.`);
  await new Promise(resolve => setTimeout(resolve, 300)); 
  return [
    { title: "Generic Movie Title 1", characteristics: "Comedy, Family", cinemaName: "Mock Cinema Plex A", cinemaLocation: "123 Fake St, Mocktown" },
    { title: "Another Film Adventure", characteristics: "Action, Sci-Fi", cinemaName: "Mock Cinema Plex B", cinemaLocation: "456 Other Ave, Mockcity" },
    { title: "The Third Movie Option", characteristics: "Drama, Romance", cinemaName: "Indie Mock House", cinemaLocation: "789 Any Rd, Mockville" },
  ];
}
