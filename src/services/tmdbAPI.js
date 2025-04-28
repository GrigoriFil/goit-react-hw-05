import axios from "axios";

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNiYWViNWY5MWNlN2JkZGQ5ZGFlYTI0NTFhOTQxMiIsIm5iZiI6MTc0NTY2NTA1OS40MDcsInN1YiI6IjY4MGNiYzIzM2M3MThlOGM1NTM3N2E2MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MGJ28e2Sre3RemrKgin_dS6YsfTZmvTn3qchYrXRzLQ';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const options = {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    accept: 'application/json',
  },
  timeout: 5000
};

export const fetchTrendingMovies = async () => {
    const response = await axios.get(`${BASE_URL}/trending/movie/day`, options);
    return response.data.results;
};

export const searchMovies = async (query) => {
    const response = await axios.get(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, options);
    return response.data.results
};

export const fetchMovieDetails = async (movieId) => {
  if (!movieId) {
      console.error("fetchMovieDetails called with invalid movieId:", movieId);
      throw new Error("Invalid movie ID provided to fetchMovieDetails");
  }
  console.log(`API call: fetching details for ${movieId}`);
  try {
     const response = await axios.get(`${BASE_URL}/movie/${movieId}`, options);
     return response.data;
  } catch (error) {
     console.error(`API Error fetching movie ${movieId}:`, error.response?.data || error.message);
     throw error;
  }
};

export const fetchMovieCredits = async (movieId) => {
  if (!movieId) {
    console.error("fetchMovieCredits called with invalid movieId:", movieId);
    throw new Error("Invalid movie ID provided to fetchMovieCredits");
  }
  console.log(`API call: fetching credits for ${movieId}`);
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, options);
    return response.data.cast;
  } catch (error) {
    console.error(`API Error fetching credits for movie ${movieId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchMovieReviews = async (movieId) => {
  if (!movieId) {
    console.error("fetchMovieReviews called with invalid movieId:", movieId);
    throw new Error("Invalid movie ID provided to fetchMovieReviews");
  }
   console.log(`API call: fetching reviews for ${movieId}`);
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/reviews`, options);
    return response.data.results;
  } catch (error) {
    console.error(`API Error fetching reviews for movie ${movieId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const getImageUrl = (path) => {
    if (path && typeof path === 'string') {
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${IMAGE_BASE_URL}/${cleanPath}`;
    }
    return null;
};