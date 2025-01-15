import React, { useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const validateUsername = (username) => {
    return username.length >= 3;
  };

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

    // Real-time validation
    if (name === 'username' && !validateUsername(value)) {
      setErrors((prev) => ({ ...prev, username: 'Username must be at least 3 characters long' }));
    } else if (name === 'username') {
      setErrors((prev) => ({ ...prev, username: '' }));
    }

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
    if (!validateUsername(formData.username) || !validateEmail(formData.email) || !validatePassword(formData.password)) {
      toast({
        title: 'Invalid input',
        description: 'Please correct the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      toast({
        title: 'Registration Successful',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error(error);
      toast({
        title: 'Registration Failed',
        description: 'An error occurred during registration',
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
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          {/* Username Input */}
          <FormControl isRequired isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              value={formData.username}
              bg="gray.700"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
            {errors.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
          </FormControl>

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
            {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isDisabled={!!errors.username || !!errors.email || !!errors.password}
          >
            Register
          </Button>

          <Divider borderColor="gray.600" />

          <Text>
            Already have an account?{' '}
            <Link to="/login">
              <Button variant="link" colorScheme="teal">
                Login
              </Button>
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
