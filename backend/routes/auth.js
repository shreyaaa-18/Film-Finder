import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import authController from './controllers/authController.js';  // Correct path

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

export default router;