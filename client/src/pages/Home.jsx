import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Clock, Award, Sparkles, CheckCircle2, ArrowRight, UserCheck, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const studentName = user?.fullName ? user.fullName.split(' ')[0] : 'Student';

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-hero" style={{ padding: '60px 0 70px', textAlignment: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          {isAuthenticated ? (
            <>
              <span
                className="badge badge-featured"
                style={{
                  marginBottom: '16px',
                  background: 'rgba(46, 158, 91, 0.15)',
                  color: '#4ade80',
                  borderColor: 'rgba(74, 222, 128, 0.3)',
                }}
              >
                <Sparkles size={14} /> {t('home.welcomeBackTitle', { name: studentName })}
              </span>

              <h1
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '20px',
                  maxWidth: '800px',
                  margin: '0 auto 20px',
                }}
              >
                {t('home.welcomeBackTitle', { name: user?.fullName || 'Student' })}
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '640px',
                  margin: '0 auto 32px',
                  lineHeight: 1.6,
                }}
              >
                {t('home.welcomeBackSubtitle')}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/scholarships" className="btn btn-accent btn-lg">
                  <LayoutDashboard size={18} /> {t('home.viewMatched')}
                </Link>
                <Link
                  to="/profile"
                  className="btn btn-outline btn-lg"
                  style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  <UserCheck size={18} /> {t('home.myProfile')}
                </Link>
              </div>
            </>
          ) : (
            <>
              <span
                className="badge badge-featured"
                style={{
                  marginBottom: '16px',
                  background: 'rgba(46, 158, 91, 0.15)',
                  color: '#4ade80',
                  borderColor: 'rgba(74, 222, 128, 0.3)',
                }}
              >
                <Sparkles size={14} /> {t('home.badge')}
              </span>

              <h1
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '20px',
                  maxWidth: '800px',
                  margin: '0 auto 20px',
                }}
              >
                {t('home.title')}
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '640px',
                  margin: '0 auto 32px',
                  lineHeight: 1.6,
                }}
              >
                {t('home.subtitle')}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-accent btn-lg">
                  {t('home.getStarted')} <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg"
                  style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  {t('home.signIn')}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Feature Badges Showcase (Design System Demo) */}
      <section style={{ padding: '50px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '8px' }}>
              {t('home.trustTitle')}
            </h2>
            <p style={{ color: 'var(--gray-600)' }}>
              Built with complete transparency, verified sources, and real-time deadline tracking.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Card 1 */}
            <div className="sc-card sc-card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="badge badge-featured">
                  <Sparkles size={14} /> Featured
                </span>
                <span className="badge badge-days-left">
                  <Clock size={14} /> 12 days to go
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--gray-900)' }}>
                National Merit Scholarship Scheme 2026
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
                Financial assistance for meritorious students belonging to economically weaker sections to prevent drop-out at class VIII level.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-200)', paddingTop: '14px' }}>
                <span className="badge badge-verified">
                  <ShieldCheck size={14} /> Verified Source
                </span>
                <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>₹12,000 / year</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="sc-card sc-card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="badge badge-featured">
                  <Sparkles size={14} /> Featured
                </span>
                <span className="badge badge-days-left">
                  <Clock size={14} /> 25 days to go
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--gray-900)' }}>
                Post-Matric Scholarship for SC/ST Students
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
                Full tuition fee coverage and maintenance allowance for post-secondary education in recognized Indian institutions.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-200)', paddingTop: '14px' }}>
                <span className="badge badge-verified">
                  <ShieldCheck size={14} /> Verified Source
                </span>
                <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>100% Fee Waiver</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="sc-card sc-card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className="badge badge-category">Engineering / Tech</span>
                <span className="badge badge-days-left">
                  <Clock size={14} /> 5 days to go
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--gray-900)' }}>
                Pragati Scholarship for Girl Students
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
                AICTE initiative supporting young women pursuing technical diploma or degree courses across India.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-200)', paddingTop: '14px' }}>
                <span className="badge badge-verified">
                  <ShieldCheck size={14} /> Verified Source
                </span>
                <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>₹50,000 / year</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Target Audience Sections */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--gray-100)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
              Scholarships for Every Education Stage
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="sc-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎒</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Class 1 to 10</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Pre-matric & talent search exams</p>
            </div>

            <div className="sc-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Class 11 & 12</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Higher secondary & coaching support</p>
            </div>

            <div className="sc-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎓</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Undergraduate (UG)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>B.Tech, MBBS, B.Com, B.Sc & Diplomas</p>
            </div>

            <div className="sc-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔬</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Postgraduate (PG)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>M.Tech, M.Sc, Ph.D. & Fellowship programs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
