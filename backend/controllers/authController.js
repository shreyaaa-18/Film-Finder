import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Registration handler
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send({ message: 'Database error', error: err });
            }
            res.status(201).send({ message: 'User registered successfully!' });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Error registering user', error });
    }
};

// Login handler
export const loginUser = (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Database error', error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Send back the token and user info
        res.send({ 
            message: 'Login successful!', 
            token, 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    });
};

// Verify token and get user info (for token-based authentication)
export const getMe = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const sql = 'SELECT id, username, email FROM users WHERE id = ?';
        db.query(sql, [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Database error', error: err });
            }
            if (results.length === 0) {
                return res.status(404).send({ message: 'User not found!' });
            }

            const user = results[0];
            res.send({ user });
        });
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).send({ message: 'Invalid or expired token!' });
    }
};
