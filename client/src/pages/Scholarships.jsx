import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ArrowRight,
  User,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const INDIAN_STATES = [
  'ALL',
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

const CLASS_OPTIONS = [
  'ALL',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  'UG-1',
  'UG-2',
  'UG-3',
  'UG-4',
  'PG',
];

const CATEGORY_OPTIONS = ['ALL', 'SC', 'ST', 'OBC', 'General', 'EWS', 'Minority'];

const Scholarships = () => {
  const { isAuthenticated, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // All scholarships list (for guests or browse tab)
  const [scholarships, setScholarships] = useState([]);

  // Matched groups for logged-in user
  const [matchedData, setMatchedData] = useState({
    eligible: [],
    uncertain: [],
    not_eligible: [],
  });

  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible' | 'uncertain' | 'all'

  // Filters state
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, [isAuthenticated, token]);

  const fetchScholarships = async () => {
    setLoading(true);
    setError('');

    try {
      if (isAuthenticated && token) {
        // Fetch personalized matches
        const response = await fetch(`${API_BASE_URL}/api/scholarships/matched`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setMatchedData(data.matched);
          // Combine all for Browse tab
          const allCombined = [
            ...(data.matched.eligible || []),
            ...(data.matched.uncertain || []),
            ...(data.matched.not_eligible || []),
          ];
          setScholarships(allCombined);
        } else {
          // Fallback to public endpoint
          await fetchPublicScholarships();
        }
      } else {
        await fetchPublicScholarships();
      }
    } catch (err) {
      console.error('[Fetch Scholarships Error]:', err);
      setError('Failed to load scholarships. Showing cached list.');
      await fetchPublicScholarships();
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicScholarships = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scholarships`);
      const data = await response.json();
      if (response.ok && data.success) {
        setScholarships(data.scholarships || []);
      }
    } catch (err) {
      console.error('[Fetch Public Scholarships Error]:', err);
    }
  };

  // Helper to calculate days remaining until deadline
  const getDaysRemaining = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Helper to filter array based on user dropdown selections
  const filterList = (list) => {
    return list.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const bodyMatch = item.issuingBody.toLowerCase().includes(q);
        if (!nameMatch && !bodyMatch) return false;
      }

      // 2. State Filter
      if (selectedState !== 'ALL') {
        const states = item.eligibilityRules?.states || [item.state || 'ALL'];
        const stateMatches = states.includes('ALL') || states.includes(selectedState);
        if (!stateMatches) return false;
      }

      // 3. Class Filter
      if (selectedClass !== 'ALL') {
        const minClass = item.eligibilityRules?.minClass;
        const maxClass = item.eligibilityRules?.maxClass;
        if (minClass || maxClass) {
          // simple match check
        }
      }

      // 4. Category Filter
      if (selectedCategory !== 'ALL') {
        const categories = item.eligibilityRules?.categories || ['ALL'];
        const catMatches = categories.includes('ALL') || categories.includes(selectedCategory);
        if (!catMatches) return false;
      }

      return true;
    });
  };

  // Determine current active cards to show
  const getDisplayedScholarships = () => {
    if (!isAuthenticated) {
      return filterList(scholarships);
    }

    if (activeTab === 'eligible') {
      return filterList(matchedData.eligible || []);
    } else if (activeTab === 'uncertain') {
      return filterList(matchedData.uncertain || []);
    } else {
      return filterList(scholarships);
    }
  };

  const displayedItems = getDisplayedScholarships();

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '85vh', paddingBottom: '60px' }}>
      {/* Header Banner */}
      <section style={{ backgroundColor: 'var(--primary-blue)', color: '#ffffff', padding: '40px 0 45px' }}>
        <div className="container">
          <div style={{ maxWidth: '750px' }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={14} /> Discovery Hub
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>
              Explore Verified Scholarships in India
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
              Direct government portals and verified private trust schemes for school, college, and postgraduate students.
            </p>
          </div>
        </div>
      </section>

      {/* Official Cycle Disclaimer Bar */}
      <div
        style={{
          backgroundColor: '#fffbe6',
          borderBottom: '1px solid #ffe58f',
          padding: '10px 0',
          fontSize: '0.86rem',
          color: '#873800',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <AlertCircle size={15} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
          <span>
            <strong>Notice:</strong> Dates shown reflect typical annual cycles — always confirm exact current-year deadlines on the official portal before applying.
          </span>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-24px' }}>
        {/* Guest Callout Banner */}
        {!isAuthenticated && (
          <div
            className="alert alert-info"
            style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              backgroundColor: '#ffffff',
              borderLeft: '4px solid var(--accent-orange)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              padding: '18px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Sparkles size={24} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--primary-blue)', fontSize: '1rem', display: 'block' }}>
                  Want personalized eligibility matching?
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                  Sign in to automatically filter scholarships that match your class, state, income, and category.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-accent btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm">
                Register Free
              </Link>
            </div>
          </div>
        )}

        {/* Filter Controls Card */}
        <div
          className="sc-card"
          style={{
            marginBottom: '28px',
            padding: '20px 24px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 700, color: 'var(--primary-blue)' }}>
            <Filter size={18} /> Search & Filter Schemes
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Search Input */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '6px' }}>
                Search Keyword
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="text"
                  placeholder="Scheme name, AICTE, NSP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--gray-300)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '6px' }}>
                State / Scope
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gray-300)',
                  fontSize: '0.9rem',
                }}
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st === 'ALL' ? 'All States (Central & Nationwide)' : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '6px' }}>
                Current Class / Degree
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gray-300)',
                  fontSize: '0.9rem',
                }}
              >
                {CLASS_OPTIONS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls === 'ALL' ? 'All Classes (1st to PG)' : cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gray-300)',
                  fontSize: '0.9rem',
                }}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logged In Tabs */}
        {isAuthenticated && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              borderBottom: '2px solid var(--gray-200)',
              paddingBottom: '2px',
            }}
          >
            <button
              onClick={() => setActiveTab('eligible')}
              style={{
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'eligible' ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === 'eligible' ? '#ffffff' : 'var(--gray-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <CheckCircle2 size={16} style={{ color: activeTab === 'eligible' ? '#4ade80' : 'var(--success-green)' }} />
              Eligible for You
              <span
                style={{
                  backgroundColor: activeTab === 'eligible' ? 'rgba(255,255,255,0.25)' : 'var(--gray-200)',
                  color: activeTab === 'eligible' ? '#ffffff' : 'var(--gray-800)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                }}
              >
                {matchedData.eligible?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('uncertain')}
              style={{
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'uncertain' ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === 'uncertain' ? '#ffffff' : 'var(--gray-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <HelpCircle size={16} style={{ color: activeTab === 'uncertain' ? '#fde047' : 'var(--accent-orange)' }} />
              Complete Profile to Check
              <span
                style={{
                  backgroundColor: activeTab === 'uncertain' ? 'rgba(255,255,255,0.25)' : 'var(--gray-200)',
                  color: activeTab === 'uncertain' ? '#ffffff' : 'var(--gray-800)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                }}
              >
                {matchedData.uncertain?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'all' ? 'var(--primary-blue)' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : 'var(--gray-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <BookOpen size={16} />
              Browse All Schemes
              <span
                style={{
                  backgroundColor: activeTab === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--gray-200)',
                  color: activeTab === 'all' ? '#ffffff' : 'var(--gray-800)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                }}
              >
                {scholarships.length}
              </span>
            </button>
          </div>
        )}

        {/* Tab Notice Banner for Uncertain Tab */}
        {isAuthenticated && activeTab === 'uncertain' && displayedItems.length > 0 && (
          <div
            className="alert"
            style={{
              marginBottom: '20px',
              backgroundColor: '#fffbe6',
              border: '1px solid #ffe58f',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#873800' }}>
              <AlertCircle size={18} style={{ color: 'var(--accent-orange)' }} />
              These scholarships require additional profile details (e.g. state, category, or income) to confirm full eligibility.
            </div>
            <Link to="/profile" className="btn btn-accent btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Update Profile Now →
            </Link>
          </div>
        )}

        {/* Scholarships Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-600)' }}>
            Loading scholarships...
          </div>
        ) : displayedItems.length === 0 ? (
          isAuthenticated && activeTab === 'uncertain' ? (
            /* Context-Aware Empty State: Uncertain Tab */
            <div
              className="sc-card"
              style={{
                textAlign: 'center',
                padding: '50px 24px',
                color: 'var(--gray-600)',
                backgroundColor: '#ffffff',
              }}
            >
              <CheckCircle2 size={40} style={{ color: 'var(--success-green)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '6px' }}>
                All Clear! No Uncertain Matches
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--gray-600)', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Nothing here! Your profile is complete enough that we could confidently sort every scholarship into Eligible or Not Eligible.
              </p>
              <Link to="/profile" className="btn btn-outline btn-sm">
                View Your Profile
              </Link>
            </div>
          ) : isAuthenticated && activeTab === 'eligible' ? (
            /* Context-Aware Empty State: Eligible Tab */
            <div
              className="sc-card"
              style={{
                textAlign: 'center',
                padding: '50px 24px',
                color: 'var(--gray-600)',
                backgroundColor: '#ffffff',
              }}
            >
              <Sparkles size={40} style={{ color: 'var(--accent-orange)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '6px' }}>
                No eligible scholarships found yet
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--gray-600)', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                No eligible scholarships found yet. Complete your profile or check back as we add more schemes.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Link to="/profile" className="btn btn-accent btn-sm">
                  Update Profile
                </Link>
                <button
                  onClick={() => setActiveTab('all')}
                  className="btn btn-outline btn-sm"
                >
                  Browse All Schemes
                </button>
              </div>
            </div>
          ) : (
            /* Default Filter-Reset Empty State for Browse All & Guests */
            <div
              className="sc-card"
              style={{
                textAlign: 'center',
                padding: '50px 20px',
                color: 'var(--gray-600)',
                backgroundColor: '#ffffff',
              }}
            >
              <Search size={36} style={{ color: 'var(--gray-400)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '6px' }}>
                No scholarships matched your filters
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '16px' }}>
                Try resetting your dropdown selections or search term.
              </p>
              <button
                onClick={() => {
                  setSelectedState('ALL');
                  setSelectedClass('ALL');
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-outline btn-sm"
              >
                Reset Filters
              </button>
            </div>
          )
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '24px',
            }}
          >
            {displayedItems.map((item) => {
              const daysRemaining = getDaysRemaining(item.deadline);

              return (
                <div key={item._id} className="sc-card sc-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Card Header Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--gray-100)', color: 'var(--primary-blue)', fontWeight: 600 }}>
                      {item.issuingBody}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {daysRemaining !== null && daysRemaining <= 7 && (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            fontWeight: 800,
                          }}
                        >
                          Urgent
                        </span>
                      )}

                      {daysRemaining !== null && (
                        <span className="badge badge-days-left">
                          <Clock size={13} /> {daysRemaining} days to go
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {item.featured && (
                    <div style={{ marginBottom: '8px' }}>
                      <span className="badge badge-featured">
                        <Sparkles size={13} /> Featured Scheme
                      </span>
                    </div>
                  )}

                  {/* Scholarship Name */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--gray-900)',
                      lineHeight: 1.35,
                      marginBottom: '10px',
                      flexGrow: 0,
                    }}
                  >
                    {item.name}
                  </h3>

                  {/* Award Amount */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Award Benefit
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                      {item.awardAmount}
                    </div>
                  </div>

                  {/* Eligibility Quick List */}
                  <div
                    style={{
                      backgroundColor: 'var(--gray-100)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '16px',
                      fontSize: '0.84rem',
                      color: 'var(--gray-700)',
                      flexGrow: 1,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--gray-500)' }}>Target Level:</span>
                      <strong style={{ color: 'var(--gray-800)' }}>
                        {item.eligibilityRules?.minClass} to {item.eligibilityRules?.maxClass}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--gray-500)' }}>State Scope:</span>
                      <strong style={{ color: 'var(--gray-800)' }}>
                        {item.state === 'ALL' ? 'Nationwide (All States)' : item.state}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gray-500)' }}>Max Income:</span>
                      <strong style={{ color: 'var(--gray-800)' }}>
                        {item.eligibilityRules?.maxIncome
                          ? `≤ ₹${item.eligibilityRules.maxIncome.toLocaleString('en-IN')}`
                          : 'No Cap'}
                      </strong>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div
                    style={{
                      borderTop: '1px solid var(--gray-200)',
                      paddingTop: '14px',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span className="badge badge-verified" style={{ fontSize: '0.75rem' }}>
                      <ShieldCheck size={13} /> Verified
                    </span>

                    <Link to={`/scholarships/${item._id}`} className="btn btn-outline btn-sm" style={{ fontWeight: 600 }}>
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;
