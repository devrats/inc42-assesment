import { Character } from "@/utils/interfaces";

const API_BASE = "https://swapi.py4e.com/api";
const CACHE_TTL = 3600000;
const cache = new Map<string, { data: unknown; timestamp: number }>();
const pendingRequests = new Map<string, Promise<unknown>>();
const characterUpdates = new EventTarget();

export function subscribeToCharacter(url: string, callback: () => void) {
  const eventName = `character:${url}`;
  const handler = () => callback();
  characterUpdates.addEventListener(eventName, handler);
  return () => {
    characterUpdates.removeEventListener(eventName, handler);
  };
}

function emitCharacterUpdate(url: string): void {
  characterUpdates.dispatchEvent(new Event(`character:${url}`));
}

async function fetchUrl<T>(url: string): Promise<T | null> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url) as Promise<T>;
  }
  const request = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    })
    .then((data) => {
      cache.set(url, { data, timestamp: Date.now() });
      return data;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    })
    .finally(() => {
      pendingRequests.delete(url);
    });

  pendingRequests.set(url, request);
  return request;
}


async function getNamesFromUrls(urls?: string[]): Promise<string[]> {
  if (!urls || urls.length === 0) return [];
  const results = await Promise.all(
    urls.map((url) =>
      fetchUrl<{ name?: string; title?: string }>(url)
    )
  );
  return results.map((item) => {
    if (!item) return "None";
    return item.title || item.name || "None";
  });
}

async function getAllData(character: Character): Promise<void> {
  try {
    if (character.homeworld) {
      const homeworld = await fetchUrl<{ name?: string }>(
        character.homeworld
      );
      character.homeworldName = homeworld?.name || "None";
    }
    character.filmNames = await getNamesFromUrls(character.films);
    character.speciesNames = await getNamesFromUrls(character.species);
    character.vehicleNames = await getNamesFromUrls(character.vehicles);
    character.starshipNames = await getNamesFromUrls(character.starships);
  } catch (error) {
    console.error("Error enriching character:", error);
  } finally {
    character.loading = false;
    emitCharacterUpdate(character.url);
  }
}

export async function fetchRelatedData(
  characters: Character[],
): Promise<Character[]> {
  const updatedCharacters = characters.map((char) => ({
    ...char,
    filmNames: [],
    speciesNames: [],
    vehicleNames: [],
    starshipNames: [],
    homeworldName: "",
    loading: true,
  }));

  updatedCharacters.forEach((char) => {
    getAllData(char);
  });

  return updatedCharacters;
}

export async function fetchCharacters(page: number = 1): Promise<{ characters: Character[]; count: number }> {
  try {
    const response = await fetch(`${API_BASE}/people/?page=${page}`);
    if (!response.ok) throw new Error("Failed to fetch characters");
    const data = await response.json();
    const characters = await fetchRelatedData(data.results);
    return { characters, count: data.count };
  } catch (error) {
    console.error("Error fetching characters:", error);
    return { characters: [], count: 0 };
  }
}

export async function fetchAllCharacters(page: number = 1): Promise<{ characters: Character[]; count: number }> {
  return fetchCharacters(page);
}
