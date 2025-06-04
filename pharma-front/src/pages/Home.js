import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import HomeImage from "../images/pharmaimage.jpeg";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to Pharma Project Manager</h1>
        <p>Manage your pharmaceutical research, production, and regulatory projects with ease.</p>
        <p>Stay compliant, organized, and ahead of deadlines — all in one place!</p>

        <button onClick={() => navigate('/login')} className="get-started-btn">
          Get Started
        </button>

        <div className="features">
          <h2>Key Features</h2>
          <ul>
            <li>▶ Create and Manage Pharma Projects</li>
            <li>▶ Assign Tasks to Research and Production Teams</li>
            <li>▶ Monitor Clinical Trials and Progress</li>
            <li>▶ Track Regulatory Submissions and Compliance</li>
            <li>▶ Centralize Documentation and Reports</li>
          </ul>
        </div>

        <div className="home-image">
          <img src={HomeImage} alt="Pharmaceutical Project Management" />
        </div>

        <footer className="home-footer">
          &copy; 2025 Pharma Project Manager. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;
