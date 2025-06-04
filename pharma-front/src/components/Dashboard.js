import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import ProgressBar from './ProgressBar';
import Chatbox from './Chatbox';
import TaskList from './TaskList';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tasks, setTasks] = useState([]);

  const mockAIResponse = async (message) => {
    // Simple mock behavior
    return `🤖 MockBot: I heard you say "${message}"`;
  };

  useEffect(() => {
    axios.get('http://localhost:3005/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);


  useEffect(() => {
    axios.get('http://localhost:3005/projects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId); // Gets all tasks for that project
    const completed = projectTasks.filter(task => task.status === 'Completed').length; // Counts completed tasks
    const total = projectTasks.length; // Total tasks in the project

    return total > 0 ? Math.round((completed / total) * 100) : 0; // Calculates percentage
  };

  const fetchTasks = () => {
    axios.get('http://localhost:3005/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [openProjectId, setOpenProjectId] = useState(null);
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const PendingProjects = projects.filter(p => p.status === 'Pending').length;

  // Search and Filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className='chat-box'>
        <Chatbox onSend={mockAIResponse} className="box" />
      </div>
      {/* Search Box and Status Filter */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search projects by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Project Summaries */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Projects</h3>
          <p>{totalProjects}</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p>{completedProjects}</p>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <p>{inProgressProjects}</p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p>{PendingProjects}</p>
        </div>
      </div>

      {/* Project List */}
      <div className="recent-activities">
        <h2>Projects</h2>
        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul>
            {filteredProjects.map((proj) => (
              <li key={proj.id}>
                <strong>{proj.title}</strong> - {proj.category} ({proj.status})
                <ProgressBar
                  progress={getProjectProgress(proj.id)}
                  striped
                  animated
                  color="#2196f3"
                />
                <button
                  className="toggle-task-btn"
                  onClick={() =>
                    setOpenProjectId(openProjectId === proj.id ? null : proj.id)
                  }
                >
                  {openProjectId === proj.id ? 'Hide Tasks' : 'Show Tasks'}
                </button>

                {openProjectId === proj.id && (
                  <TaskList projectId={proj.id} refreshTasks={fetchTasks} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
