import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  SelectChangeEvent,
} from "@mui/material";
import useSWR from "swr";
import './App.css';

type Filters = {
  page: string;
  pageSize: string;
  title: string;
  genre: string;
  rating: number;
  year: number;
  director: string;
  actor: string;
}

const App = () => {
  const [filters, setFilters] = useState<Filters>({
    page: '0',
    pageSize: '10',
    title: '',
    genre: '',
    rating: 0,
    year: 1900,
    director: '',
    actor: ''
  });

  const { data: movies, error, isLoading } = useSWR(
    `http://localhost:5196/api/movies?${new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters)
          .filter(([, value]) => !!value)
          .map(([key, value]) => [key, value.toString()])
      )
    ).toString()}`,
    async (url) => {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    }
  );

  const handleInput = (e:
    React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement>
    | SelectChangeEvent<string>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };


  if (error) return <div>{JSON.stringify(error, null, 4)}</div>

  function handleProps<T>(name: keyof typeof filters) {
    return {
      name,
      value: filters[name] as T,
      onChange: handleInput
    }
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 5 },

      backgroundColor: '#f5f5f5'

    }}>
      <Box sx={{
        p: { xs: 2, md: 5 }, borderRadius: 2,
      }}>
        <Typography variant="h4" align="center" gutterBottom>
          Movie Search & Filters
        </Typography>

        {/* Search Inputs */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Movies"
              variant="outlined"
              {...handleProps('title')}
              sx={{ mb: { xs: 2, md: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Director"
              variant="outlined"
              {...handleProps('director')}
              sx={{ mb: { xs: 2, md: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Actor"
              variant="outlined"
              {...handleProps('actor')}
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Genre</InputLabel>
              <Select
                name="genre"
                value={filters.genre}
                onChange={handleInput}
                label="Genre">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Action">Action</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Horror">Horror</MenuItem>
                <MenuItem value="Romance">Romance</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Page size</InputLabel>
              <Select
                name="pageSize"
                value={filters.pageSize}
                onChange={handleInput}
                label="Page size">
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography gutterBottom>Rating</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
              value={filters.rating}
              onChange={(e, value) => setFilters({ ...filters, rating: value as number })}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography gutterBottom>Year</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={2000}
              max={2024}
              step={1}
              value={filters.year}
              onChange={(e, value) => setFilters({ ...filters, year: value as number })}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Movie Cards or Loading */}
        <Grid container spacing={3}>
          {isLoading ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '50vh',  // Set minimum height for the loading screen
                  width: '100%',
                }}
              >
                <Typography variant="h6" align="center">
                  Loading...
                </Typography>
              </Box>
            </Grid>
          ) : (
            movies.map((movie: {
              title: string;
              genre: string;
              rating: number;
              year: number;
            }, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: '0.3s',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {movie.title}
                    </Typography>
                    <Typography color="textSecondary">
                      Genre: {movie.genre}
                    </Typography>
                    <Typography color="textSecondary">
                      Rating: {movie.rating.toFixed(1)}
                    </Typography>
                    <Typography color="textSecondary">
                      Year: {movie.year}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default App;