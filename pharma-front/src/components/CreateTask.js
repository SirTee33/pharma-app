import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/CreateTask.css';

const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from API to assign task
    axios.get('http://localhost:3005/projects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        toast.error('Error fetching projects:');
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskTitle || !selectedProject) {
      toast.success('Task title and project are required!');
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate,
      priority: priority,
      projectId: selectedProject,
      status: 'Pending'
    };

    axios.post('http://localhost:3005/tasks', newTask)
      .then((response) => {
        toast.success('Task Created Successfully!');
        setTaskTitle('');
        setTaskDescription('');
        setDueDate('');
        setPriority('Medium');
        setSelectedProject('');
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        toast.error('Error creating task')
      });
  };

  return (
    <div className="create-task-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} className="create-task-form">
        {/* Task Title */}
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />

        {/* Task Description */}
        <textarea
          placeholder="Task Description (optional)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        {/* Due Date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Priority Dropdown */}
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {/* Assign to Project Dropdown */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          required
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button type="submit" className="create-btn">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
