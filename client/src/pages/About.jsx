import React from 'react';
import { ShieldCheck, Target, Heart, GraduationCap, Award } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '50px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-verified" style={{ marginBottom: '12px' }}>
              About ScholarConnect
            </span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '16px' }}>
              Bridging the Educational Opportunity Gap in India
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--gray-600)', lineHeight: '1.6' }}>
              ScholarConnect is dedicated to ensuring no deserving student in India abandons their education due to financial constraints.
            </p>
          </div>

          <div className="sc-card" style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={22} style={{ color: 'var(--accent-orange)' }} /> Our Mission
            </h3>
            <p style={{ color: 'var(--gray-700)', lineHeight: '1.7' }}>
              Thousands of scholarships offered by central and state governments, corporate CSR initiatives, and non-profit trusts go unutilized every year simply because students do not know they exist. ScholarConnect centralizes and verifies these opportunities into an easy-to-search platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="sc-card">
              <ShieldCheck size={32} style={{ color: 'var(--success-green)', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>100% Verified Links</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                Every scholarship listed is manually audited to protect students from scams and fake application portals.
              </p>
            </div>

            <div className="sc-card">
              <GraduationCap size={32} style={{ color: 'var(--primary-blue)', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>For All Education Levels</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                From primary school (Class 1) to doctoral research (Ph.D.), we cover every academic milestone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
