import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  User,
  GraduationCap,
  MapPin,
  IndianRupee,
  ShieldAlert,
  Award,
  Sparkles,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (UT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other UTs / Abroad',
];

const CLASS_OPTIONS = [
  { value: '1st', label: 'Class 1' },
  { value: '2nd', label: 'Class 2' },
  { value: '3rd', label: 'Class 3' },
  { value: '4th', label: 'Class 4' },
  { value: '5th', label: 'Class 5' },
  { value: '6th', label: 'Class 6' },
  { value: '7th', label: 'Class 7' },
  { value: '8th', label: 'Class 8' },
  { value: '9th', label: 'Class 9' },
  { value: '10th', label: 'Class 10' },
  { value: '11th', label: 'Class 11' },
  { value: '12th', label: 'Class 12' },
  { value: 'UG-1', label: 'Undergraduate Year 1 (UG-1)' },
  { value: 'UG-2', label: 'Undergraduate Year 2 (UG-2)' },
  { value: 'UG-3', label: 'Undergraduate Year 3 (UG-3)' },
  { value: 'UG-4', label: 'Undergraduate Year 4 (UG-4)' },
  { value: 'PG', label: 'Postgraduate / Master Degree (PG)' },
];

const Profile = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isErrorToast, setIsErrorToast] = useState(false);
  const [completeness, setCompleteness] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    academic: {
      currentClass: '',
      stream: '',
      institutionType: '',
      lastPercentage: '',
    },
    economic: {
      annualIncome: '',
      parentOccupation: '',
      familyStatus: 'none',
    },
    location: {
      state: '',
      district: '',
      areaType: '',
    },
    personal: {
      gender: '',
      category: '',
      disabilityStatus: false,
    },
    specialCategories: {
      sportsQuota: false,
      minorityReligion: false,
      exServicemenChild: false,
      firstGenLearner: false,
    },
  });

  // Fetch initial student profile
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
          const p = data.profile;
          setCompleteness(p.profileCompleteness || 0);

          setFormData({
            academic: {
              currentClass: p.academic?.currentClass || '',
              stream: p.academic?.stream || '',
              institutionType: p.academic?.institutionType || '',
              lastPercentage: p.academic?.lastPercentage !== null ? p.academic?.lastPercentage : '',
            },
            economic: {
              annualIncome: p.economic?.annualIncome !== null ? p.economic?.annualIncome : '',
              parentOccupation: p.economic?.parentOccupation || '',
              familyStatus: p.economic?.familyStatus || 'none',
            },
            location: {
              state: p.location?.state || '',
              district: p.location?.district || '',
              areaType: p.location?.areaType || '',
            },
            personal: {
              gender: p.personal?.gender || '',
              category: p.personal?.category || '',
              disabilityStatus: p.personal?.disabilityStatus || false,
            },
            specialCategories: {
              sportsQuota: p.specialCategories?.sportsQuota || false,
              minorityReligion: p.specialCategories?.minorityReligion || false,
              exServicemenChild: p.specialCategories?.exServicemenChild || false,
              firstGenLearner: p.specialCategories?.firstGenLearner || false,
            },
          });
        }
      } catch (err) {
        console.error('[Fetch Profile Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Handle nested changes
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Check if class requires stream field
  const isHigherEd = ['11th', '12th', 'UG-1', 'UG-2', 'UG-3', 'UG-4', 'PG'].includes(
    formData.academic.currentClass
  );

  // Save profile helper
  const saveProfileData = async (navigateAway = false) => {
    setSaving(true);
    setToastMessage('');
    setIsErrorToast(false);

    try {
      const payload = {
        academic: {
          ...formData.academic,
          lastPercentage: formData.academic.lastPercentage
            ? Number(formData.academic.lastPercentage)
            : null,
        },
        economic: {
          ...formData.economic,
          annualIncome: formData.economic.annualIncome
            ? Number(formData.economic.annualIncome)
            : null,
        },
        location: { ...formData.location },
        personal: { ...formData.personal },
        specialCategories: { ...formData.specialCategories },
      };

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const newScore = resData.profile.profileCompleteness || 0;
        setCompleteness(newScore);
        setIsErrorToast(false);
        setToastMessage(`Profile updated! ${newScore}% complete.`);

        if (navigateAway) {
          setTimeout(() => navigate('/dashboard'), 1200);
        }
      } else {
        console.error('[Save Profile Backend Error]:', resData);
        setIsErrorToast(true);
        setToastMessage(resData.message || resData.error || 'Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('[Save Profile Network/Console Error]:', err);
      setIsErrorToast(true);
      setToastMessage(err.message || 'Network error while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveProfileData(false);
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    await saveProfileData(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--gray-600)' }}>
        Loading student profile data...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', minHeight: 'calc(100vh - 150px)', backgroundColor: 'var(--gray-100)' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '8px' }}>
            {t('profile.headerTitle')}
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            {t('profile.headerSubtitle')}
          </p>
        </div>

        {/* Completeness Bar */}
        <div className="sc-card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-blue)' }}>
              {t('dashboard.completenessTitle')}
            </span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: completeness > 70 ? 'var(--success-green)' : 'var(--accent-orange-dark)' }}>
              {completeness}%
            </span>
          </div>

          <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${completeness}%`,
                height: '100%',
                background: completeness > 70
                  ? 'linear-gradient(90deg, #2e9e5b, #4ade80)'
                  : 'linear-gradient(90deg, #1a3a8f, #f7941d)',
                transition: 'width 0.4s ease-in-out',
              }}
            ></div>
          </div>
        </div>

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className={`alert ${isErrorToast ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '20px' }}>
            {isErrorToast ? (
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Step Wizard Container Card */}
        <div className="sc-card" style={{ padding: '32px' }}>
          
          {/* Wizard Step Navigation Tabs */}
          <div className="profile-steps-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--gray-200)', paddingBottom: '16px', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div
              onClick={() => setCurrentStep(1)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: currentStep === 1 ? 700 : 500,
                color: currentStep === 1 ? 'var(--primary-blue)' : 'var(--gray-500)',
                borderBottom: currentStep === 1 ? '3px solid var(--primary-blue)' : 'none',
                paddingBottom: '8px',
                marginBottom: '-18px',
              }}
            >
              <span className="badge badge-verified" style={{ width: '24px', height: '24px', borderRadius: '50%', justifyContent: 'center', padding: 0 }}>
                1
              </span>
              <span>{t('profile.step1')}</span>
            </div>

            <div
              onClick={() => setCurrentStep(2)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: currentStep === 2 ? 700 : 500,
                color: currentStep === 2 ? 'var(--primary-blue)' : 'var(--gray-500)',
                borderBottom: currentStep === 2 ? '3px solid var(--primary-blue)' : 'none',
                paddingBottom: '8px',
                marginBottom: '-18px',
              }}
            >
              <span className="badge badge-days-left" style={{ width: '24px', height: '24px', borderRadius: '50%', justifyContent: 'center', padding: 0 }}>
                2
              </span>
              <span>{t('profile.step2')}</span>
            </div>

            <div
              onClick={() => setCurrentStep(3)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: currentStep === 3 ? 700 : 500,
                color: currentStep === 3 ? 'var(--primary-blue)' : 'var(--gray-500)',
                borderBottom: currentStep === 3 ? '3px solid var(--primary-blue)' : 'none',
                paddingBottom: '8px',
                marginBottom: '-18px',
              }}
            >
              <span className="badge badge-featured" style={{ width: '24px', height: '24px', borderRadius: '50%', justifyContent: 'center', padding: 0 }}>
                3
              </span>
              <span>{t('profile.step3')}</span>
            </div>
          </div>

          {/* STEP 1: QUICK MATCH */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '20px' }}>
                Step 1 of 3: Core Eligibility Criteria
              </h3>

              <div className="profile-form-grid">
                {/* Current Class */}
                <div className="form-group">
                  <label className="form-label">Current Class / Education Level *</label>
                  <select
                    className="form-input"
                    value={formData.academic.currentClass}
                    onChange={(e) => handleNestedChange('academic', 'currentClass', e.target.value)}
                  >
                    <option value="">-- Select Class / Standard --</option>
                    {CLASS_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div className="form-group">
                  <label className="form-label">Domicile State / Union Territory *</label>
                  <select
                    className="form-input"
                    value={formData.location.state}
                    onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                  >
                    <option value="">-- Select Domicile State --</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Social Category *</label>
                  <select
                    className="form-input"
                    value={formData.personal.category}
                    onChange={(e) => handleNestedChange('personal', 'category', e.target.value)}
                  >
                    <option value="">-- Select Social Category --</option>
                    <option value="General">General (UR)</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority Community</option>
                  </select>
                </div>

                {/* Annual Income */}
                <div className="form-group">
                  <label className="form-label">Annual Family Income *</label>
                  <div className="form-input-wrapper">
                    <IndianRupee size={18} className="form-icon" />
                    <input
                      type="number"
                      className="form-input has-icon"
                      placeholder="e.g. 250000"
                      value={formData.economic.annualIncome}
                      onChange={(e) => handleNestedChange('economic', 'annualIncome', e.target.value)}
                    />
                  </div>
                  <span className="form-hint">Enter gross annual income in INR per year</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MORE DETAIL */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '20px' }}>
                Step 2 of 3: Academic & Background Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* District */}
                <div className="form-group">
                  <label className="form-label">District Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pune / Bengaluru Urban / Patna"
                    value={formData.location.district}
                    onChange={(e) => handleNestedChange('location', 'district', e.target.value)}
                  />
                </div>

                {/* Area Type */}
                <div className="form-group">
                  <label className="form-label">Area Type</label>
                  <div style={{ display: 'flex', gap: '24px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="areaType"
                        value="rural"
                        checked={formData.location.areaType === 'rural'}
                        onChange={(e) => handleNestedChange('location', 'areaType', e.target.value)}
                      />
                      <span>Rural Area</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="areaType"
                        value="urban"
                        checked={formData.location.areaType === 'urban'}
                        onChange={(e) => handleNestedChange('location', 'areaType', e.target.value)}
                      />
                      <span>Urban Area</span>
                    </label>
                  </div>
                </div>

                {/* Stream (Only shown if class 11th+) */}
                {isHigherEd && (
                  <div className="form-group">
                    <label className="form-label">Academic Stream / Field of Study</label>
                    <select
                      className="form-input"
                      value={formData.academic.stream}
                      onChange={(e) => handleNestedChange('academic', 'stream', e.target.value)}
                    >
                      <option value="">-- Select Stream --</option>
                      <option value="Science">Science (PCM/PCB)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts / Humanities</option>
                      <option value="Engineering">Engineering / Technology</option>
                      <option value="Medical">Medical / Healthcare / Pharma</option>
                      <option value="Management">Management (BBA/MBA)</option>
                      <option value="Vocational">Vocational / Skill Diploma</option>
                      <option value="Other">Other Stream</option>
                    </select>
                  </div>
                )}

                {/* Institution Type */}
                <div className="form-group">
                  <label className="form-label">Institution Type</label>
                  <select
                    className="form-input"
                    value={formData.academic.institutionType}
                    onChange={(e) => handleNestedChange('academic', 'institutionType', e.target.value)}
                  >
                    <option value="">-- Select School/College Type --</option>
                    <option value="Government">Government School/College</option>
                    <option value="Government-Aided">Government-Aided Institution</option>
                    <option value="Private">Private Institution</option>
                    <option value="Deemed">Deemed / Central University</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Last Percentage */}
                <div className="form-group">
                  <label className="form-label">Previous Year Marks (% or CGPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className="form-input"
                    placeholder="e.g. 88.5"
                    value={formData.academic.lastPercentage}
                    onChange={(e) => handleNestedChange('academic', 'lastPercentage', e.target.value)}
                  />
                </div>

                {/* Parent Occupation */}
                <div className="form-group">
                  <label className="form-label">Parent / Guardian Occupation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Farmer / Private Job / Business"
                    value={formData.economic.parentOccupation}
                    onChange={(e) => handleNestedChange('economic', 'parentOccupation', e.target.value)}
                  />
                </div>

                {/* Family Status */}
                <div className="form-group">
                  <label className="form-label">Family Background Status</label>
                  <select
                    className="form-input"
                    value={formData.economic.familyStatus}
                    onChange={(e) => handleNestedChange('economic', 'familyStatus', e.target.value)}
                  >
                    <option value="none">Standard Family Background</option>
                    <option value="singleParent">Single Parent Child</option>
                    <option value="orphan">Orphan / Destitute Child</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={formData.personal.gender}
                    onChange={(e) => handleNestedChange('personal', 'gender', e.target.value)}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SPECIAL CATEGORIES */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '8px' }}>
                Step 3 of 3: Special Quota & Affirmative Categories (Optional)
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Check any applicable quotas to unlock reserved, government-funded, and special grant scholarships.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <label className="sc-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-blue)' }}
                    checked={formData.personal.disabilityStatus}
                    onChange={(e) => handleNestedChange('personal', 'disabilityStatus', e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>Person with Disability (PWD / Differently Abled)</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Qualifies for PWD quota scholarships and assistive device stipends.</div>
                  </div>
                </label>

                <label className="sc-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-blue)' }}
                    checked={formData.specialCategories.minorityReligion}
                    onChange={(e) => handleNestedChange('specialCategories', 'minorityReligion', e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>Minority Religion (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Eligible for Ministry of Minority Affairs (MoMA) scholarships.</div>
                  </div>
                </label>

                <label className="sc-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-blue)' }}
                    checked={formData.specialCategories.sportsQuota}
                    onChange={(e) => handleNestedChange('specialCategories', 'sportsQuota', e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>Sports Quota Achievement (District / State / National Level)</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Unlocks sports excellence grants and athletic stipends.</div>
                  </div>
                </label>

                <label className="sc-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-blue)' }}
                    checked={formData.specialCategories.exServicemenChild}
                    onChange={(e) => handleNestedChange('specialCategories', 'exServicemenChild', e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>Child of Ex-Servicemen / Armed Forces / Police Personnel</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Prime Minister's Scholarship Scheme (PMSS) and defence welfare grants.</div>
                  </div>
                </label>

                <label className="sc-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', padding: '16px 20px' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-blue)' }}
                    checked={formData.specialCategories.firstGenLearner}
                    onChange={(e) => handleNestedChange('specialCategories', 'firstGenLearner', e.target.checked)}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>First-Generation Higher Education Learner</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Special fee waivers for students whose parents haven't attended college.</div>
                  </div>
                </label>

              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="profile-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--gray-200)', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} className="btn btn-secondary" disabled={saving}>
                  <ArrowLeft size={16} /> {t('profile.back')}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="btn btn-outline"
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? t('profile.saving') : t('profile.saveAndContinue')}</span>
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <span>{t('profile.saveAndContinue')}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await saveProfileData(true);
                  }}
                  className="btn btn-accent"
                  disabled={saving}
                >
                  <Sparkles size={16} />
                  <span>{saving ? t('profile.saving') : t('profile.submitProfile')}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
