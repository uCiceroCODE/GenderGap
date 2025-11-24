const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

try {
    

// Middleware
app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running ✓' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

//routes
app.use('/api/queries', require('./routes/queries'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Database: ${process.env.DB_NAME}`);
});

} catch (error) {
    console.log(error);
    
}
