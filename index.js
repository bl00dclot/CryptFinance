// BACKEND: Node.js + Express

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const fetch = require('node-fetch');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finance_blog',
  password: 'yourpassword',
  port: 5432,
});

// JWT secret
const JWT_SECRET = 'your_jwt_secret';

// Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
      [username, hashedPassword, email]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login a user
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) return res.status(403).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all blog posts
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await pool.query('SELECT * FROM blogs');
    res.json(blogs.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new blog post
app.post('/api/blogs', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      'INSERT INTO blogs (user_id, title, content, created_at) VALUES ($1, $2, $3, NOW())',
      [userId, title, content]
    );
    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a blog post
app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1 AND user_id = $2', [id, userId]);

    if (blog.rows.length === 0) return res.status(404).json({ message: 'Blog not found or not authorized' });

    await pool.query('UPDATE blogs SET title = $1, content = $2 WHERE id = $3', [title, content, id]);
    res.json({ message: 'Blog post updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a blog post
app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1 AND user_id = $2', [id, userId]);

    if (blog.rows.length === 0) return res.status(404).json({ message: 'Blog not found or not authorized' });

    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cryptocurrency data (CoinGecko API)
app.get('/api/crypto', async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
