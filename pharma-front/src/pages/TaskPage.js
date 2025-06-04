import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TaskPage.css';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    axios.get('http://localhost:3005/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error))
      .finally(() => setLoading(false));
  };

  const fetchProjects = () => {
    axios.get('http://localhost:3005/projects')
      .then((response) => setProjects(response.data))
      .catch((error) => console.error('Error fetching projects:', error));
  };

  const handleStatusToggle = (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    axios.patch(`http://localhost:3005/tasks/${taskId}`, { status: newStatus })
      .then(() => fetchTasks())
      .catch((error) => console.error('Error updating task status:', error));
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      axios.delete(`http://localhost:3005/tasks/${taskId}`)
        .then(() => fetchTasks())
        .catch((error) => console.error('Error deleting task:', error));
    }
  };

  // Match project name with projectId
  const getProjectName = (projectId) => {
    const project = projects.find((proj) => proj.id === projectId || proj.id === Number(projectId));
    return project ? project.title : 'Unknown Project';
  };

  const filteredTasks = tasks.filter((task) => {
    const matchTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchTitle && matchStatus;
  });

  // Sort tasks based on selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortOption === 'priority') {
      return a.priority.localeCompare(b.priority);
    }
    return 0;
  });

  return (
    <div className="task-page-container">
      <h2>All Tasks</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="task-search-input"
      />

      {/* Filter Dropdown */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="task-filter-select"
      >
        <option value="all">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="In Process">In Process</option>
      </select>

      {/* Sort Dropdown */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="task-sort-select"
      >
        <option value="">Sort By</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      {/* Display Loader when fetching data */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="task-list">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status === 'Completed' ? 'completed' : ''}`}>
                <h3>{task.title}</h3>
                <p><strong>Project:</strong> {getProjectName(task.projectId)}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Due Date:</strong> {task.dueDate}</p>
                <p><strong>Description:</strong> {task.description}</p>

                <div className="task-buttons">
                  <button
                    className="status-btn"
                    onClick={() => handleStatusToggle(task.id, task.status)}
                  >
                    {task.status === 'Pending' ? 'Mark as Completed' : 'Mark as Pending'}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskPage;
