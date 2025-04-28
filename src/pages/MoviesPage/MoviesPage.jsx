import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../services/tmdbAPI";
import MovieList from "../../components/MovieList/MovieList";
import styles from './MoviesPage.module.css';

const MoviesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') ?? '');

    useEffect(() => {
        const query = searchParams.get('query');

        if (!query) {
            setMovies([]);
            return;
        }

        const getMovies = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const results = await searchMovies(query);
                setMovies(results);

                if (results.length === 0) {
                    setError(`No movies found for "${query}".`);
                }
            } catch (err) {
                console.error("Failed to search movies:", err);
                setError('Failed to search movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, [searchParams]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const query = event.target.elements.query.value.trim();

        if (query === '') {
            setSearchParams({});
            return;
        }
        setSearchParams({ query: query });
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
                <input type="text" name="query" value={searchQuery} onChange={handleInputChange} placeholder="Search movies..." className={styles.input} autoComplete="off" autoFocus />
                <button type="submit" className={styles.button}>Search</button>
            </form>

            {loading && <p>Searching movies...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && movies.length > 0 && <MovieList movies={movies} />}
        </div>
    );
};

export default MoviesPage;