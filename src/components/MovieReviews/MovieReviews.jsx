import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieReviews } from '../../services/tmdbAPI';
import styles from './MovieReviews.module.css';

const MovieReviews = () => {
    const { movieId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!movieId) return;

        const getReviews = async () => {
            setLoading(true);
            setError(null);

            try {
                const MovieReviews = await fetchMovieReviews(movieId);
                setReviews(MovieReviews);
            } catch (err) {
                console.error("Failed to fetch movie reviews:", err);
                setError('Failed to load reviews.');
            } finally {
                setLoading(false);
            }
        };

        getReviews();
    }, [movieId]);

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!reviews || reviews.length === 0) {
        return <p>We don't have any reviews for this movie.</p>;
    }

    return (
        <div className={styles.reviewsContainer}>
            <ul className={styles.reviewsList}>
                {reviews.map(({ id, author, content }) => (
                    <li key={id} className={styles.reviewItem}>
                        <h4 className={styles.author}>Author: {author}</h4>
                        <p className={styles.content}>{content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieReviews;