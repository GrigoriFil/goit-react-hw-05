import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieCredits, getImageUrl } from '../../services/tmdbAPI';
import styles from './MovieCast.module.css';

const MovieCast = () => {
    const { movieId } = useParams();
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const defaultImg = 'https://placehold.co/100x150?text=No+Image';

    useEffect(() => {
        if (!movieId) return;

        const getCredits = async () => {
            setLoading(true);
            setError(null);

            try {
                const credits = await fetchMovieCredits(movieId);
                setCast(credits);
            } catch (err) {
                console.error("Failed to fetch movie credits:", err);
                setError('Failed to load cast information.');
            } finally {
                setLoading(false);
            }
        };
        getCredits();
    }, [movieId]);

    if (loading) return <p>Loading cast...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!cast || cast.length === 0) {
        return <p>We don't have any cast information for this movie.</p>
    }
    return (
        <div className={styles.castContainer}>
            <ul className={styles.castList}>
                {cast.map(({ id, profile_path, name, character }) => (
                    <li key={id} className={styles.castItem}>
                        <img
                            src={profile_path ? getImageUrl(profile_path) : defaultImg}
                            alt={`${name} profile`}
                            className={styles.profileImage}
                            onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }} // Заміна на заглушку при помилці
                        />
                        <p className={styles.name}>{name}</p>
                        <p className={styles.character}>Character: {character || 'N/A'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieCast;

