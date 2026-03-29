import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import Alert from '../components/Alert';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      
      const response = await taskService.getAllTasks(params);
      setTasks(response.tasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    await taskService.createTask(formData);
    setSuccess('Task created successfully');
    setShowForm(false);
    fetchTasks();
  };

  const handleUpdate = async (formData) => {
    await taskService.updateTask(editingTask.id, formData);
    setSuccess('Task updated successfully');
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(id);
      setSuccess('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Tasks</h1>
        <button 
          className="btn btn-primary"
          onClick={() => { setEditingTask(null); setShowForm(true); }}
        >
          + New Task
        </button>
      </div>

      <Alert message={error} type="error" onClose={() => setError('')} />
      <Alert message={success} type="success" onClose={() => setSuccess('')} />

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '5px' }}>Status:</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label style={{ marginRight: '5px' }}>Priority:</label>
            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <TaskForm 
              task={editingTask}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {editingTask && !showForm && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="close-btn" onClick={() => setEditingTask(null)}>&times;</button>
            </div>
            <TaskForm 
              task={editingTask}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className={`badge badge-${task.status}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              
              <h3 style={{ marginBottom: '10px' }}>{task.title}</h3>
              
              {task.description && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  {task.description}
                </p>
              )}
              
              {task.dueDate && (
                <p style={{ color: '#999', fontSize: '12px', marginBottom: '10px' }}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '5px' }}
                  onClick={() => { setEditingTask(task); }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '5px' }}
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
