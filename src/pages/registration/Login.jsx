import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, FormErrorMessage } from '@chakra-ui/react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({
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
      email: '',
      password: ''
    };

    // Email verification
    if (!values.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!values.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password verification
    if (!values.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}/auth/login`, values)
      if(response.status === 201) {
        localStorage.setItem('token', response.data.token)
        navigate('/')
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
          Login
        </Heading>
        <form onSubmit={handleSubmit}> 
          <VStack spacing={4}>

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
          Don't have an account?{' '}
          <Link to="/register">
            <Button variant="link" colorScheme="teal">
              Sign Up
            </Button>
          </Link>
        </Text>
      </Box>
    </Box>
  )
}

export default Login
