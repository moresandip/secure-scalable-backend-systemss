const http = require('http');
const crypto = require('crypto');

const PORT = 5000;
const JWT_SECRET = 'dev-secret-key-12345';

// In-memory storage
const users = [];
const tasks = [];
let userId = 1;
let taskId = 1;

// Helper functions
const generateToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 86400000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
};

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex');
};

const sendJSON = (res, status, data) => {
  res.writeHead(status, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

// Request handler
const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const url = req.url;
  const method = req.method;
  
  // Health check
  if (url === '/health' && method === 'GET') {
    return sendJSON(res, 200, { status: 'UP', timestamp: new Date().toISOString() });
  }

  // Get body
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const data = body ? JSON.parse(body) : {};
    const token = req.headers.authorization?.split(' ')[1];
    const user = token ? verifyToken(token) : null;

    // Register
    if (url === '/api/v1/auth/register' && method === 'POST') {
      const { name, email, password } = data;
      if (!name || !email || !password || password.length < 6) {
        return sendJSON(res, 400, { message: 'Invalid input' });
      }
      if (users.find(u => u.email === email)) {
        return sendJSON(res, 400, { message: 'Email already registered' });
      }
      const hashedPassword = hashPassword(password);
      const newUser = { id: userId++, name, email, password: hashedPassword, role: 'user' };
      users.push(newUser);
      const newToken = generateToken({ id: newUser.id, email, role: newUser.role });
      return sendJSON(res, 201, {
        message: 'User registered successfully',
        token: newToken,
        user: { id: newUser.id, name, email, role: newUser.role }
      });
    }

    // Login
    if (url === '/api/v1/auth/login' && method === 'POST') {
      const { email, password } = data;
      const foundUser = users.find(u => u.email === email);
      if (!foundUser || hashPassword(password) !== foundUser.password) {
        return sendJSON(res, 401, { message: 'Invalid credentials' });
      }
      const newToken = generateToken({ id: foundUser.id, email, role: foundUser.role });
      return sendJSON(res, 200, {
        message: 'Login successful',
        token: newToken,
        user: { id: foundUser.id, name: foundUser.name, email, role: foundUser.role }
      });
    }

    // Get current user
    if (url === '/api/v1/auth/me' && method === 'GET') {
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const foundUser = users.find(u => u.id === user.id);
      if (!foundUser) return sendJSON(res, 404, { message: 'User not found' });
      return sendJSON(res, 200, { user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role } });
    }

    // Tasks - Get all
    if (url === '/api/v1/tasks' && method === 'GET') {
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const userTasks = tasks.filter(t => t.userId === user.id);
      return sendJSON(res, 200, { tasks: userTasks, pagination: { total: userTasks.length, page: 1, totalPages: 1, limit: 10 } });
    }

    // Tasks - Create
    if (url === '/api/v1/tasks' && method === 'POST') {
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const { title, description, status, priority } = data;
      const task = { 
        id: taskId++, 
        title, 
        description: description || '', 
        status: status || 'pending', 
        priority: priority || 'medium', 
        userId: user.id, 
        createdAt: new Date().toISOString() 
      };
      tasks.push(task);
      return sendJSON(res, 201, { message: 'Task created', task });
    }

    // Tasks - Update
    if (url.startsWith('/api/v1/tasks/') && method === 'PUT') {
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const id = parseInt(url.split('/').pop());
      const task = tasks.find(t => t.id === id && t.userId === user.id);
      if (!task) return sendJSON(res, 404, { message: 'Task not found' });
      Object.assign(task, data, { updatedAt: new Date().toISOString() });
      return sendJSON(res, 200, { message: 'Task updated', task });
    }

    // Tasks - Delete
    if (url.startsWith('/api/v1/tasks/') && method === 'DELETE') {
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const id = parseInt(url.split('/').pop());
      const index = tasks.findIndex(t => t.id === id && t.userId === user.id);
      if (index === -1) return sendJSON(res, 404, { message: 'Task not found' });
      tasks.splice(index, 1);
      return sendJSON(res, 200, { message: 'Task deleted' });
    }

    // 404
    sendJSON(res, 404, { message: 'Route not found' });
  });
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('  BACKEND RUNNING - NO DEPENDENCIES');
  console.log('  http://localhost:' + PORT);
  console.log('========================================');
});
