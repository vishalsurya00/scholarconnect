import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <GraduationCap size={24} />
              <span>ScholarConnect</span>
            </div>
            <p style={{ maxWidth: '320px', lineHeight: '1.6' }}>
              Empowering students across India — from Class 1 through Postgraduate degrees — with transparent, verified, and accessible scholarship opportunities.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Browse Scholarships</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/dashboard">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              <li><a href="#class1-10">School (Class 1 - 10)</a></li>
              <li><a href="#class11-12">Higher Secondary (11-12)</a></li>
              <li><a href="#undergrad">Undergraduate (UG)</a></li>
              <li><a href="#postgrad">Postgraduate (PG)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Trust & Transparency</h4>
            <ul className="footer-links">
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} style={{ color: '#2e9e5b' }} /> 100% Verified Sources
                </span>
              </li>
              <li><span>Direct Government & Trust Links</span></li>
              <li><span>Free for All Students</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ScholarConnect. Built for Indian Students with <Heart size={14} style={{ color: '#f7941d', display: 'inline' }} />.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
