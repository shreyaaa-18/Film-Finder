import { Avatar, Box, Container, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Navbar = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_APP_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
          console.log("User is authenticated: ", response.data.isAuthenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    // Clearing the token and redirect to login
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Box py="4" mb="2">
      <Container maxW={'container.xl'}>
        <Flex justifyContent={"space-between"}>
          <Link to='/'>
            <Box 
              fontSize={"2xl"} 
              fontWeight={"bold"} 
              color={"red"} 
              letterSpacing={"widest"} 
              fontFamily={"sans-serif"}
            >
              FILM FINDER
            </Box>
          </Link>

          {/* DESKTOP */}
          <Flex gap={"4"} alignItems={"center"}>
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/shows">TV Shows</Link>
            <Link to="/search">Search</Link>

            {isAuthenticated ? (
              // If the user is logged in, show avatar with menu
              <Menu>
                <MenuButton>
                  <Avatar bg={"red.500"} color={"white"} size={"sm"} />
                </MenuButton>
                <MenuList>
                  <Link to="/watchlist">
                    <MenuItem>Watchlist</MenuItem>
                  </Link>
                  <Link to="/recommendations">
                    <MenuItem>Recommendations</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              // If the user is not logged in, redirect to login page
              <Link to="/login">
                <Avatar size={"sm"} bg={"gray.800"} as="button" />
              </Link>
            )}
            
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
