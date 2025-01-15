import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
  useToast,
  Divider,
  FormErrorMessage,
} from '@chakra-ui/react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Perform real-time validation
    if (name === 'email' && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
    } else if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: '' }));
    }

    if (name === 'password' && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 6 characters long',
      }));
    } else if (name === 'password') {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      toast({
        title: 'Invalid input',
        description: 'Please provide a valid email and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      toast({
        title: 'Login Successful',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // Redirect to homepage after successful login
    } catch (error) {
      console.error(error);
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="100px"
      p="8"
      boxShadow="lg"
      borderRadius="lg"
      bg="gray.800"
      color="white"
    >
      <Heading mb="6" textAlign="center" color="teal.300">
        Welcome Back!
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          {/* Email Input */}
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>

          {/* Password Input */}
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isDisabled={!!errors.email || !!errors.password}
          >
            Login
          </Button>

          <Divider borderColor="gray.600" />

          <Text>
            New here?{' '}
            <Link to="/register">
              <Button variant="link" colorScheme="teal">
                Register
              </Button>
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
