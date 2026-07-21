import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(t('auth.emailOrPhoneLabel'));
      return;
    }

    if (!password) {
      setError(t('auth.passwordLabel'));
      return;
    }

    const res = await login(identifier, password);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || t('auth.loginFailed'));
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{t('auth.loginTitle')}</h1>
          <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
        </div>

        <div className="auth-body">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email or Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">
                {t('auth.emailOrPhoneLabel')}
              </label>
              <div className="form-input-wrapper">
                <Mail size={18} className="form-icon" />
                <input
                  type="text"
                  id="identifier"
                  className="form-input has-icon"
                  placeholder={t('auth.emailOrPhonePlaceholder')}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {t('auth.passwordLabel')}
              </label>
              <div className="form-input-wrapper" style={{ position: 'relative' }}>
                <Lock size={18} className="form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input has-icon"
                  style={{ paddingRight: '42px' }}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gray-500)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? t('auth.signingIn') : t('auth.signInBtn')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            {t('auth.noAccount')}{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              {t('auth.registerLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
