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

  // Check sessionStorage for token on initial app load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const resData = await response.json();

          if (response.ok && resData.success && resData.user) {
            setToken(storedToken);
            setUser(resData.user);
          } else {
            console.warn('[AuthContext]: Stored token invalid or expired. Clearing session.');
            sessionStorage.removeItem(TOKEN_KEY);
          }
        } catch (err) {
          console.error('[AuthContext]: Session verification network error:', err);
          sessionStorage.removeItem(TOKEN_KEY);
        }
      }
      setInitialLoading(false);
    };

    verifySession();
  }, []);

  /**
   * Register a new student
   * @param {Object} data - { fullName, identifier, password, confirmPassword }
   */
  const register = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

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
      console.error('[AuthContext Register Error]:', err);
      return { success: false, message: err.message };
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
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

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
      console.error('[AuthContext Login Error]:', err);
      return { success: false, message: err.message };
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
          justify: 'center',
          backgroundColor: 'var(--gray-100)',
          color: 'var(--primary-blue)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
          Scholar<span style={{ color: 'var(--accent-orange)' }}>Connect</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
          Verifying student session...
        </div>
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
