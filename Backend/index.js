const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const followRoutes = require('./routes/follow.routes');

let countryRoutes;
const cookieParser = require('cookie-parser');

try {
  countryRoutes = require('./routes/country.routes');
} catch (error) {
  console.error('Error loading country.routes:', error.message);
  process.exit(1);
}

dotenv.config();
const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:4200', // exact frontend origin
  credentials: true                // allow cookies (for JWT)
}));

// Database setup
const dbPath = path.join(__dirname, '../database/traveltales.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database at', dbPath);
});

// Initialize database schema from database.sql
const initDb = () => {
  const schemaPath = path.join(__dirname, '../database.sql');
  fs.readFile(schemaPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database.sql:', err.message);
      process.exit(1);
    }
    db.serialize(() => {
      db.exec(data, (err) => {
        if (err) {
          console.error('Error executing database schema:', err.message);
          process.exit(1);
        }
        console.log('Database schema initialized for traveltales.db');
      });
    });
  });
};
initDb();

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/social', followRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  db.get('SELECT 1', (err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
    res.json({ status: 'ok', message: 'Server and database are running' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    console.log('Database connection closed.');
    process.exit(0);
  });
});