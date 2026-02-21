'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';

const HeaderToolbar = ({
  view,
  setView,
  searchInput,
  setSearchInput,
  sortBy,
  setSortBy,
}: {
  view: string;
  setView: (value: string) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}) => {
  return (
    <AppBar position="static" color="inherit" elevation={0} className="navbar-border">
        <Toolbar>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="text-bold">Characters</Typography>
          <div className="toolbar-spacer" />
          <div className="controls">
            <TextField
              size="small"
              label="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button variant="contained" color="success" startIcon={<FilterListIcon />} className="text-bold">
              Filter
            </Button>
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Sort By: Name</MenuItem>
              <MenuItem value="height">Sort By: Height</MenuItem>
              <MenuItem value="mass">Sort By: Mass</MenuItem>
              <MenuItem value="birth_year">Sort By: Birth Year</MenuItem>
            </Select>
            <Button variant="outlined" startIcon={<DownloadIcon />} className="text-bold">
              Export
            </Button>
            <Select 
              size="small"
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <MenuItem value="list">List View</MenuItem>
              <MenuItem value="card">Card View</MenuItem>
            </Select>
          </div>
        </Toolbar>
      </AppBar>
  );
};

export default HeaderToolbar;