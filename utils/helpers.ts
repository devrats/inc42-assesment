import { Character } from "./interfaces";

export function searchCharacters(
  characters: Character[],
  searchTerm: string,
): Character[] {
  if (!searchTerm.trim()) {
    return characters;
  }
  const term = searchTerm.toLowerCase();
  return characters.filter((character) =>
    character.name?.toLowerCase().includes(term),
  );
}

export function sortCharacters(
  characters: Character[],
  sortBy: keyof Character,
): Character[] {
  let sort = [...characters];
  sort = sort.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (sortBy === "height" || sortBy === "mass") {
			const aNum = parseInt(aVal as string, 10);
			const bNum = parseInt(bVal as string, 10);
			if (isNaN(aNum)) return 1;
			if (isNaN(bNum)) return -1;
      return aNum - bNum;
    }

    return String(aVal).localeCompare(String(bVal));
  });

  return sort;
}

export function filterAndSortCharacters(
  characters: Character[],
  searchTerm: string,
  sortBy: string,
): Character[] {
  let result = searchCharacters(characters, searchTerm);
  result = sortCharacters(result, sortBy as keyof Character);
  return result;
}
