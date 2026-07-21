import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  ExternalLink,
  CheckSquare,
  Square,
  ArrowLeft,
  Award,
  Sparkles,
  Building,
  FileText,
  AlertCircle,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { getLocalizedText } from '../utils/languageUtils';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, token } = useAuth();
  const { t, i18n } = useTranslation();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Checklist & Applied State
  const [checkedDocs, setCheckedDocs] = useState([]);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchDetail();
    if (isAuthenticated && token) {
      fetchChecklist();
    }
  }, [id, isAuthenticated, token]);

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/scholarships/${id}`);
      const data = await response.json();

      if (response.ok && data.success && data.scholarship) {
        setScholarship(data.scholarship);
      } else {
        throw new Error(data.message || 'Scholarship not found.');
      }
    } catch (err) {
      console.error('[Fetch Detail Error]:', err);
      setError(err.message || 'Failed to load scholarship details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/checklist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success && data.checklist) {
        setCheckedDocs(data.checklist.checkedDocuments || []);
        setApplied(!!data.checklist.applied);
      }
    } catch (err) {
      console.error('[Fetch Checklist Error]:', err);
    }
  };

  const handleToggleDoc = async (docName) => {
    let newDocs = [];
    if (checkedDocs.includes(docName)) {
      newDocs = checkedDocs.filter((d) => d !== docName);
    } else {
      newDocs = [...checkedDocs, docName];
    }

    setCheckedDocs(newDocs);

    if (isAuthenticated && token) {
      try {
        await fetch(`${API_BASE_URL}/api/checklist/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ checkedDocuments: newDocs }),
        });
      } catch (err) {
        console.error('[Auto-save Checklist Error]:', err);
      }
    }
  };

  const handleApplyClick = async () => {
    if (isAuthenticated && token && !applied) {
      setApplied(true);
      try {
        await fetch(`${API_BASE_URL}/api/checklist/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ applied: true }),
        });
      } catch (err) {
        console.error('[Mark Applied Error]:', err);
      }
    }
  };

  const getDaysRemaining = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '80vh', padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ color: 'var(--gray-600)' }}>
          Loading scholarship details...
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '80vh', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div className="sc-card" style={{ padding: '40px 24px' }}>
            <AlertCircle size={48} style={{ color: 'var(--accent-orange)', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Scholarship Not Found</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>{error || 'The requested scholarship could not be found.'}</p>
            <Link to="/scholarships" className="btn btn-primary">
              <ArrowLeft size={16} /> Back to Scholarships
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rules = scholarship.eligibilityRules || {};
  const daysRemaining = getDaysRemaining(scholarship.deadline);

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '85vh', paddingBottom: '60px' }}>
      {/* Top Breadcrumb Header */}
      <section style={{ backgroundColor: 'var(--primary-blue)', color: '#ffffff', padding: '30px 0 35px' }}>
        <div className="container">
          <Link
            to="/scholarships"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> {t('detail.backToList')}
          </Link>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff' }}>
              <Building size={14} /> {scholarship.issuingBody}
            </span>
            {scholarship.featured && (
              <span className="badge badge-featured">
                <Sparkles size={14} /> Featured Scheme
              </span>
            )}
            {daysRemaining !== null && (
              <span className="badge badge-days-left">
                <Clock size={14} /> {t('dashboard.daysLeft', { days: daysRemaining })}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, maxWidth: '850px' }}>
            {getLocalizedText(scholarship.name, i18n.language)}
          </h1>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Main Left Detail Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Award Overview Card */}
            <div className="sc-card" style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--primary-blue)', fontWeight: 700 }}>
                <Award size={22} /> {t('detail.awardAmount')}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '10px' }}>
                {getLocalizedText(scholarship.awardAmount, i18n.language)}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--gray-600)', margin: 0 }}>
                {scholarship.renewable
                  ? '🔄 Renewable each academic year subject to satisfactory performance.'
                  : '📌 One-time financial assistance grant.'}
              </p>
            </div>

            {/* Eligibility Criteria Breakdown */}
            <div className="sc-card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} /> {t('detail.eligibilityTitle')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', marginTop: '7px' }}></div>
                  <div>
                    <strong style={{ color: 'var(--gray-900)' }}>{t('scholarships.classLabel')}:</strong>
                    <div style={{ fontSize: '0.92rem', color: 'var(--gray-700)' }}>
                      Students currently enrolled in Class <strong>{rules.minClass || '1st'}</strong> to <strong>{rules.maxClass || 'PG'}</strong>.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', marginTop: '7px' }}></div>
                  <div>
                    <strong style={{ color: 'var(--gray-900)' }}>{t('scholarships.stateLabel')}:</strong>
                    <div style={{ fontSize: '0.92rem', color: 'var(--gray-700)' }}>
                      {rules.states && rules.states.includes('ALL') || scholarship.state === 'ALL'
                        ? 'Open to students residing in any State or UT across India.'
                        : `Must be a resident / domicile of ${rules.states?.join(', ') || scholarship.state}.`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', marginTop: '7px' }}></div>
                  <div>
                    <strong style={{ color: 'var(--gray-900)' }}>{t('dashboard.familyIncome')}:</strong>
                    <div style={{ fontSize: '0.92rem', color: 'var(--gray-700)' }}>
                      {rules.maxIncome
                        ? `Gross family income from all sources must NOT exceed ₹${rules.maxIncome.toLocaleString('en-IN')} / year.`
                        : 'No upper income ceiling restriction specified.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', marginTop: '7px' }}></div>
                  <div>
                    <strong style={{ color: 'var(--gray-900)' }}>{t('scholarships.categoryLabel')}:</strong>
                    <div style={{ fontSize: '0.92rem', color: 'var(--gray-700)' }}>
                      {rules.categories && rules.categories.includes('ALL')
                        ? 'Open for all categories (General, SC, ST, OBC, EWS, Minority).'
                        : `Eligible Categories: ${rules.categories?.join(', ')}.`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents Checklist Card */}
            <div className="sc-card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} /> {t('detail.documentsTitle')}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--gray-600)', marginBottom: '18px' }}>
                {t('detail.checklistHelp')}
              </p>

              {/* Document Progress Indicator Bar */}
              {scholarship.documentsRequired && scholarship.documentsRequired.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '6px' }}>
                    <span>
                      {t('dashboard.checkedDocs', { count: checkedDocs.length, total: scholarship.documentsRequired.length })}
                    </span>
                    <span>
                      {Math.round((checkedDocs.length / scholarship.documentsRequired.length) * 100)}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(checkedDocs.length / scholarship.documentsRequired.length) * 100}%`,
                        height: '100%',
                        backgroundColor: checkedDocs.length === scholarship.documentsRequired.length ? 'var(--success-green)' : 'var(--accent-orange)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {scholarship.documentsRequired && scholarship.documentsRequired.length > 0 ? (
                  scholarship.documentsRequired.map((docItem) => {
                    const docText = getLocalizedText(docItem, i18n.language);
                    const isChecked = checkedDocs.includes(docText) || (typeof docItem === 'string' && checkedDocs.includes(docItem));
                    return (
                      <div
                        key={docText}
                        onClick={() => handleToggleDoc(docText)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isChecked ? '#f0fdf4' : 'var(--gray-100)',
                          border: isChecked ? '1px solid #bbf7d0' : '1px solid var(--gray-200)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isChecked ? (
                          <CheckSquare size={18} style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                        ) : (
                          <Square size={18} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: '0.92rem', color: isChecked ? 'var(--gray-900)' : 'var(--gray-700)', fontWeight: isChecked ? 600 : 400 }}>
                          {docText}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>No specific documents specified.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Action Box */}
          <div>
            <div
              className="sc-card"
              style={{
                position: 'sticky',
                top: '20px',
                padding: '24px',
                borderTop: '4px solid var(--accent-orange)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-green)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>
                <ShieldCheck size={18} /> Verified Scheme Details
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '4px' }}>{t('detail.deadline')}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                  {new Date(scholarship.deadline).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '4px' }}>Last Verified Date</div>
                <div style={{ fontSize: '0.92rem', color: 'var(--gray-700)', fontWeight: 600 }}>
                  {t('detail.lastVerifiedOn', { date: new Date(scholarship.lastVerifiedDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) })}
                </div>
              </div>

              {/* Applied Status Badge */}
              {applied && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#e6f4ea',
                    border: '1px solid #b7e1cd',
                    color: '#137333',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px',
                  }}
                >
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                  <span>{t('detail.appliedBadge')}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href={scholarship.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleApplyClick}
                  className="btn btn-accent btn-lg"
                  style={{ justifyContent: 'center', width: '100%', textDecoration: 'none' }}
                >
                  {t('detail.applyBtn')} <ExternalLink size={18} />
                </a>

                {scholarship.sourceVerifiedLink && (
                  <a
                    href={scholarship.sourceVerifiedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md"
                    style={{ justifyContent: 'center', width: '100%', textDecoration: 'none', color: 'var(--primary-blue)', borderColor: 'var(--gray-300)' }}
                  >
                    {t('detail.sourceVerified')} <ExternalLink size={15} />
                  </a>
                )}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)', fontSize: '0.82rem', color: 'var(--gray-500)', textAlign: 'center' }}>
                ScholarConnect never charges fees for applying to scholarships.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
