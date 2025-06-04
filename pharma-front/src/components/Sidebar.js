import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button is always visible */}
      <div className="sidebar-toggle-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul>
          {/* <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li> */}

          <li className="section-title">P M</li>
          <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
          <li><Link to="/create-project" onClick={() => setIsOpen(false)}>New Project</Link></li>
          <li><Link to="/project-page" onClick={() => setIsOpen(false)}>All Projects</Link></li>

          <li className="section-title">Tasks</li>
          <li><Link to="/create-task" onClick={() => setIsOpen(false)}>New Task</Link></li>
          <li><Link to="/task-page" onClick={() => setIsOpen(false)}>All Tasks</Link></li>

          <li className="section-title">Compliance</li>
          <li><Link to="/compliance" onClick={() => setIsOpen(false)}>Audit Logs</Link></li>
          <li><Link to="/reports" onClick={() => setIsOpen(false)}>Reports</Link></li>
        </ul>

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </>
  );
};

export default Sidebar;
