import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { getLocalizedText } from '../utils/languageUtils';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  BookOpen,
  MapPin,
  IndianRupee,
  Edit3,
  X,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  Bell,
  BellOff,
} from 'lucide-react';

const Dashboard = () => {
  const { user, token, logout, updateName } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checklists, setChecklists] = useState([]);
  const [loadingChecklists, setLoadingChecklists] = useState(true);

  // Reminders & Web Notification state
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [showNotifBanner, setShowNotifBanner] = useState(() => {
    return (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default' &&
      sessionStorage.getItem('sc_notif_banner_dismissed') !== 'true'
    );
  });
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return localStorage.getItem('sc_banner_dismissed') === 'true';
  });

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('sc_banner_dismissed', 'true');
  };

  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.fullName || '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');

  // Keep nameInput synchronized with user.fullName
  useEffect(() => {
    if (user?.fullName) {
      setNameInput(user.fullName);
    }
  }, [user?.fullName]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }
    setSavingName(true);
    setNameError('');
    const res = await updateName(nameInput.trim());
    setSavingName(false);

    if (res.success) {
      setIsEditingName(false);
    } else {
      setNameError(res.message || 'Failed to update name.');
    }
  };

  const handleCancelNameEdit = () => {
    setIsEditingName(false);
    setNameInput(user?.fullName || '');
    setNameError('');
  };

  const studentName = user?.fullName || 'Student';

  // Fetch student profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('[Dashboard Fetch Profile Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchChecklists = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/checklist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.checklists)) {
          setChecklists(data.checklists);
        }
      } catch (err) {
        console.error('[Dashboard Fetch Checklists Error]:', err);
      } finally {
        setLoadingChecklists(false);
      }
    };

    const fetchReminders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/scholarships/reminders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.reminders)) {
          setReminders(data.reminders);
          checkAndTriggerNotification(data.reminders);
        }
      } catch (err) {
        console.error('[Dashboard Fetch Reminders Error]:', err);
      } finally {
        setLoadingReminders(false);
      }
    };

    if (token) {
      fetchProfile();
      fetchChecklists();
      fetchReminders();
    }
  }, [token]);

  const checkAndTriggerNotification = (remindersList) => {
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted' &&
      sessionStorage.getItem('sc_notif_triggered') !== 'true'
    ) {
      const urgentItem = remindersList.find((r) => r.daysRemaining <= 7);
      if (urgentItem) {
        sessionStorage.setItem('sc_notif_triggered', 'true');
        try {
          new Notification('ScholarConnect Deadline Alert 🎓', {
            body: `Urgent: "${urgentItem.name}" closes in ${urgentItem.daysRemaining} day${urgentItem.daysRemaining === 1 ? '' : 's'}!`,
          });
        } catch (err) {
          console.error('[Notification Error]:', err);
        }
      }
    }
  };

  const handleEnableNotifications = async () => {
    if (typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      setShowNotifBanner(false);
      if (permission === 'granted' && reminders.length > 0) {
        checkAndTriggerNotification(reminders);
      }
    }
  };

  const handleDismissNotifBanner = () => {
    setShowNotifBanner(false);
    sessionStorage.setItem('sc_notif_banner_dismissed', 'true');
  };

  const completeness = profile?.profileCompleteness || 0;

  return (
    <div>
      {/* Dashboard Header Hero */}
      <section className="dashboard-hero">
        <div className="container">
          <div className="dashboard-user-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div className="user-avatar-circle">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  {t('home.welcomeBackTitle', { name: studentName })}
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem' }}>
                  {t('dashboard.title')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/profile" className="btn btn-accent btn-sm">
                <Edit3 size={15} /> {t('dashboard.editProfile')}
              </Link>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Body */}
      <section style={{ padding: '36px 0', backgroundColor: 'var(--gray-100)' }}>
        <div className="container">
          
          {/* Profile Completeness Progress Bar Card */}
          <div className="sc-card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} style={{ color: 'var(--accent-orange)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {t('dashboard.completenessTitle')}
                </h3>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: completeness >= 80 ? 'var(--success-green)' : 'var(--accent-orange-dark)',
                }}
              >
                {completeness}%
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '12px',
                backgroundColor: 'var(--gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: `${completeness}%`,
                  height: '100%',
                  background: completeness >= 80
                    ? 'linear-gradient(90deg, #2e9e5b, #4ade80)'
                    : 'linear-gradient(90deg, #1a3a8f, #f7941d)',
                  transition: 'width 0.5s ease-in-out',
                }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem', color: 'var(--gray-600)' }}>
              <span>
                {t('profile.bannerText', { percent: completeness })}
              </span>
              <Link to="/profile" style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                {t('scholarships.updateProfileNow')}
              </Link>
            </div>
          </div>

          {/* Dismissible Banner */}
          {!bannerDismissed && completeness < 90 && (
            <div
              className="alert alert-info"
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #eef3ff 0%, #fff7ed 100%)',
                border: '1.5px solid var(--accent-orange)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <AlertCircle size={24} style={{ color: 'var(--accent-orange-dark)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.98rem' }}>
                    {t('scholarships.tabUncertain')}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--gray-700)' }}>
                    {t('scholarships.uncertainNotice')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/profile" className="btn btn-accent btn-sm">
                  {t('dashboard.completeNow')} <ArrowRight size={14} />
                </Link>
                <button
                  onClick={handleDismissBanner}
                  style={{ background: 'transparent', color: 'var(--gray-500)', cursor: 'pointer' }}
                  title="Dismiss banner"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Main Grid: Account Details & Profile Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            
            {/* Account Details Card */}
            <div className="sc-card">
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '18px',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <User size={20} /> {t('dashboard.accountDetails')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('profile.fullName').toUpperCase()}</span>
                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        style={{
                          background: 'transparent',
                          color: 'var(--primary-blue)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        <Edit3 size={13} /> {t('dashboard.editProfile')}
                      </button>
                    )}
                  </div>

                  {isEditingName ? (
                    <div style={{ marginTop: '6px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.9rem', marginBottom: '6px' }}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        autoFocus
                      />
                      {nameError && (
                        <div style={{ color: '#dc2626', fontSize: '0.78rem', marginBottom: '6px' }}>
                          {nameError}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={handleSaveName}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          disabled={savingName}
                        >
                          {savingName ? t('profile.saving') : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelNameEdit}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          disabled={savingName}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontWeight: 600, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {user?.fullName}
                    </div>
                  )}
                </div>

                {user?.email && (
                  <div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('dashboard.email').toUpperCase()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={15} style={{ color: 'var(--primary-blue)' }} />
                      <span>{user.email}</span>
                    </div>
                  </div>
                )}

                {user?.phone && (
                  <div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('dashboard.phone').toUpperCase()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} style={{ color: 'var(--primary-blue)' }} />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>ACCOUNT STATUS</div>
                  <span className="badge badge-verified" style={{ marginTop: '4px' }}>
                    <ShieldCheck size={14} /> Student (Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="sc-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <BookOpen size={20} /> {t('dashboard.profileSummary')}
                </h3>

                <Link to="/profile" className="btn btn-outline btn-sm">
                  <Edit3 size={14} /> {t('dashboard.editProfile')}
                </Link>
              </div>

              {loading ? (
                <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Loading profile information...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                  
                  <div style={{ background: 'var(--gray-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('dashboard.classLevel').toUpperCase()}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {profile?.academic?.currentClass || 'Not specified'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('dashboard.domicile').toUpperCase()}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {profile?.location?.state || 'Not specified'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('dashboard.category').toUpperCase()}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {profile?.personal?.category || 'Not specified'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>{t('dashboard.familyIncome').toUpperCase()}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {profile?.economic?.annualIncome
                        ? `₹${profile.economic.annualIncome.toLocaleString('en-IN')}`
                        : 'Not specified'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>DISTRICT & AREA</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {profile?.location?.district
                        ? `${profile.location.district} (${profile.location.areaType || 'General'})`
                        : 'Not specified'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem', fontWeight: 600 }}>ACADEMIC STREAM</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: '2px' }}>
                      {profile?.academic?.stream || 'N/A'}
                    </div>
                  </div>

                </div>
              )}

              {/* Special Badges Summary */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {profile?.personal?.disabilityStatus && (
                  <span className="badge badge-featured">PWD Quota</span>
                )}
                {profile?.specialCategories?.minorityReligion && (
                  <span className="badge badge-verified">Minority Religion</span>
                )}
                {profile?.specialCategories?.sportsQuota && (
                  <span className="badge badge-days-left">Sports Quota</span>
                )}
                {profile?.specialCategories?.exServicemenChild && (
                  <span className="badge badge-category">Defence Personnel Child</span>
                )}
                {profile?.specialCategories?.firstGenLearner && (
                  <span className="badge badge-verified">First Gen Learner</span>
                )}
              </div>

            </div>

          </div>

          {/* Web Notification Permission Prompt Banner */}
          {showNotifBanner && (
            <div
              className="alert alert-info"
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                border: '1.5px solid var(--primary-blue)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={22} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.94rem' }}>
                    {t('dashboard.alertsBannerTitle')}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--gray-700)' }}>
                    {t('dashboard.alertsBannerDesc')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={handleEnableNotifications} className="btn btn-primary btn-sm">
                  {t('dashboard.enableAlertsBtn')}
                </button>
                <button
                  onClick={handleDismissNotifBanner}
                  style={{ background: 'transparent', color: 'var(--gray-500)', cursor: 'pointer', border: 'none' }}
                  title="Dismiss alert prompt"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Upcoming Deadlines Card Section */}
          <div className="sc-card" style={{ marginTop: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={22} style={{ color: 'var(--accent-orange)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {t('dashboard.upcomingDeadlines')}
                </h3>
              </div>

              <Link to="/scholarships" style={{ fontWeight: 600, color: 'var(--primary-blue)', fontSize: '0.88rem' }}>
                {t('scholarships.tabAll')} →
              </Link>
            </div>

            {loadingReminders ? (
              <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem', padding: '20px 0' }}>
                Loading upcoming deadlines...
              </div>
            ) : reminders.length === 0 ? (
              /* Informational Empty State */
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--gray-100)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--gray-600)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Clock size={18} style={{ color: 'var(--gray-500)' }} />
                <span>{t('dashboard.noDeadlines')}</span>
              </div>
            ) : (
              /* Top 5 Upcoming Deadlines */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reminders.slice(0, 5).map((item) => {
                  let badgeStyle = { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a', fontWeight: 600 };
                  let badgeText = t('dashboard.daysLeft', { days: item.daysRemaining });

                  if (item.daysRemaining <= 7) {
                    badgeStyle = { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 700 };
                    badgeText = `${t('dashboard.daysLeft', { days: item.daysRemaining })} (${t('dashboard.urgent')})`;
                  } else if (item.daysRemaining <= 15) {
                    badgeStyle = { backgroundColor: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa', fontWeight: 600 };
                  }

                  return (
                    <div
                      key={item._id}
                      style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: item.daysRemaining <= 7 ? '#fff5f5' : 'var(--gray-100)',
                        border: item.daysRemaining <= 7 ? '1px solid #fecaca' : '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius-sm)',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <Link
                          to={`/scholarships/${item._id}`}
                          style={{ fontWeight: 700, color: 'var(--gray-900)', textDecoration: 'none', fontSize: '0.94rem' }}
                        >
                          {getLocalizedText(item.name, i18n.language)}
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                          Issuing Body: {item.issuingBody} • State: {item.state}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span className="badge" style={{ ...badgeStyle, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} /> {badgeText}
                        </span>

                        <Link
                          to={`/scholarships/${item._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        >
                          {t('dashboard.viewDetails')} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Your Application Tracker Card Section */}
          <div className="sc-card" style={{ marginTop: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={22} style={{ color: 'var(--accent-orange)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {t('dashboard.applicationTracker')}
                </h3>
              </div>

              <Link to="/scholarships" style={{ fontWeight: 600, color: 'var(--primary-blue)', fontSize: '0.88rem' }}>
                {t('dashboard.browseMatchedBtn')} →
              </Link>
            </div>

            {loadingChecklists ? (
              <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem', padding: '20px 0' }}>
                Loading application tracker...
              </div>
            ) : checklists.length === 0 ? (
              /* Friendly Empty State */
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 20px',
                  backgroundColor: 'var(--gray-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--gray-600)',
                }}
              >
                <Award size={36} style={{ color: 'var(--gray-400)', marginBottom: '10px' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '4px' }}>
                  {t('dashboard.noChecklists')}
                </div>
                <Link to="/scholarships" className="btn btn-accent btn-sm" style={{ marginTop: '12px' }}>
                  {t('dashboard.browseMatchedBtn')}
                </Link>
              </div>
            ) : (
              /* Interacted Scholarships List */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {checklists.slice(0, 5).map((item) => (
                  <div
                    key={item._id || item.scholarshipId}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      backgroundColor: 'var(--gray-100)',
                      borderRadius: 'var(--radius-sm)',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <Link
                        to={`/scholarships/${item.scholarshipId}`}
                        style={{ fontWeight: 700, color: 'var(--gray-900)', textDecoration: 'none', fontSize: '0.95rem' }}
                      >
                        {getLocalizedText(item.scholarshipName, i18n.language) || 'Scholarship Scheme'}
                      </Link>
                      <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                        {t('dashboard.checkedDocs', { count: item.checkedDocuments?.length || 0, total: item.totalDocumentsRequired || 5 })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.applied ? (
                        <span className="badge badge-verified" style={{ fontSize: '0.8rem' }}>
                          <ShieldCheck size={13} /> {t('dashboard.statusApplied')}
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: 'var(--gray-200)', color: 'var(--gray-700)', fontSize: '0.8rem' }}>
                          {t('dashboard.statusInPrep')}
                        </span>
                      )}

                      <Link
                        to={`/scholarships/${item.scholarshipId}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        {t('dashboard.viewDetails')} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
