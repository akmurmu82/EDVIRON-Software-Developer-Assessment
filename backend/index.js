import express, { Router } from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';

const server = express();
const PORT = process.env.PORT || 3000;


// Middleware
server.use(express.json());

// Routers
server.use('/api/auth', authRouter);

// Basic route
server.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Edviron Backend Server!' });
});

server.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
    }
});