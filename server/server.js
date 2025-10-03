// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Set up middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Mount routers
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || 'campushub' });

        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Retry after delay instead of exiting
        setTimeout(connectDB, 5000);
    }
};

// Call the function to connect to the database
connectDB();

// A simple test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Health endpoint with DB status
app.get('/api/health', (req, res) => {
    const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    res.json({ status: 'ok', dbState: state });
});

// Define the port to run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));