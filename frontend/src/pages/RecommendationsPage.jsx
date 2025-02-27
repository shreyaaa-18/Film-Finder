import { useEffect, useState } from "react";
import { Box, Heading, Grid, Spinner, Text } from '@chakra-ui/react';
import axios from "axios";
import CardComponent from "../components/CardComponent";
import { Container } from "@chakra-ui/react";

const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                // Step 1: Fetch top 5 rated movies from backend
                const ratedMoviesResponse = await axios.get(
                    `${import.meta.env.VITE_APP_URL}/auth/top-rated`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const movieIds = ratedMoviesResponse.data; // Array of top 5 movies

                if (movieIds.length === 0) {
                    setRecommendations([]);
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch recommendations from TMDB for each movie
                const recommendationPromises = movieIds.map(async (movieId) => {
                    try {
                        const res = await axios.get(
                            `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`
                        );
                        return res.data.results || [];
                    } catch (error) {
                        console.error(`Error fetching recommendations for movie ${movieId}:`, error.message);
                        return [];
                    }
                });

                const recommendationsResults = await Promise.all(recommendationPromises);

                // Step 3: Flatten & deduplicate recommendations
                const seenMovies = new Map();
                recommendationsResults.flat().forEach((movie) => {
                    if (!seenMovies.has(movie.id)) {
                        seenMovies.set(movie.id, { ...movie, recommendation_count: 1 });
                    } else {
                        seenMovies.get(movie.id).recommendation_count++;
                    }
                });

                // Step 4: Sort by most recommended, then by vote average
                const sortedRecommendations = Array.from(seenMovies.values()).sort((a, b) => {
                    if (b.recommendation_count !== a.recommendation_count) {
                        return b.recommendation_count - a.recommendation_count;
                    }
                    return b.vote_average - a.vote_average;
                });

                setRecommendations(sortedRecommendations);
            } catch (err) {
                console.error('Recommendations fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [])

    if (loading) {
        return (
            <Box textAlign="center" mt={8}>
                <Spinner size="xl" />
                <Text mt={4}>Finding movies you'll love..</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={8}>
                <Text color="red.500">Error loading recommendations: {error}</Text>
            </Box>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" mb={8} fontSize="2xl">
                Recommended Just For You
            </Heading>

            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}> 
                {recommendations.map(item => (
                    <CardComponent 
                        key={item.id}
                        item={item} 
                        type="movie"
                    />
                ))}
            </Grid>

            {recommendations.length === 0 && (
                <Text textAlign="center" mt={8}>
                    No recommendations found. Start rating movies to get personalized suggestions!
                </Text>
            )}
        </Container>
    );
};

export default RecommendationsPage;