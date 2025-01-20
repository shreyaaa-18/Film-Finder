import { useEffect, useState } from "react"
import { Box, Container, Flex, Grid, Heading, Skeleton } from "@chakra-ui/react"
import { fetchTrending } from "../services/api"
import CardComponent from "../components/CardComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('day');

  useEffect(() => {
    setLoading(true);
    fetchTrending(timeWindow)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err, 'err');
      })
      .finally(() => {
        setLoading(false);
    });
  }, [timeWindow]);

  console.log(data, 'data')

  // Protected Routes 
  const navigate = useNavigate()
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/auth/home', {
        headers: {
          "Authorization" : `Bearer ${token}`
        }
      })
      if(response.status !== 201) {
        navigate('/login')
      }
    } catch(err) {
      navigate('/login')
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Container maxW={'container.xl'}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Trending
        </Heading>
        <Flex alignItems={"center"} gap={"2"} border={"1px solid teal"} borderRadius={"20px"}>
          <Box 
            as="button" 
            px="3" py="1" 
            borderRadius={"20px"} 
            bg={`${timeWindow === 'day' ? "gray.700" : ""}`} 
            onClick={() => setTimeWindow("day")}>
              Today
          </Box>

          {/* Divider */}
          <Box 
            width="1px" 
            height="20px" // Adjust height as needed
            bg="teal" // Color of the divider
          />

          <Box 
            as="button" 
            px="3" 
            py="1" 
            borderRadius={"20px"} 
            bg={`${timeWindow === 'week' ? "gray.700" : ""}`} 
            onClick={() => setTimeWindow("week")}>
              This week
          </Box>
        </Flex>
      </Flex>
      
    {/*{loading && <div>Loading...</div>}*/}
      <Grid templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
        lg: "repeat(5, 1fr)"
      }} gap="4">
        { data && data?.map((item, i) => (
          loading ? (
            <Skeleton height={300} key={i} />
          ) : (
            <CardComponent 
              key={item?.id} 
              item={item} 
              type={item?.media_type}
            />
          )
        ))}
      </Grid> 
    </Container>
  )
}

export default Home
