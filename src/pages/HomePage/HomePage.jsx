import { useState, useEffect } from 'react';
import { fetchTrendingMovies } from '../../services/tmdbAPI';
import MovieList from '../../components/MovieList/MovieList';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTrendingMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const trendingMovies = await fetchTrendingMovies();
        setMovies(trendingMovies);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
        setError('Failed to load trending movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getTrendingMovies();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trending today</h1>
      {loading && <p>Loading movies...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && <MovieList movies={movies} />}
    </div>
  );
};

export default HomePage;