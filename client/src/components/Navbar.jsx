import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, LogOut, User, LayoutDashboard, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo Left */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span>
            Scholar<span className="brand-accent">Connect</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scholarships"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Scholarships
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Action Buttons / User Menu */}
        <div className="nav-auth-buttons">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-pill">
                <User size={16} />
                <span>{user?.fullName?.split(' ')[0] || 'Student'}</span>
              </span>

              <Link to="/profile" className="btn btn-outline btn-sm">
                <UserCheck size={16} />
                <span>Profile</span>
              </Link>

              <Link to="/dashboard" className="btn btn-outline btn-sm">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
