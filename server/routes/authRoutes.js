import express from 'express'
import {connectToDatabase} from '../lib/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Registration
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if(rows.length > 0) {
            return res.status(409).json({message: "user already exists"})
        }

        const hashPassword = await bcrypt.hash(password, 10)
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashPassword])

        res.status(201).json({message: "user created successfully"})

    } catch(err) {
        res.status(500).json(err.message)
    }
})

// Login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if(rows.length === 0) {
            return res.status(404).json({message: "user does not exist"})
        }

        const isMatch = await bcrypt.compare(password, rows[0].password)

        if(!isMatch) {
            return res.status(401).json({message: "wrong password"})
        }

        const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '3h'})

        res.status(201).json({token: token})

    } catch(err) {
        res.status(500).json(err.message)
    }
})

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if(!token) {
            return res.status(403).json({message: "No Token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userId = decoded.id;
        next()
    } catch (err) {
        return res.status(500).json({message: "server error"})
    }
}

// General Authentication Check
router.get('/verify', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users where id = ?', [req.userId]);

        if (rows.length === 0) {
            return res.status(404).json({message: "User does not exist"});
        }

        return res.status(200).json({
            isAuthenticated: true, 
            user: { id: rows[0].id, username: rows[0].username, email: rows[0].email},
        });
    } catch (err) {
        return res.status(500).json({message: "Server error"});
    }
})

// Add movie to watchlist
router.post('/watchlist', verifyToken, async (req, res) => {
    const { movie_id } = req.body;
    try {
        const db = await connectToDatabase();
        await db.query('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [req.userId, movie_id]);
        res.status(201).json({message: "Movie added to watchlist"});
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({message: "Movie already in watchlist"});
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

// Fetch User's Watchlist 
router.get('/watchlist', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT movie_id FROM watchlist WHERE user_id = ?', [req.userId]);
        res.status(200).json(rows.map(row => row.movie_id));
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Remove movie from watchlist
router.delete('/watchlist/:movie_id', verifyToken, async (req, res) => {
    const { movie_id } = req.params;
    try {
        const db = await connectToDatabase();
        await db.query('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?', [req.userId, movie_id]);
        res.status(200).json({ message: "Movie removed from watchlist" })
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
});

// Submit/ Update Rating
router.post('/ratings', verifyToken, async (req, res) => {
    const { movie_id, rating } = req.body;
    try {
        const db = await connectToDatabase();
        // Check if rating exists
        const [existing] = await db.query('SELECT * FROM ratings WHERE user_id =? AND movie_id = ?', [req.userId, movie_id]);
        if (existing.length > 0) {
            // Update existing rating
            await db.query('UPDATE ratings SET rating = ? WHERE user_id = ? AND movie_id = ?', [rating, req.userId, movie_id]);
        } else {
            // Insert new rating 
            await db.query('INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)', [req.userId, movie_id, rating]);
        }
        res.status(201).json({ message: "Rating submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's rating for a movie 
router.get('/ratings/:movie_id', verifyToken, async (req, res) => {
    const { movie_id } = req.params;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?', [req.userId, movie_id]);
        res.status(200).json(rows[0]?.rating || 0);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Rating
router.delete('/ratings/:movie_id', verifyToken, async (req, res) => {
    const { movie_id } = req.params;
    try {
        const db = await connectToDatabase();
        await db.query('DELETE FROM ratings WHERE user_id = ? AND movie_id = ?', [req.userId, movie_id]);
        res.status(200).json({ message: "Rating removed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

{/*
// Home Route
router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId])
        if(rows.length === 0) {
            return res.status(404).json({message: "user does not exist"})
        }

        return res.status(201).json({user: rows[0]})
    } catch (err) {
        return res.status(500).json({message: "server error"})
    }
}) */}

export default router;