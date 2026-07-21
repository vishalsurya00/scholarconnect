import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, ShieldCheck, Award, BookOpen, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const studentName = user?.fullName || 'Student';

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
                  Welcome, {studentName}! Dashboard coming soon.
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem' }}>
                  Your student authentication is verified & active.
                </p>
              </div>
            </div>

            <button onClick={logout} className="btn btn-outline btn-sm" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            
            {/* Student Profile Card */}
            <div className="sc-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} /> Account Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
                <div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600 }}>FULL NAME</div>
                  <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{user?.fullName}</div>
                </div>

                {user?.email && (
                  <div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600 }}>EMAIL ADDRESS</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={15} style={{ color: 'var(--primary-blue)' }} />
                      <span>{user.email}</span>
                    </div>
                  </div>
                )}

                {user?.phone && (
                  <div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600 }}>PHONE NUMBER</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} style={{ color: 'var(--primary-blue)' }} />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600 }}>ROLE</div>
                  <span className="badge badge-verified" style={{ marginTop: '4px' }}>
                    <ShieldCheck size={14} /> Student (Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Features Placeholder Notice */}
            <div className="sc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span className="badge badge-featured">Step 1 Ready</span>
                <span className="badge badge-days-left">Step 2 Coming Next</span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '12px' }}>
                Welcome, {studentName}! Dashboard coming soon.
              </h2>
              
              <p style={{ color: 'var(--gray-600)', marginBottom: '20px', lineHeight: '1.7' }}>
                Step 1 of ScholarConnect project setup is successfully completed. In the upcoming steps, you will be able to fill out your academic profile (Class 1 to Postgraduate), filter verified scholarships across India, and receive personalized eligibility match scores.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '10px' }}>
                <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <Award size={28} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Scholarship Matching</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>Automated criteria match</div>
                </div>

                <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <BookOpen size={28} style={{ color: 'var(--primary-blue)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Class 1 - Postgrad</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>All education levels</div>
                </div>

                <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <Clock size={28} style={{ color: 'var(--success-green)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Deadline Alerts</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>Never miss a deadline</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
