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
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3 sidebar-sticky">
        <Link to="/" className="sidebar-brand d-flex align-items-center px-3 mb-3 text-decoration-none">
          <i className="bi bi-tools me-2 fs-4"></i>
          <span className="fs-5 fw-semibold">FurnitureManager</span>
        </Link>

        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center ${location.pathname === item.path ? 'active' : 'text-dark'}`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
