import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../src/auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


import MainLayout from './layouts/Mainlayout';
import HomePage from './pages/Home';
import ProjectPage from './pages/ProjectPage';
import TaskPage from './pages/TaskPage';
import CreateProject from './components/CreateProject';
import CreateTask from './components/CreateTask';
import CompliancePage from './pages/CompliancePage';
import ReportPage from './pages/ReportPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="project-page" element={<ProjectPage />} />
            <Route path="task-page" element={<TaskPage />} />
            <Route path="create-project" element={<CreateProject />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="reports" element={<ReportPage />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
