import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if dismissed in current session
    if (sessionStorage.getItem('sc_pwa_install_dismissed') === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent default mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('sc_pwa_install_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--primary-blue-dark)',
        color: '#ffffff',
        padding: '10px 16px',
        fontSize: '0.88rem',
        borderBottom: '2px solid var(--accent-orange)',
        position: 'relative',
        zIndex: 1001,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
          <span>
            Install <strong>ScholarConnect</strong> app for faster access and offline scholarship discovery.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleInstallClick}
            className="btn btn-accent btn-sm"
            style={{ padding: '5px 14px', fontSize: '0.82rem', minHeight: '36px' }}
          >
            <Download size={14} /> Install App
          </button>
          <button
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Dismiss install prompt"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
