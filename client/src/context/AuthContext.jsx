import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);
const TOKEN_KEY = 'scholarconnect_token';

export const AuthProvider = ({ children }) => {
  // In-memory state for JWT token and current user, initialized with sessionStorage backup
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [slowServerNotice, setSlowServerNotice] = useState(false);

  // Check sessionStorage for token on initial app load
  useEffect(() => {
    let slowTimer;
    let timeoutId;

    const verifySession = async () => {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setInitialLoading(false);
        return;
      }

      slowTimer = setTimeout(() => {
        setSlowServerNotice(true);
      }, 5000);

      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000);

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const resData = await response.json();

        if (response.ok && resData.success && resData.user) {
          setToken(storedToken);
          setUser(resData.user);
        } else {
          console.error('[AuthContext]: Stored token invalid or expired. Response:', response.status, resData);
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.error('[AuthContext]: Session verification timed out after 15 seconds.');
        } else {
          console.error('[AuthContext]: Session verification network error:', err);
        }
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        if (slowTimer) clearTimeout(slowTimer);
        setSlowServerNotice(false);
        setInitialLoading(false);
      }
    };

    verifySession();

    return () => {
      if (slowTimer) clearTimeout(slowTimer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Register a new student
   * @param {Object} data - { fullName, identifier, password, confirmPassword }
   */
  const register = async (data) => {
    setLoading(true);
    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Registration failed.');
      }

      // Store JWT token in sessionStorage (tab lifetime) and React state
      sessionStorage.setItem(TOKEN_KEY, resData.token);
      setToken(resData.token);
      setUser(resData.user);

      return { success: true, user: resData.user, message: resData.message };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      const errorMessage = isTimeout
        ? 'Taking longer than expected. Please try again.'
        : (err.message || 'Registration failed.');

      console.error('[AuthContext Register Error]:', isTimeout ? 'Request timed out' : err);
      return { success: false, message: errorMessage, isTimeout };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with Email or Phone
   * @param {string} identifier - Email or Phone number
   * @param {string} password - User password
   */
  const login = async (identifier, password) => {
    setLoading(true);
    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Login failed.');
      }

      // Store JWT token in sessionStorage (tab lifetime) and React state
      sessionStorage.setItem(TOKEN_KEY, resData.token);
      setToken(resData.token);
      setUser(resData.user);

      return { success: true, user: resData.user, message: resData.message };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      const errorMessage = isTimeout
        ? 'Taking longer than expected. Please try again.'
        : (err.message || 'Login failed.');

      console.error('[AuthContext Login Error]:', isTimeout ? 'Request timed out' : err);
      return { success: false, message: errorMessage, isTimeout };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update authenticated user's full name
   * @param {string} newName - New full name
   */
  const updateName = async (newName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: newName }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to update name.');
      }

      setUser((prev) => (prev ? { ...prev, fullName: resData.user.fullName } : resData.user));
      return { success: true, user: resData.user, message: resData.message };
    } catch (err) {
      console.error('[AuthContext UpdateName Error]:', err);
      return { success: false, message: err.message };
    }
  };

  /**
   * Logout user by clearing state and sessionStorage
   */
  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  if (initialLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--gray-100)',
          color: 'var(--primary-blue)',
          fontFamily: 'var(--font-sans)',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
          Scholar<span style={{ color: 'var(--accent-orange)' }}>Connect</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
          Verifying student session...
        </div>
        {slowServerNotice && (
          <div
            style={{
              marginTop: '16px',
              fontSize: '0.85rem',
              color: '#d97706',
              backgroundColor: '#fef3c7',
              padding: '8px 14px',
              borderRadius: '6px',
              maxWidth: '360px',
            }}
          >
            Waking up the server, this may take up to 30 seconds on first load
          </div>
        )}
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        register,
        login,
        updateName,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
