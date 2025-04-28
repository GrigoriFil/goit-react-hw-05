// src/components/MovieList/MovieList.jsx
import { Link, useLocation } from 'react-router-dom';
import styles from './MovieList.module.css';
import { getImageUrl } from '../../services/tmdbAPI';

const MovieList = ({ movies }) => {
  const location = useLocation();
  const defaultPosterImg = 'https://placehold.co/180x270?text=No+Image';

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {movies.map((movie) => {
        if (!movie || typeof movie.id === 'undefined') {
          console.warn("Movie object or movie.id is undefined, skipping render:", movie);
          return null;
        }
        console.log(`Creating link for movie ID: ${movie.id}`);

        return (
          <li key={movie.id} className={styles.listItem}>
            <Link to={`/movies/${movie.id}`} state={{ from: location }} className={styles.link}>
              <img
                src={movie.poster_path ? getImageUrl(movie.poster_path) : defaultPosterImg}
                alt={movie.title || movie.name || 'Movie poster'}
                className={styles.poster}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultPosterImg; }}
              />
            </Link>
             <p className={styles.movieTitle}>{movie.title || movie.name}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default MovieList;