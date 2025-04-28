import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useLocation, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl } from '../../services/tmdbAPI';
import styles from './MovieDetailsPage.module.css';
import clsx from 'clsx';

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('Movie ID from params:', movieId);

  const backLinkHref = useRef(location.state?.from ?? '/movies');
  const defaultPosterImg = 'https://via.placeholder.com/300x450?text=Poster+Not+Available';

  useEffect(() => {

    if (!movieId) {
      console.error("Movie ID is undefined, cannot fetch details.");
      setError("Cannot load details: Movie ID is missing.");
      setLoading(false);
      return;
    }

    const getDetails = async () => {
      setLoading(true);
      setError(null);
      setMovie(null);
      try {
        console.log(`Workspaceing details for movieId: ${movieId}`);
        const details = await fetchMovieDetails(movieId);
        setMovie(details);
      } catch (err) {
        console.error(`Failed to fetch movie details for ID ${movieId}:`, err);
        if (err.response && err.response.status === 404) {
             setError(`Movie with ID ${movieId} not found.`);
        } else {
             setError('Failed to load movie details. Check connection or API key.');
        }
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [movieId]);

  const handleGoBack = () => {
    navigate(backLinkHref.current);
  };

  const formatScore = (score) => (score ? `${Math.round(score * 10)}%` : 'N/A');
  const formatGenres = (genres) => (genres?.length > 0 ? genres.map((g) => g.name).join(', ') : 'No genres listed');
  const getReleaseYear = (date) => (date ? date.substring(0, 4) : 'N/A');

  const buildLinkClass = ({ isActive }) => clsx(styles.detailsLink, isActive && styles.activeDetailsLink);

    if (loading) return <p>Loading movie details...</p>;
    
  if (error) return <p className={styles.error}>{error}</p>;

  if (!movie && !error) return <p>Movie details not available.</p>;

  return (
    <div className={styles.container}>
      <button onClick={handleGoBack} className={styles.backButton}>
        &larr; Go back
      </button>

      {movie && (
          <>
            <div className={styles.detailsContainer}>
              <img
                src={movie.poster_path ? getImageUrl(movie.poster_path) : defaultPosterImg}
                alt={movie.title ? `${movie.title} poster` : 'Movie poster'}
                className={styles.poster}
                onError={(e) => { e.target.onerror = null; e.target.src=defaultPosterImg; }}
              />
              <div className={styles.info}>
                <h1>{movie.title || 'Title unavailable'} ({getReleaseYear(movie.release_date)})</h1>
                <p>User Score: {formatScore(movie.vote_average)}</p>
                <h2>Overview</h2>
                <p>{movie.overview || 'No overview available.'}</p>
                <h2>Genres</h2>
                <p>{formatGenres(movie.genres)}</p>
              </div>
            </div>

            <div className={styles.additionalInfo}>
              <h3>Additional information</h3>
              <ul className={styles.detailsNav}>
                <li>
                  <NavLink to="cast" state={{ from: backLinkHref.current }} className={buildLinkClass}>
                    Cast
                  </NavLink>
                </li>
                <li>
                  <NavLink to="reviews" state={{ from: backLinkHref.current }} className={buildLinkClass}>
                    Reviews
                  </NavLink>
                </li>
              </ul>
            </div>

            <Suspense fallback={<div>Loading section...</div>}>
              <Outlet />
            </Suspense>
          </>
      )}
    </div>
  );
};

export default MovieDetailsPage;