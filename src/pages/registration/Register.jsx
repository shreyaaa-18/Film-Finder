import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, FormErrorMessage } from '@chakra-ui/react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleChanges = (e) => {
    setValues({...values, [e.target.name]:e.target.value})
  }

  const validate = () => {
    let isValid = true;
    let newErrors = {
      username: '',
      email: '',
      password: ''
    };

    // Username validation
    if (values.username.length < 5) {
      newErrors.username = 'Username must be at least 5 characters long'
      isValid = false;
    }

    // Email validation
    if (!values.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Run validation
    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}/auth/register`, values)
      if(response.status === 201) {
        navigate('/login')
      }
    } catch(err) {
        console.log(err)
      }
  };

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
            <FormControl id="username" isRequired isInvalid={!!errors.username}>
              <FormLabel color="gray.300">Username</FormLabel>
              <Input type="text" placeholder="Enter Username" bg="gray.700" color="white" name='username' onChange={handleChanges}/>
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <FormLabel color="gray.300">Email</FormLabel>
              <Input type="email" placeholder="Enter Email" bg="gray.700" color="white" name='email' onChange={handleChanges}/>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isRequired isInvalid={!!errors.password}>
              <FormLabel color="gray.300">Password</FormLabel>
              <Input type="password" placeholder="Enter Password" bg="gray.700" color="white" name='password' onChange={handleChanges}/>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
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
