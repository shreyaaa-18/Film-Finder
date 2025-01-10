// AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "http://localhost:3000"; // Backend API URL

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      
      // Store the token in localStorage or a cookie
      localStorage.setItem("token", token);
      setUser(user); // Set the logged-in user
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // Function to handle user registration
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { username, email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("token"); // Remove the token
    setUser(null);
  };

  // Function to check if a user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};