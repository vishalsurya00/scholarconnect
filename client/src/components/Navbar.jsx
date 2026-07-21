import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, LogOut, User, LayoutDashboard, UserCheck, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
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
                {t('nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scholarships"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {t('nav.scholarships')}
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

        {/* Right Action Buttons & Language Switcher */}
        <div className="nav-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Selector Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'var(--gray-100)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--gray-300)',
            }}
          >
            <Globe size={15} style={{ color: 'var(--primary-blue)' }} />
            <select
              value={i18n.language?.substring(0, 2) || 'en'}
              onChange={handleLanguageChange}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--gray-800)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-pill">
                <User size={16} />
                <span>{user?.fullName?.split(' ')[0] || 'Student'}</span>
              </span>

              <Link to="/profile" className="btn btn-outline btn-sm">
                <UserCheck size={16} />
                <span>{t('nav.profile')}</span>
              </Link>

              <Link to="/dashboard" className="btn btn-outline btn-sm">
                <LayoutDashboard size={16} />
                <span>{t('nav.dashboard')}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout">
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={16} />
                <span>{t('nav.login')}</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>{t('nav.register')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
