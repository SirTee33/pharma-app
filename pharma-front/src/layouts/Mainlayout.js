import React from 'react';
import { Outlet } from 'react-router-dom';
import Heading from '../components/Heading';
import Sidebar from '../components/Sidebar';
import './Mainlayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Heading />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
