const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'simple_secret_key';

// In-memory storage
const users = [];
const tasks = [];
let userId = 1;
let taskId = 1;

// Middleware
app.use(cors());
app.use(express.json());

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Register
app.post('/api/v1/auth/register', [
  body('name').notEmpty().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate
], async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: userId++, name, email, password: hashedPassword, role: 'user' };
    users.push(user);
    
    const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name, email, role: user.role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/v1/auth/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  validate
], async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
app.get('/api/v1/auth/me', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Get all tasks
app.get('/api/v1/tasks', authenticate, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.id);
  res.json({ tasks: userTasks });
});

// Create task
app.post('/api/v1/tasks', [
  body('title').notEmpty(),
  validate
], authenticate, (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    const task = {
      id: taskId++,
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('BACKEND SERVER RUNNING');
  console.log('='.repeat(50));
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
});
