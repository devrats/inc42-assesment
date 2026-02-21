'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HeaderToolbar from '@/components/HeaderToolbar';
import { CardComponent } from '@/components/cardComponent';
import { ListComponent } from '@/components/listComponent';
import { fetchAllCharacters } from '@/services/api';
import { filterAndSortCharacters } from '@/utils/helpers';
import { Character } from '@/utils/interfaces';

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [view, setView] = useState<string>('list');
  const [searchInput, setSearchInput] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  let debounceTimer: NodeJS.Timeout | undefined;

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        const result = await fetchAllCharacters(currentPage);
        setCharacters(result.characters);
        setTotalCount(result.count);
        const filtered = filterAndSortCharacters(result.characters, searchInput, sortBy);
        setFilteredCharacters(filtered);
      } catch (err) {
        setError('Failed to load characters. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const result = filterAndSortCharacters(characters, value, sortBy);
      setFilteredCharacters(result);
      setCurrentPage(1);
    }, 300);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const result = filterAndSortCharacters(characters, searchInput, value);
    setFilteredCharacters(result);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography>Loading characters...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <p>{error}</p>
      </Box>
    );
  }

  return (
    <>
      <HeaderToolbar 
        view={view} 
        setView={setView}
        searchInput={searchInput}
        setSearchInput={handleSearchChange}
        sortBy={sortBy}
        setSortBy={handleSortChange}
      />
      <div className="page-container">

        {view === 'card' ? (
          <div className="page-content">
            {filteredCharacters.map((character: Character) => (
              <CardComponent key={character.name} character={character} />
            ))}
          </div>
        ) : (
          <div className="page-content-list">
            <ListComponent characters={filteredCharacters} />
          </div>
        )}

        <div className="pagination-bottom">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <Typography className="pagination-page-text">
            Page {currentPage} of {totalPages}
          </Typography>
          
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
