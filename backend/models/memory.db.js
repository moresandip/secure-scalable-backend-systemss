// Simple in-memory database for immediate testing
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory storage
const users = [];
const tasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

// User operations
const User = {
  create: async (data) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const user = {
      id: userIdCounter++,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    return { ...user, password: undefined };
  },
  
  findOne: async (where) => {
    const user = users.find(u => {
      for (let key in where) {
        if (u[key] !== where[key]) return false;
      }
      return true;
    });
    return user || null;
  },
  
  findByPk: async (id) => {
    const user = users.find(u => u.id === parseInt(id));
    return user || null;
  },
  
  findAll: async () => {
    return users.map(u => ({ ...u, password: undefined }));
  },
  
  comparePassword: async (user, password) => {
    return bcrypt.compare(password, user.password);
  }
};

// Task operations
const Task = {
  create: async (data) => {
    const task = {
      id: taskIdCounter++,
      title: data.title,
      description: data.description || null,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      userId: data.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(task);
    return task;
  },
  
  findAndCountAll: async (options = {}) => {
    let result = tasks;
    
    // Apply where clause
    if (options.where) {
      result = result.filter(t => {
        for (let key in options.where) {
          if (t[key] !== options.where[key]) return false;
        }
        return true;
      });
    }
    
    // Apply ordering
    if (options.order) {
      const [field, dir] = options.order[0];
      result.sort((a, b) => {
        if (dir === 'DESC') return new Date(b[field]) - new Date(a[field]);
        return new Date(a[field]) - new Date(b[field]);
      });
    }
    
    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || result.length;
    const paginated = result.slice(offset, offset + limit);
    
    return {
      count: result.length,
      rows: paginated
    };
  },
  
  findByPk: async (id, options = {}) => {
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) return null;
    
    // Include user if requested
    if (options.include && options.include.as === 'user') {
      const user = users.find(u => u.id === task.userId);
      return { ...task, user: user ? { ...user, password: undefined } : null };
    }
    
    return task;
  },
  
  update: async (data, where) => {
    const index = tasks.findIndex(t => t.id === parseInt(where.where.id));
    if (index === -1) return [0];
    
    tasks[index] = { ...tasks[index], ...data, updatedAt: new Date().toISOString() };
    return [1, [tasks[index]]];
  },
  
  destroy: async (where) => {
    const index = tasks.findIndex(t => t.id === parseInt(where.where.id));
    if (index === -1) return 0;
    
    tasks.splice(index, 1);
    return 1;
  }
};

// Sync function (no-op for in-memory)
const syncDatabase = async () => {
  console.log('In-memory database ready');
  return Promise.resolve();
};

module.exports = { User, Task, syncDatabase };
