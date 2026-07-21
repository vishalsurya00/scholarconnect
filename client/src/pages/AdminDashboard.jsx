import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Globe,
  X,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { getLocalizedText } from '../utils/languageUtils';

const AdminDashboard = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalScholarships: 0,
    activeScholarships: 0,
    inactiveScholarships: 0,
    totalApplicationsTracked: 0,
  });

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalTab, setModalTab] = useState('en'); // 'en', 'hi', 'kn'
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields State
  const initialFormState = {
    nameEn: '',
    nameHi: '',
    nameKn: '',
    awardAmountEn: '',
    awardAmountHi: '',
    awardAmountKn: '',
    docsEn: '',
    docsHi: '',
    docsKn: '',
    issuingBody: 'Central Govt',
    state: 'ALL',
    deadline: '',
    applicationLink: '',
    sourceVerifiedLink: '',
    isActive: true,
    featured: false,
    minClass: '1st',
    maxClass: 'PG',
    maxIncome: '',
    categories: ['ALL'],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch Stats & All Scholarships in parallel
      const [statsRes, scholarshipsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/scholarships`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const scholarshipsData = await scholarshipsRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }
      if (scholarshipsData.success) {
        setScholarships(scholarshipsData.scholarships || []);
      }
    } catch (err) {
      console.error('[Admin Fetch Error]:', err);
      setError('Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setModalTab('en');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setModalError('');

    // Extract multilingual names
    const nameObj = typeof item.name === 'object' ? item.name : { en: item.name };
    const awardObj = typeof item.awardAmount === 'object' ? item.awardAmount : { en: item.awardAmount };

    // Format docs as newline separated text
    const docs = item.documentsRequired || [];
    let docsEnArr = [], docsHiArr = [], docsKnArr = [];
    docs.forEach(doc => {
      if (typeof doc === 'object') {
        if (doc.en) docsEnArr.push(doc.en);
        if (doc.hi) docsHiArr.push(doc.hi);
        if (doc.kn) docsKnArr.push(doc.kn);
      } else {
        docsEnArr.push(doc);
      }
    });

    setFormData({
      nameEn: nameObj.en || '',
      nameHi: nameObj.hi || '',
      nameKn: nameObj.kn || '',
      awardAmountEn: awardObj.en || '',
      awardAmountHi: awardObj.hi || '',
      awardAmountKn: awardObj.kn || '',
      docsEn: docsEnArr.join('\n'),
      docsHi: docsHiArr.join('\n'),
      docsKn: docsKnArr.join('\n'),
      issuingBody: item.issuingBody || 'Central Govt',
      state: item.state || 'ALL',
      deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : '',
      applicationLink: item.applicationLink || '',
      sourceVerifiedLink: item.sourceVerifiedLink || '',
      isActive: item.isActive !== false,
      featured: !!item.featured,
      minClass: item.eligibilityRules?.minClass || '1st',
      maxClass: item.eligibilityRules?.maxClass || 'PG',
      maxIncome: item.eligibilityRules?.maxIncome || '',
      categories: item.eligibilityRules?.categories || ['ALL'],
    });

    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleSaveScholarship = async (e) => {
    e.preventDefault();
    if (!formData.nameEn.trim() || !formData.awardAmountEn.trim() || !formData.deadline || !formData.applicationLink.trim() || !formData.sourceVerifiedLink.trim()) {
      setModalError('Please fill in all required English fields (Name, Award Amount, Deadline, Links).');
      return;
    }

    setSaving(true);
    setModalError('');

    // Construct multilingual objects
    const name = {
      en: formData.nameEn.trim(),
      ...(formData.nameHi.trim() ? { hi: formData.nameHi.trim() } : {}),
      ...(formData.nameKn.trim() ? { kn: formData.nameKn.trim() } : {}),
    };

    const awardAmount = {
      en: formData.awardAmountEn.trim(),
      ...(formData.awardAmountHi.trim() ? { hi: formData.awardAmountHi.trim() } : {}),
      ...(formData.awardAmountKn.trim() ? { kn: formData.awardAmountKn.trim() } : {}),
    };

    // Parse docs list
    const docsEnList = formData.docsEn.split('\n').map(d => d.trim()).filter(Boolean);
    const docsHiList = formData.docsHi.split('\n').map(d => d.trim()).filter(Boolean);
    const docsKnList = formData.docsKn.split('\n').map(d => d.trim()).filter(Boolean);

    const documentsRequired = docsEnList.map((docEn, idx) => {
      const docObj = { en: docEn };
      if (docsHiList[idx]) docObj.hi = docsHiList[idx];
      if (docsKnList[idx]) docObj.kn = docsKnList[idx];
      return docObj;
    });

    const payload = {
      name,
      issuingBody: formData.issuingBody,
      state: formData.state,
      deadline: new Date(formData.deadline),
      renewable: false,
      awardAmount,
      applicationLink: formData.applicationLink.trim(),
      sourceVerifiedLink: formData.sourceVerifiedLink.trim(),
      documentsRequired,
      eligibilityRules: {
        minClass: formData.minClass,
        maxClass: formData.maxClass,
        maxIncome: formData.maxIncome ? Number(formData.maxIncome) : null,
        categories: formData.categories,
        states: [formData.state],
      },
      isActive: formData.isActive,
      featured: formData.featured,
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/api/admin/scholarships/${editingId}`
        : `${API_BASE_URL}/api/admin/scholarships`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsModalOpen(false);
        await fetchData();
      } else {
        setModalError(data.message || 'Failed to save scholarship scheme.');
      }
    } catch (err) {
      console.error('[Save Scholarship Error]:', err);
      setModalError('Server error while saving scholarship.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/scholarships/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDeleteTarget(null);
        await fetchData();
      } else {
        alert(data.message || 'Failed to delete scholarship.');
      }
    } catch (err) {
      console.error('[Delete Scholarship Error]:', err);
      alert('Failed to delete scholarship.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter scholarships for display table
  const filteredScholarships = scholarships.filter((item) => {
    const nameStr = getLocalizedText(item.name, 'en').toLowerCase();
    const matchesSearch = !searchQuery.trim() || nameStr.includes(searchQuery.toLowerCase()) || item.issuingBody.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'active' && item.isActive !== false) || (statusFilter === 'inactive' && item.isActive === false);
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ backgroundColor: 'var(--gray-100)', minHeight: '85vh', paddingBottom: '60px' }}>
      {/* Top Admin Header */}
      <section style={{ backgroundColor: 'var(--primary-blue)', color: '#ffffff', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff', marginBottom: '8px' }}>
              <ShieldCheck size={14} /> Admin Privileges Enabled
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>ScholarConnect Admin Control Panel</h1>
          </div>
          <button onClick={handleOpenAddModal} className="btn btn-accent btn-md">
            <Plus size={18} /> Add New Scheme
          </button>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-18px' }}>
        {/* Stats Grid Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="sc-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>{stats.totalStudents}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--gray-500)', fontWeight: 600 }}>Registered Students</div>
            </div>
          </div>

          <div className="sc-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#e6f4ea', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>{stats.activeScholarships}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--gray-500)', fontWeight: 600 }}>Active Schemes</div>
            </div>
          </div>

          <div className="sc-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>{stats.inactiveScholarships}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--gray-500)', fontWeight: 600 }}>Inactive Schemes</div>
            </div>
          </div>

          <div className="sc-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#fff7ed', color: '#d97a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>{stats.totalApplicationsTracked}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--gray-500)', fontWeight: 600 }}>Applications Tracked</div>
            </div>
          </div>
        </div>

        {/* Scholarships Management Table Card */}
        <div className="sc-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue)' }}>Scholarship Schemes Database</h3>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="text"
                  placeholder="Search schemes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '0.85rem', height: '38px' }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
                style={{ width: '130px', fontSize: '0.85rem', height: '38px' }}
              >
                <option value="ALL">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <button onClick={fetchData} className="btn btn-outline btn-sm" style={{ height: '38px' }} title="Refresh Data">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-500)' }}>Loading scholarships list...</div>
          ) : filteredScholarships.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-500)' }}>No scholarships match the selected filters.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-200)', color: 'var(--gray-600)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 10px' }}>Scheme Name</th>
                    <th style={{ padding: '12px 10px' }}>Issuing Body</th>
                    <th style={{ padding: '12px 10px' }}>State</th>
                    <th style={{ padding: '12px 10px' }}>Deadline</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScholarships.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '14px 10px', fontWeight: 600, color: 'var(--gray-900)', maxWidth: '280px' }}>
                        {getLocalizedText(item.name, 'en')}
                        {typeof item.name === 'object' && (item.name.hi || item.name.kn) && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary-blue)', marginLeft: '6px', fontWeight: 500 }}>
                            🌐 Multilingual
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 10px', color: 'var(--gray-700)' }}>{item.issuingBody}</td>
                      <td style={{ padding: '14px 10px', color: 'var(--gray-700)' }}>{item.state}</td>
                      <td style={{ padding: '14px 10px', color: 'var(--gray-700)' }}>
                        {new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 10px' }}>
                        {item.isActive !== false ? (
                          <span className="badge badge-verified" style={{ fontSize: '0.78rem' }}>Active</span>
                        ) : (
                          <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.78rem' }}>Inactive</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => handleOpenEditModal(item)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="Edit Scheme">
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => setDeleteTarget(item)} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: '#dc2626' }} title="Delete Scheme">
                            <Trash2 size={14} /> Soft Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Scholarship Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="sc-card" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                {editingId ? 'Edit Scholarship Scheme' : 'Add New Scholarship Scheme'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}>
                <X size={22} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                <AlertTriangle size={18} /> {modalError}
              </div>
            )}

            <form onSubmit={handleSaveScholarship}>
              {/* Language Tabs Selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid var(--gray-200)' }}>
                <button
                  type="button"
                  onClick={() => setModalTab('en')}
                  style={{
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    backgroundColor: modalTab === 'en' ? 'var(--primary-blue)' : 'transparent',
                    color: modalTab === 'en' ? '#ffffff' : 'var(--gray-700)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    cursor: 'pointer',
                  }}
                >
                  🇬🇧 English (Primary)
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('hi')}
                  style={{
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    backgroundColor: modalTab === 'hi' ? 'var(--primary-blue)' : 'transparent',
                    color: modalTab === 'hi' ? '#ffffff' : 'var(--gray-700)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    cursor: 'pointer',
                  }}
                >
                  🇮🇳 हिन्दी Translation
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('kn')}
                  style={{
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    backgroundColor: modalTab === 'kn' ? 'var(--primary-blue)' : 'transparent',
                    color: modalTab === 'kn' ? '#ffffff' : 'var(--gray-700)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    cursor: 'pointer',
                  }}
                >
                  🇮🇳 ಕನ್ನಡ Translation
                </button>
              </div>

              {/* Tab 1: English */}
              {modalTab === 'en' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label className="form-label">Scheme Name (English) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="e.g. Post-Matric Scholarship for SC Students"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Award Amount & Benefits (English) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.awardAmountEn}
                      onChange={(e) => setFormData({ ...formData, awardAmountEn: e.target.value })}
                      placeholder="e.g. ₹50,000/year + Book Allowance"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Documents Required (English, one per line)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.docsEn}
                      onChange={(e) => setFormData({ ...formData, docsEn: e.target.value })}
                      placeholder="Income Certificate&#10;Caste Certificate&#10;Marksheet"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Hindi */}
              {modalTab === 'hi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label className="form-label">Scheme Name (हिन्दी)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.nameHi}
                      onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                      placeholder="उदा. अनुसूचित जाति के छात्रों के लिए उत्तर-मैट्रिक छात्रवृत्ति"
                    />
                  </div>
                  <div>
                    <label className="form-label">Award Amount & Benefits (हिन्दी)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.awardAmountHi}
                      onChange={(e) => setFormData({ ...formData, awardAmountHi: e.target.value })}
                      placeholder="उदा. ₹50,000/वर्ष + पुस्तक भत्ता"
                    />
                  </div>
                  <div>
                    <label className="form-label">Documents Required (हिन्दी, प्रति पंक्ति एक)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.docsHi}
                      onChange={(e) => setFormData({ ...formData, docsHi: e.target.value })}
                      placeholder="आय प्रमाण पत्र&#10;जाति प्रमाण पत्र&#10;अंकसूची"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Kannada */}
              {modalTab === 'kn' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label className="form-label">Scheme Name (ಕನ್ನಡ)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.nameKn}
                      onChange={(e) => setFormData({ ...formData, nameKn: e.target.value })}
                      placeholder="ಉದಾ. ಪರಿಶಿಷ್ಟ ಜಾತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮೆಟ್ರಿಕ್ ನಂತರದ ವಿದ್ಯಾರ್ಥಿವೇತನ"
                    />
                  </div>
                  <div>
                    <label className="form-label">Award Amount & Benefits (ಕನ್ನಡ)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.awardAmountKn}
                      onChange={(e) => setFormData({ ...formData, awardAmountKn: e.target.value })}
                      placeholder="ಉದಾ. ₹50,000/ವರ್ಷ + ಪುಸ್ತಕ ಭತ್ಯೆ"
                    />
                  </div>
                  <div>
                    <label className="form-label">Documents Required (ಕನ್ನಡ, ಸಾಲಿಗೆ ಒಂದರಂತೆ)</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.docsKn}
                      onChange={(e) => setFormData({ ...formData, docsKn: e.target.value })}
                      placeholder="ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ&#10;ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ&#10;ಅಂಕಪಟ್ಟಿ"
                    />
                  </div>
                </div>
              )}

              {/* Non-Translatable Scheme Fields */}
              <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Issuing Body *</label>
                  <select
                    className="form-select"
                    value={formData.issuingBody}
                    onChange={(e) => setFormData({ ...formData, issuingBody: e.target.value })}
                  >
                    <option value="Central Govt">Central Govt</option>
                    <option value="State Govt">State Govt</option>
                    <option value="Private Trust">Private Trust</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Domicile State *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. ALL or Karnataka"
                  />
                </div>

                <div>
                  <label className="form-label">Application Deadline *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Max Family Income (₹ / Year)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.maxIncome}
                    onChange={(e) => setFormData({ ...formData, maxIncome: e.target.value })}
                    placeholder="Leave empty if no ceiling"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Official Application URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.applicationLink}
                    onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                    placeholder="https://scholarships.gov.in/..."
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Source Verified URL *</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.sourceVerifiedLink}
                    onChange={(e) => setFormData({ ...formData, sourceVerifiedLink: e.target.value })}
                    placeholder="https://socialjustice.gov.in/..."
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', gridColumn: '1 / -1', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    Is Active (Visible to students)
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    Featured Scheme
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--gray-200)', paddingTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="sc-card" style={{ width: '100%', maxWidth: '440px', padding: '24px', backgroundColor: '#ffffff', textAlign: 'center' }}>
            <AlertTriangle size={40} style={{ color: '#dc2626', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>
              Soft-Delete Scholarship Scheme?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '20px' }}>
              Are you sure you want to delete <strong>"{getLocalizedText(deleteTarget.name, 'en')}"</strong>? This will mark it inactive and hide it from student listings while preserving student checklists.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary" disabled={deleting}>
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-accent" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Soft Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
