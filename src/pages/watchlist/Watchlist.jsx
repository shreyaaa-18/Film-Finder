import { Container, Flex, Grid, Heading, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import CardComponent from "../../components/CardComponent";

const Watchlist = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const removeFromWatchlist = async (movieId) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_APP_URL}/auth/watchlist/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(prev => prev.filter(movie => movie.id !== movieId));
      } catch (err) {
        console.error(err);
      }
    }; 

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                
                // Fetch watchlist movie IDs
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_URL}/auth/watchlist`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Fetch movie details from TMDB
                const movieDetails = await Promise.all(
                    response.data.map(async (id) => {
                        const res = await axios.get(
                            `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}`
                        );
                        return res.data;
                    })
                );

                setMovies(movieDetails.filter(movie => movie !== null));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWatchlist();
    }, []);

    return (
        <Container maxW={'container.xl'}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                    Your Watchlist
                </Heading>
            </Flex>
            
            <Grid 
                templateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)"
                }} 
                gap="4"
            >
                {movies.map((item, i) => (
                    isLoading ? (
                        <Skeleton height={300} key={i} />
                    ) : (
                        <CardComponent 
                            key={item?.id} 
                            item={item} 
                            type={'movie'}
                            onRemove={removeFromWatchlist}
                        />
                    )
                ))}
                
                {!isLoading && movies.length === 0 && (
                    <Heading as="h3" fontSize={"md"}>
                        Your watchlist is empty
                    </Heading>
                )}
            </Grid>
        </Container>
    );
};

export default Watchlist;