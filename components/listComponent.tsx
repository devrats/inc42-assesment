'use client';

import { Character } from '@/utils/interfaces';
import {
  Button,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useState } from 'react';

export function ListComponent({ characters }: { characters: Character[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (url: string) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === characters.length) {
      setSelected([]);
    } else {
      setSelected(characters.map((c: Character) => c.url));
    }
  };

  return (
    <Table className="list-table">
      <TableHead className="list-table-head">
        <TableRow>
          <TableCell className="list-table-header-cell">
            <Checkbox
              checked={
                characters.length > 0 &&
                selected.length === characters.length
              }
              indeterminate={
                selected.length > 0 && selected.length < characters.length
              }
              onChange={toggleSelectAll}
            />
          </TableCell>
          <TableCell className="list-table-header-cell">CHARACTER</TableCell>
          <TableCell className="list-table-header-cell">HEIGHT</TableCell>
          <TableCell className="list-table-header-cell">MASS</TableCell>
          <TableCell className="list-table-header-cell">BIRTH YEAR</TableCell>
          <TableCell className="list-table-header-cell">GENDER</TableCell>
          <TableCell className="list-table-header-cell">ACTIONS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {characters.map((character: Character) => (
          <TableRow key={character.url}>
            <TableCell className="list-table-checkbox-cell">
              <Checkbox
                checked={selected.includes(character.url)}
                onChange={() => toggleSelect(character.url)}
              />
            </TableCell>
            <TableCell className="list-table-body-cell">{character.name}</TableCell>
            <TableCell className="list-table-body-cell">{character.height} cm</TableCell>
            <TableCell className="list-table-body-cell">{character.mass} kg</TableCell>
            <TableCell className="list-table-body-cell">{character.birth_year}</TableCell>
            <TableCell className="list-table-body-cell">{character.gender}</TableCell>
            <TableCell className="list-table-body-cell">
              <Button size="small" variant="outlined">
                View Profile
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
