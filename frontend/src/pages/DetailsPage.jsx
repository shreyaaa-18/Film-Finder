import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Badge, Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, IconButton, Image, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { fetchCredits, fetchDetails, fetchVideos, imagePath, imagePathOriginal } from "../services/api";
import { CalendarIcon, CheckCircleIcon, SmallAddIcon, StarIcon, TimeIcon } from "@chakra-ui/icons";
import { minutesTohour, ratingToPercentage, resolveRatingColor } from "../utils/helpers";
import VideoComponent from "../components/VideoComponent";
import axios from "axios";

const DetailsPage = () => {
    const router = useParams();
    const { type, id } = router;
    
    const [details, setDetails] = useState({});
    const [cast, setCast] = useState([]);
    const [video, setVideo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false); // To track if movie is in the watchlist
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [detailsData, creditsData, videosData] = await Promise.all([
        fetchDetails(type, id),
        fetchCredits(type, id),
        fetchVideos(type, id),
      ])

      // Set details
      setDetails(detailsData);

      // Set cast
      setCast(creditsData?.cast?.slice(0, 10));

      // Set video(s)
      const video = videosData?.results?.find((video) => video?.type === "Trailer")
      setVideo(video);
      const videos = videosData?.results?.filter((video) => video?.type !== "Trailer")?.slice(0,10);
      setVideos(videos);

      // Check if the movie is already in the watchlist
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}/auth/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const watchlist = response.data; // Array of movie IDs
      // Direct comparison here
      setIsInWatchlist(watchlist.includes(parseInt(id))); // Check if current movie ID is in the watchlist


    } catch (error) {
      console.log(error, 'error')
    } finally {
      setLoading(false);
    }
  };

  fetchData()
}, [type, id]);

useEffect(() => {
  const fetchRating = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/auth/ratings/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Convert the rating to number if needed
      setUserRating(Number(response.data) || 0);
    } catch (err) {
      if (err.response?.status !== 404) {
        // Ignore 404 (no rating exists)
        console.error("Error fetching rating:", err);
      }
      setUserRating(0);
    }
  };
  fetchRating();
}, [id]);

// console.log(video, videos, 'videos')

const addToWatchlist = async (movieId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add movies to watchlist");
      return;
    }
    await axios.post(
      `${import.meta.env.VITE_APP_URL}/auth/watchlist`,
      { movie_id: movieId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setIsInWatchlist(true); // Update the state to reflect the change
    alert("Added to watchlist");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error adding movie to watchlist");
  }
};

const removeFromWatchlist = async (movieId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${import.meta.env.VITE_APP_URL}/auth/watchlist/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsInWatchlist(false); 
    alert("Removed from watchlist");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error removing movie from watchlist")
  }
};

const handleRateMovie = async (movieId, rating) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to rate movies");
      return;
    }
    await axios.post(
      `${import.meta.env.VITE_APP_URL}/auth/ratings`,
      { movie_id: movieId, rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserRating(rating);
    alert("Rating submitted!");
  } catch (err) {
    console.error("Rating error:", err);
    alert(err.response?.data?.message || "Error submitting rating");
  }
};

    if (loading) {
      return (
        <Flex justify={"center"}>
          <Spinner size={"xl"} color="red" />
        </Flex>
      )
    }

    const title = details?.title || details?.name;
    const releaseDate = type === "tv" ? details?.first_air_date : details?.release_date;

  return (
    <Box>
      <Box 
        background={`linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(${imagePathOriginal}/${details?.backdrop_path})`}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        w={"100%"}
        h={{base: "auto", md: "500px"}}
        py={"2"}
        zIndex={"-1"}
        display={"flex"}
        alignItems={"center"}
      >
        <Container maxW={"container.xl"}>
          <Flex alignItems={"center"} gap={"10"} flexDirection={{base: "column", md: "row"}}> 
            <Image height={"450px"} borderRadius={"sm"} src={`${imagePath}/${details?.poster_path}`}/>
            <Box>
              <Heading fontSize={"3xl"}>
                {title}
                {" "}
                <Text as={"span"} fontWeight={"normal"} color={"gray.400"}>
                  {new Date(releaseDate).getFullYear()}
                </Text>
              </Heading>

              <Flex alignItems={"center"} gap={"4"} mt={1} mb={5}>
                <Flex alignItems={"center"}>
                  <CalendarIcon mr={2} color={"gray.400"}/>
                  <Text fontSize={"sm"}>
                  {new Date(releaseDate).toLocaleDateString("en-US")} (US)
                  </Text>
                </Flex>
                {type === "movie" && (
                <>
                  <Box>*</Box>
                  <Flex alignItems={"center"} >
                    <TimeIcon mr="2" color={"gray.400"} />
                    <Text fontSize={"sm"}>{minutesTohour(details?.runtime)}</Text>
                  </Flex>
                </>
              )}
              </Flex>

              <Flex alignItems={"center"} gap={"4"}>
                <CircularProgress 
                  value={ratingToPercentage(details?.vote_average)} 
                  bg={"gray.800"} 
                  borderRadius={"full"} 
                  p={"0.5"} 
                  size={"70px"}
                  color={resolveRatingColor(details?.vote_average)}
                  thickness={"6px"}
                >
                  <CircularProgressLabel fontSize={"lg"}>
                    {ratingToPercentage(details?.vote_average)}{" "}
                    <Box as="span" fontSize={"10px"}>%</Box>
                  </CircularProgressLabel>
                </CircularProgress>
                <Text display={{base: "none", md: "initial"}}>
                  User Score
                </Text>

                {/* <Button 
                  display={"none"}
                  leftIcon={<CheckCircleIcon />} 
                  colorScheme="green" 
                  variant={"outline"} 
                  onClick={() => console.log("click")}
                > 
                  In watchlist
                </Button> 
                <Button 
                  leftIcon={<SmallAddIcon />} 
                  variant={"outline"} 
                  onClick={() => console.log("click")}
                >
                  Add to watchlist
                </Button> */}

              {isInWatchlist ? (
                <Button
                  leftIcon={<CheckCircleIcon />}
                  colorScheme="green"
                  variant={"outline"}
                  onClick={() => removeFromWatchlist(id)}
                >
                  In Watchlist
                </Button>
              ) : (
                <Button leftIcon={<SmallAddIcon />} variant={"outline"} onClick={() => addToWatchlist(id)}>
                  Add to Watchlist
                </Button>
              )}

              {/* User Rating */}
              <Flex alignItems="center" gap={4} mt={4}>
                <Text fontSize="sm" fontWeight="semibold">Rate this:</Text>
                <Flex gap={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Tooltip key={star} label={`${star} star${star !== 1 ? 's' : ''}`}>
                      <IconButton 
                        aria-label={`Rate ${star} star`}
                        icon={<StarIcon />}
                        variant="ghost"
                        color={star <= (hoverRating || userRating) ? "yellow.400" : "gray.600"}
                        _hover={{ color: "yellow.300" }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRateMovie(id, star)}
                        fontSize="24px"
                      />
                    </Tooltip>
                  ))}
                </Flex>
                <Text fontSize="sm" color="gray.400">
                  {userRating > 0 ? `You rated: ${userRating}/5` : "Click to rate"} 
                </Text>
              </Flex>

              </Flex>
              <Text 
                color={"gray.400"} 
                fontSize={"sm"} 
                fontStyle={"italic"} 
                my={"5"}
              >
              {details?.tagline}
              </Text>
              <Heading fontSize={"xl"} mb={"3"}>Overview</Heading>
              <Text fontSize={"md"} mb={"3"}>{details?.overview}</Text>
              <Flex mt={"6"} gap={"2"}>
                {details?.genres?.map((genre) => (
                  <Badge key={genre?.id} p={"1"}>{genre?.name}</Badge>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Container>

      </Box>

      {/* Cast */}
      <Container maxW={"container.xl"} pb={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"} mt={"10"}>
          Cast
        </Heading>
        <Flex mt="5" mb={"10"} overflowX={"scroll"} gap={"5"}>
          {cast?.length === 0 && <Text>No cast found</Text>}
          {cast && cast?.map((item) => (
            <Box key={item?.id} minW={"150px"}>
              <Image src={`${imagePath}/${item?.profile_path}`} 
                            w={"100%"} 
                            height={"225px"} 
                            objectFit={"cover"} 
                            borderRadius={"sm"} />
            </Box>
          ))}
        </Flex>


        <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"} mt="10" mb="5">Trailer</Heading>
        <Box width="100%" height="700px">
          <VideoComponent id={video?.key} small={false} />
        </Box>
        {/* <Flex mt="5" mb="10" overflowX={"scroll"} gap={"5"}>
          {videos && videos?.map((item) => (
            <Box key={item?.id} minW="200px">
              <VideoComponent id={item?.key} small />
            </Box>
          ) )}
        </Flex> */}
        
      </Container>
    </Box>
  );
};

export default DetailsPage
