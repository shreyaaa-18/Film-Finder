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
                const token = localStorage.getItem('token');
                console.log('Starting recommendations fetch...');

                const response = await axios.get(
                    `${import.meta.env.VITE_APP_URL}/auth/recommendations`, {
                        headers: { Authorization: `Bearer ${token}` },
                        // timeout: 30000 // 30-second timeout
                    }
                );
                console.log('Recommendations responses:', response.data);

                setRecommendations(response.data);
                setLoading(false);

            } catch (err) {
                console.log('Recommendations fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    console.log('Rendered recommendations:', recommendations);

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
                {recommendations.map(movie => (
                    <CardComponent 
                        key={movie.id}
                        movie={movie}
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