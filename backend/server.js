const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'dev_secret_key';

// In-memory storage
const users = [];
const tasks = [];
let userId = 1;
let taskId = 1;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Invalid input' });
    }
    
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
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get me
app.get('/api/v1/auth/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Tasks CRUD
app.get('/api/v1/tasks', auth, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.id);
  res.json({ tasks: userTasks, pagination: { total: userTasks.length, page: 1, totalPages: 1, limit: 10 } });
});

app.post('/api/v1/tasks', auth, (req, res) => {
  const { title, description, status, priority } = req.body;
  const task = { id: taskId++, title, description: description || '', status: status || 'pending', priority: priority || 'medium', userId: req.user.id, createdAt: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json({ message: 'Task created', task });
});

app.get('/api/v1/tasks/:id', auth, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id) && t.userId === req.user.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ task });
});

app.put('/api/v1/tasks/:id', auth, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id) && t.userId === req.user.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  Object.assign(task, req.body, { updatedAt: new Date().toISOString() });
  res.json({ message: 'Task updated', task });
});

app.delete('/api/v1/tasks/:id', auth, (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id) && t.userId === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks.splice(index, 1);
  res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  BACKEND RUNNING ON PORT ' + PORT);
  console.log('  http://localhost:' + PORT);
  console.log('========================================');
});
