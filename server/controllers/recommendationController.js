import axios from 'axios'
import { connectToDatabase } from '../lib/db.js';
import dotenv from 'dotenv'
dotenv.config()


const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Validate movie exists on TMDB
const isValidTMDBMovie = async (movieId) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`,
            { timeout: 5000 }
        );
        return response.data.id === movieId;
    } catch {
        return false;
    }
};

// Fallback to popular movies
const getFallbackRecommendations = async () => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`,
            { timeout: 5000 }
        );
        return response.data.results.slice(0, 20);
    } catch {
        return [];
    }
};

export const getRecommendations = async (req, res) => {
    try {
        if (!TMDB_API_KEY) throw new Error('TMDB_API_KEY is missing');

        const db = await connectToDatabase();
        const userId = req.userId;

        // Get user preferences
        const [watchlistRows] = await db.query(
            'SELECT movie_id FROM watchlist WHERE user_id = ?',
            [userId]
        );
        const watchlist = watchlistRows
            .map(row => ({
                movie_id: Number(row.movie_id)
            }))
            .filter(item => !isNaN(item.movie_id));

        const [ratingsRows] = await db.query(
            'SELECT movie_id, rating FROM ratings WHERE user_id = ?',
            [userId]
        );
        const ratings = ratingsRows
            .map(row => ({
                movie_id: Number(row.movie_id),
                rating: Number(row.rating)
            }))
            .filter(item =>
                !isNaN(item.movie_id) &&
                !isNaN(item.rating) &&
                item.rating >= 1 && item.rating <= 5
            );

        console.log('User watchlist:', watchlist);
        console.log('User rating:', ratings);

        // Filter valid seed movies
        const seedMovies = [
            ...watchlist.map(w => w.movie_id),
            ...ratings.filter(r => r.rating >= 4).map(r => r.movie_id)
        ];

        console.log('Raw seed movies:', seedMovies);

        const validSeeds = [];
        for (const movieId of seedMovies) {
            if (await isValidTMDBMovie(movieId)) {
                validSeeds.push(movieId);
            }
        }

        console.log('Valid seeds:', validSeeds);

        // Get recommendations
        let recommendations = [];
        if (validSeeds.length > 0) {
            recommendations = await Promise.all(
                validSeeds.map(movieId => 
                    limit(() => 
                        axios.get(
                            `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`,
                            { timeout: 10000 }
                        )
                        .then(res => res.data.results)
                        .catch(err => {
                            console.error(`Failed for ${movieId}:`, err.message);
                            return [];
                        })
                    )
                )
            );
        }

        // Process results
        const merged = recommendations.flat();
        console.log('Merged recommendations:', merged.length);

        const unique = merged.filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i
        );
        console.log('Unique recommendations:', unique.length);

        let final = unique.filter(movie => { 
            const inWatchlist = watchlist.some(w => w.movie_id === movie.id);
            const isRated = ratings.some(r => r.movie_id === movie.id);
            return !inWatchlist && !isRated;
        }).slice(0, 20);

        console.log('Filtered recommendations:', final.length);

        // Add fallback if needed
        if (final.length < 20) {
            console.log('Adding fallback recommendations');
            const fallback = await getFallbackRecommendations();
            const filteredFallback = fallback.filter(movie => 
                !watchlist.some(w => w.movie_id === movie.id) &&
                !ratings.some(r => r.movie_id === movie.id)
            ).slice(0, 20 - final.length);

            final = [...final, ...filteredFallback];
        }

        console.log('Final recommendations:', final.length);
        res.status(200).json(final);

    } catch (err) {
        console.error('Recommendation error:', err);
        const fallback = await getFallbackRecommendations();
        res.status(200).json(fallback);
    }
};