import axios from 'axios';

const API_URL = 'http://localhost:3005'; // (or your json-server port)

export const fetchProjects = () => axios.get(`${API_URL}/projects`);
export const createProject = (newProject) => axios.post(`${API_URL}/projects`, newProject);
export const fetchTasks = () => axios.get(`${API_URL}/tasks`);
export const createTask = (newTask) => axios.post(`${API_URL}/tasks`, newTask);
export const fetchComplianceIssues = () => axios.get(`${API_URL}/complianceIssues`);
export const fetchReviews = () => axios.get(`${API_URL}/reviews`);
