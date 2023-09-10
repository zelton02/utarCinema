const fetch = require('node-fetch');

const TMDB_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OWQ3NzY3ZDU1MDQwMTk1ZmU3N2VhM2RkMTEyNjc2YyIsInN1YiI6IjY0ZmM3NzkxZGMxY2I0MDBjOGJmZDc3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0fLRCA1F77nt113s9AmvrKuW8TFawfyLy--qId_vzoo'; // Replace with your TMDb API key

const fetchUpcomingMovies = async () => {
  const url =
    'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
};

const fetchNowPlayingMovies = async () => {
  const url =
    'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
};
