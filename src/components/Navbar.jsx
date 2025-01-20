import { Avatar, Box, Container, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Link } from "react-router-dom";


const Navbar = () => {

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
            {/* // add if and if not user condition here */}
              <Menu>
                <MenuButton>
                  <Avatar bg={"red.500"} color={"white"} size={"sm"} name={null}/>
                </MenuButton>
                <MenuList>
                  <Link to="/">
                    <MenuItem>Watchlist</MenuItem>
                  </Link>
                  {/* // add onlclick logout here */}
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            
            {/* // if not user */}
             {/* <Link to="/login">
                <Avatar size={"sm"} bg={"gray.800"} as="button" />
              </Link> */}
            
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
