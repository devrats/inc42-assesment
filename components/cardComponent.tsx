'use client';

import { Character } from '@/utils/interfaces';
import {
  Typography,
  Button,
  Card,
  Checkbox,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useState, useEffect } from 'react';
import { subscribeToCharacter } from '@/services/api';

export function CardComponent({ character }: { character: Character }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [addedToList, setAddedToList] = useState<boolean>(false);
  const [, setRerender] = useState<number>(0);

  useEffect(() => {
    return subscribeToCharacter(character.url, () => setRerender(prev => prev + 1));
  }, [character.url]);

  return (
    <Card className="card-container">
      <Avatar className="card-avatar">
        {character.name?.charAt(0)}
      </Avatar>

      <Checkbox
        checked={selected}
        onChange={(e) => setSelected(e.target.checked)}
        className="card-checkbox"
      />

      <Box className="card-content">
        <Box className="card-header">
          <Box className="name-box">
            <Typography variant="subtitle1" className="card-title">
              {character.name}
            </Typography>
            <Chip
              label={character.speciesNames && character.speciesNames.length > 0 ? character.speciesNames[0] : 'None'}
              size="small"
              variant="outlined"
            />
						<Chip
              label={2}
              size="small"
              variant="outlined"
            />
						<Chip
              label={character.homeworldName}
              size="small"
              variant="outlined"
            />
          </Box>
          <Button
            size="small"
            startIcon={addedToList ? <StarIcon /> : <StarOutlineIcon />}
            onClick={() => setAddedToList(!addedToList)}
          >
            Add to List
          </Button>
        </Box>

        <Box className="card-meta">
          <Typography variant="body2">Height: {character.height || ''}</Typography>
          <Typography variant="body2">Mass: {character.mass || ''}</Typography>
          <Typography variant="body2">{character.birth_year || ''}</Typography>
        </Box>

        <Typography variant="body2" className="card-bio">
          No detailed bio available for this character in the current database archives.
        </Typography>

        <Box className="card-grid">
          <Box className="card-grid-item">
            <Typography variant="caption" className="card-grid-label">
              FILMS
            </Typography>
            <Typography variant="body2">
              {character.loading ? 'Loading...' : (character.filmNames?.[0] || 'None')}
            </Typography>
            {character.filmNames && character.filmNames.length > 1 && (
              <Typography variant="body2" className="card-field-more">
                +{character.filmNames.length - 1} more
              </Typography>
            )}
          </Box>

          <Box className="card-grid-item">
            <Typography variant="caption" className="card-grid-label">
              VEHICLES
            </Typography>
            <Typography variant="body2">
              {character.loading ? 'Loading...' : (character.vehicleNames?.[0] || 'None')}
            </Typography>
            {character.vehicleNames && character.vehicleNames.length > 1 && (
              <Typography variant="body2" className="card-field-more">
                +{character.vehicleNames.length - 1} more
              </Typography>
            )}
          </Box>

          <Box className="card-grid-item">
            <Typography variant="caption" className="card-grid-label">
              STARSHIPS
            </Typography>
            <Typography variant="body2">
              {character.loading ? 'Loading...' : (character.starshipNames?.[0] || 'None')}
            </Typography>
            {character.starshipNames && character.starshipNames.length > 1 && (
              <Typography variant="body2" className="card-field-more">
                +{character.starshipNames.length - 1} more
              </Typography>
            )}
          </Box>

          <Box className="card-grid-item">
            <Typography variant="caption" className="card-grid-label">
              SPECIES
            </Typography>
            <Typography variant="body2">
              {character.loading ? 'Loading...' : (character.speciesNames?.[0] || 'None')}
            </Typography>
          </Box>
        </Box>

        <Box className="card-actions">
          <Button
            size="small"
            className="card-show-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less ▲' : 'Show More ▼'}
          </Button>
          <Typography variant="caption" className="card-updated-time">
            Updated: 2s ago
          </Typography>
        </Box>

        {expanded && (
          <Box className="card-expanded">
            <Box>
              <Typography variant="subtitle2" className="card-expanded-title">
                Films
              </Typography>
              {character.loading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : character.filmNames && character.filmNames.length > 0 ? (
                <Box className="card-expanded-chips">
                  {character.filmNames.map((film: string, index: number) => (
                    <Chip key={index} label={film} size="small" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">None</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" className="card-expanded-title">
                Vehicles
              </Typography>
              {character.loading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : character.vehicleNames && character.vehicleNames.length > 0 ? (
                <Box className="card-expanded-chips">
                  {character.vehicleNames.map((vehicle: string, index: number) => (
                    <Chip key={index} label={vehicle} size="small" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">None</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" className="card-expanded-title">
                Starships
              </Typography>
              {character.loading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : character.starshipNames && character.starshipNames.length > 0 ? (
                <Box className="card-expanded-chips">
                  {character.starshipNames.map((starship: string, index: number) => (
                    <Chip key={index} label={starship} size="small" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">None</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" className="card-expanded-title">
                Species
              </Typography>
              {character.loading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : character.speciesNames && character.speciesNames.length > 0 ? (
                <Box className="card-expanded-chips">
                  {character.speciesNames.map((species: string, index: number) => (
                    <Chip key={index} label={species} size="small" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">None</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}
