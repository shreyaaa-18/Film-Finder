import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleChanges = (e) => {
    setValues({...values, [e.target.name]:e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/auth/register', values)
      if(response.status === 201) {
        navigate('/login')
      }
    } catch(err) {
        console.log(err)
      }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="black"  // Set page background to black
    >
      <Box
        boxShadow="lg"
        p={8}
        borderWidth={1}
        borderRadius="md"
        width="96"
        bg="gray.800"  // Set form background to a dark gray
        color="white"  // Ensure text is white on dark background
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6} color="teal.400">
          Register
        </Heading>
        <form onSubmit={handleSubmit}> 
          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel color="gray.300">Username</FormLabel>
              <Input type="text" placeholder="Enter Username" bg="gray.700" color="white" name='username' onChange={handleChanges}/>
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel color="gray.300">Email</FormLabel>
              <Input type="email" placeholder="Enter Email" bg="gray.700" color="white" name='email' onChange={handleChanges}/>
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel color="gray.300">Password</FormLabel>
              <Input type="password" placeholder="Enter Password" bg="gray.700" color="white" name='password' onChange={handleChanges}/>
            </FormControl>

            <Button colorScheme="teal" width="full" mt={4} type="submit">
              Submit
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center" color="gray.400">
          Already have an account?{' '}
          <Link to="/login">
            <Button variant="link" colorScheme="teal">
              Login
            </Button>
          </Link>
        </Text>
      </Box>
    </Box>
  )
}

export default Register
