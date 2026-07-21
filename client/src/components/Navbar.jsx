import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, LogOut, User, LayoutDashboard, UserCheck, Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo Left */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span>
            Scholar<span className="brand-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Center Nav Links */}
        <nav className="desktop-nav">
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

        {/* Desktop Right Action Buttons & Language Switcher */}
        <div className="nav-auth-buttons desktop-auth-buttons">
          {/* Language Selector Dropdown */}
          <div className="lang-switcher-box">
            <Globe size={15} style={{ color: 'var(--primary-blue)' }} />
            <select
              value={i18n.language?.substring(0, 2) || 'en'}
              onChange={handleLanguageChange}
              className="lang-select-input"
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          {/* Language Selector */}
          <div className="mobile-drawer-lang">
            <Globe size={18} style={{ color: 'var(--primary-blue)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-700)' }}>Language:</span>
            <select
              value={i18n.language?.substring(0, 2) || 'en'}
              onChange={handleLanguageChange}
              className="lang-select-input"
              style={{ fontSize: '0.9rem', fontWeight: 600, padding: '4px 8px' }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>

          {/* User Greeting Pill if Authenticated */}
          {isAuthenticated && (
            <div className="mobile-user-greeting">
              <User size={18} style={{ color: 'var(--primary-blue)' }} />
              <span>Welcome, <strong>{user?.fullName || 'Student'}</strong></span>
            </div>
          )}

          {/* Nav Links List */}
          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')} end>
                {t('nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/scholarships" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
                {t('nav.scholarships')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="mobile-menu-actions">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMobileMenu} className="btn btn-outline btn-block" style={{ minHeight: '44px' }}>
                  <UserCheck size={18} />
                  <span>{t('nav.profile')}</span>
                </Link>
                <Link to="/dashboard" onClick={closeMobileMenu} className="btn btn-primary btn-block" style={{ minHeight: '44px' }}>
                  <LayoutDashboard size={18} />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-block" style={{ minHeight: '44px', color: '#dc2626' }}>
                  <LogOut size={18} />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu} className="btn btn-outline btn-block" style={{ minHeight: '44px' }}>
                  <LogIn size={18} />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="btn btn-primary btn-block" style={{ minHeight: '44px' }}>
                  <UserPlus size={18} />
                  <span>{t('nav.register')}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
