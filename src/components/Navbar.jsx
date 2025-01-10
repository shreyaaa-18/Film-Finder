import { Avatar, Box, Container, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, login, logout } = useAuth();


  const handleLogin = async () => {
    try {
      await login();
      console.log('success');
    } catch (error) {
      console.log("errr", error);
    }
  }

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
            {user && (
              <Menu>
                <MenuButton>
                  <Avatar bg={"red.500"} color={"white"} size={"sm"} name="Code"/>
                </MenuButton>
                <MenuList>
                  <Link to="/">
                    <MenuItem>Watchlist</MenuItem>
                  </Link>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!user && (
              <Avatar size={"sm"} bg={"gray.800"} as="button" onClick={handleLogin} />
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
