// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
