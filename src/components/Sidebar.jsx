import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'bi bi-house-door', label: 'Dashboard' },
    { path: '/furniture', icon: 'bi bi-archive', label: 'Meubles' },
    { path: '/materials', icon: 'bi bi-layers', label: 'Matériaux' },
    { path: '/suppliers', icon: 'bi bi-building', label: 'Fournisseurs' }
  ];

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-brand">
        <i className="bi bi-tools me-2"></i>
        FurnitureManager
      </Link>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;