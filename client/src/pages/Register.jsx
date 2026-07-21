import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    identifier: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError(t('auth.fullNameLabel'));
      return;
    }

    if (!formData.identifier.trim()) {
      setError(t('auth.emailOrPhoneLabel'));
      return;
    }

    if (!formData.password) {
      setError(t('auth.passwordLabel'));
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = await register({
      fullName: formData.fullName,
      identifier: formData.identifier,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || t('auth.registerFailed'));
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{t('auth.registerTitle')}</h1>
          <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>
        </div>

        <div className="auth-body">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">{t('auth.fullNameLabel')}</label>
              <div className="form-input-wrapper">
                <User size={18} className="form-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input has-icon"
                  placeholder={t('auth.fullNamePlaceholder')}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email OR Phone Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">{t('auth.emailOrPhoneLabel')}</label>
              <div className="form-input-wrapper">
                <Mail size={18} className="form-icon" />
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  className="form-input has-icon"
                  placeholder={t('auth.emailOrPhonePlaceholder')}
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">{t('auth.passwordLabel')}</label>
              <div className="form-input-wrapper" style={{ position: 'relative' }}>
                <Lock size={18} className="form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input has-icon"
                  style={{ paddingRight: '42px' }}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</label>
              <div className="form-input-wrapper" style={{ position: 'relative' }}>
                <Lock size={18} className="form-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input has-icon"
                  style={{ paddingRight: '42px' }}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
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
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? t('auth.registering') : t('auth.registerBtn')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              {t('auth.loginLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
