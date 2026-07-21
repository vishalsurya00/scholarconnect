import React, { useState, useEffect } from 'react';
import { WifiOff, AlertTriangle, X } from 'lucide-react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div
      style={{
        backgroundColor: '#fff7ed',
        borderBottom: '1px solid #fed7aa',
        color: '#c2410c',
        padding: '10px 16px',
        fontSize: '0.88rem',
        fontWeight: 600,
        position: 'sticky',
        top: 0,
        zIndex: 999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <WifiOff size={18} style={{ color: '#c2410c', flexShrink: 0 }} />
          <span>You're offline — showing saved data. Some info may not be up to date.</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            color: '#c2410c',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
          }}
          title="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default OfflineBanner;
