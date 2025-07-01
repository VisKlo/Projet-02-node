import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white navbar-custom">
      <div className="container-fluid">
        <div className="ms-auto">
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person me-2"></i>
              {user?.username}
            </button>
            <ul className="dropdown-menu">
              <li>
                <span className="dropdown-item-text">
                  <small className="text-muted">{user?.email}</small>
                </span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;