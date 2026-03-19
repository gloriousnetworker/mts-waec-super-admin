// components/dashboard-content/Settings.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function SettingsContent() {
  const { user, updateUser, fetchWithAuth, refreshUser } = useSuperAdminAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [twoFAQRCode, setTwoFAQRCode] = useState('');
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFAToken, setTwoFAToken] = useState(['', '', '', '', '', '']);
  const [secretCopied, setSecretCopied] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordExpiry: '90',
    twoFactorAuth: false,
    notificationEmail: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      
      setSystemSettings(prev => ({
        ...prev,
        twoFactorAuth: user.twoFactorEnabled || false,
        notificationEmail: user.email || 'alerts@megatechsolutions.org'
      }));
    }
  }, [user]);

  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'system',   label: 'System',   icon: '⚙️' },
  ];

  const handleProfileUpdate = async () => {
    setLoading(true);
    const toastId = toast.loading('Updating profile...');
    try {
      const response = await fetchWithAuth('/admin/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: profileData.name, email: profileData.email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        updateUser(profileData);
        setIsEditing(false);
        toast.success('Profile updated successfully!', { id: toastId });
        await refreshUser();
      } else {
        toast.error(data.message || 'Failed to update profile', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('Changing password...');
    
    try {
      const response = await fetchWithAuth('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password changed successfully!', { id: toastId });
        setShowPasswordModal(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        toast.error(data.message || 'Failed to change password', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    setLoading2FA(true);
    const toastId = toast.loading('Setting up 2FA...');
    try {
      const response = await fetchWithAuth('/auth/setup-2fa', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTwoFAQRCode(data.qrCode);
        setTwoFASecret(data.secret || '');
        setShow2FAModal(true);
        toast.success('Scan the QR code with Google Authenticator', { id: toastId });
      } else {
        toast.error(data.message || 'Failed to setup 2FA', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    } finally {
      setLoading2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    const token = twoFAToken.join('');
    if (token.length !== 6) {
      toast.error('Please enter complete 6-digit code');
      return;
    }

    const toastId = toast.loading('Verifying...');
    try {
      const response = await fetchWithAuth('/auth/verify-2fa-setup', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('2FA enabled successfully', { id: toastId });
        setShow2FAModal(false);
        setTwoFAToken(['', '', '', '', '', '']);
        setTwoFASecret('');
        setSecretCopied(false);
        await refreshUser();
      } else {
        toast.error(data.message || 'Invalid code', { id: toastId });
        setTwoFAToken(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.error('Verification failed', { id: toastId });
    }
  };

  const handleDisable2FA = async () => {
    const toastId = toast.loading('Disabling 2FA...');
    try {
      const response = await fetchWithAuth('/auth/disable-2fa', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('2FA disabled successfully', { id: toastId });
        setShowDisable2FAModal(false);
        await refreshUser();
      } else {
        toast.error(data.message || 'Failed to disable 2FA', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handle2FAChange = (index, value) => {
    if (isNaN(value)) return;
    const newToken = [...twoFAToken];
    newToken[index] = value.slice(-1);
    setTwoFAToken(newToken);
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handle2FAKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFAToken[index] && index > 0) {
      const prevInput = document.getElementById(`2fa-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const saveSystemSettings = () => {
    // System settings API endpoint is not yet available on the backend.
    // Settings are stored locally for now.
    toast.success('System preferences saved locally.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content-primary font-playfair">Settings</h1>
        <p className="text-sm text-content-secondary mt-1">Manage your account and platform configuration</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-52 flex-shrink-0">
          <div className="card overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-brand-primary-lt text-brand-primary border-l-[3px] border-brand-primary font-semibold'
                    : 'hover:bg-surface-subtle text-content-secondary'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-border p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-content-primary">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-brand-primary border border-brand-primary rounded-md hover:bg-brand-primary-lt transition-colors text-[12px] leading-[100%] font-[500]"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-white text-[24px] leading-[100%] font-[600]">
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SA'}
                </div>
                <div>
                  <h3 className="text-[18px] leading-[120%] font-[600] text-content-primary">{profileData.name}</h3>
                  <p className="text-[13px] leading-[100%] font-[400] text-content-secondary mt-1">Super Administrator</p>
                  <p className="text-[11px] leading-[100%] font-[400] text-content-secondary mt-1">{profileData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-content-secondary uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-content-secondary uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-border rounded-md hover:bg-surface-subtle text-[13px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[13px] leading-[100%] font-[600] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-content-primary mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-brand-primary-lt rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[14px] leading-[100%] font-[600] text-content-primary mb-1">Password</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-content-secondary">Last changed 30 days ago</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[12px] leading-[100%] font-[500]"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-brand-primary-lt rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[14px] leading-[100%] font-[600] text-content-primary mb-1">Two-Factor Authentication</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-content-secondary">
                        {user?.twoFactorEnabled ? '2FA is enabled' : 'Add an extra layer of security'}
                      </p>
                    </div>
                    {user?.twoFactorEnabled ? (
                      <button
                        onClick={() => setShowDisable2FAModal(true)}
                        className="px-4 py-2 btn-danger transition-colors text-[12px] leading-[100%] font-[500]"
                      >
                        Disable 2FA
                      </button>
                    ) : (
                      <button
                        onClick={handleSetup2FA}
                        disabled={loading2FA}
                        className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[12px] leading-[100%] font-[500] disabled:opacity-50"
                      >
                        {loading2FA ? 'Setting up...' : 'Enable 2FA'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-content-primary mb-6">System Configuration</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="text-[13px] leading-[100%] font-[600] text-content-primary mb-3">Session Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] leading-[100%] font-[400] text-content-secondary mb-2">Session Timeout (minutes)</label>
                        <select
                          value={systemSettings.sessionTimeout}
                          onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                          className="input-field"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] leading-[100%] font-[400] text-content-secondary mb-2">Max Login Attempts</label>
                        <select
                          value={systemSettings.maxLoginAttempts}
                          onChange={(e) => setSystemSettings({...systemSettings, maxLoginAttempts: e.target.value})}
                          className="input-field"
                        >
                          <option value="3">3 attempts</option>
                          <option value="5">5 attempts</option>
                          <option value="10">10 attempts</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="text-[13px] leading-[100%] font-[600] text-content-primary mb-3">Registration Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={systemSettings.allowNewRegistrations}
                          onChange={(e) => setSystemSettings({...systemSettings, allowNewRegistrations: e.target.checked})}
                          className="rounded border-border text-brand-primary focus:ring-brand-primary/30"
                        />
                        <span className="text-[12px] leading-[100%] font-[400] text-content-primary">Allow new registrations</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={systemSettings.requireEmailVerification}
                          onChange={(e) => setSystemSettings({...systemSettings, requireEmailVerification: e.target.checked})}
                          className="rounded border-border text-brand-primary focus:ring-brand-primary/30"
                        />
                        <span className="text-[12px] leading-[100%] font-[400] text-content-primary">Require email verification</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveSystemSettings}
                    className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[13px] leading-[100%] font-[600]"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="modal-container p-6 w-full mx-4 max-w-md"
            >
              <h3 className="text-lg font-semibold text-content-primary mb-4">Change Password</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-content-primary mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-content-primary mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-content-primary mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-border rounded-md hover:bg-surface-subtle text-[13px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk text-[13px] disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {show2FAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="modal-container p-6 w-full mx-4 max-w-md overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-lg font-semibold text-content-primary mb-1">Setup Two-Factor Authentication</h3>
              <p className="text-[12px] text-content-secondary mb-5">
                Use Google Authenticator, Authy, or any TOTP app.
              </p>

              {/* Step 1 — QR Code */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider mb-3">
                  Step 1 — Scan QR Code
                </p>
                {twoFAQRCode && (
                  <div className="flex justify-center p-3 bg-white border border-border rounded-lg">
                    <img src={twoFAQRCode} alt="2FA QR Code" className="w-44 h-44" />
                  </div>
                )}
              </div>

              {/* Step 2 — Manual secret key */}
              {twoFASecret && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider mb-2">
                    Step 2 — Or enter key manually
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-surface-muted border border-border rounded-lg">
                    <code className="flex-1 text-[12px] font-mono text-content-primary tracking-widest break-all select-all">
                      {twoFASecret}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(twoFASecret).then(() => {
                          setSecretCopied(true);
                          setTimeout(() => setSecretCopied(false), 2000);
                        });
                      }}
                      className="flex-shrink-0 px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-colors"
                      style={{
                        background: secretCopied ? '#D1FAE5' : '#EDF0F7',
                        color: secretCopied ? '#059669' : '#1F2A49',
                      }}
                    >
                      {secretCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-[10px] text-content-muted mt-1.5">
                    Choose "Enter setup key" in your authenticator app and paste this key.
                  </p>
                </div>
              )}

              {/* Step 3 — Enter OTP */}
              <div className="mb-6">
                <p className="text-[11px] font-semibold text-content-secondary uppercase tracking-wider mb-3">
                  Step 3 — Enter 6-digit code to verify
                </p>
                <div className="flex gap-2 justify-center">
                  {twoFAToken.map((digit, index) => (
                    <input
                      key={index}
                      id={`2fa-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handle2FAChange(index, e.target.value)}
                      onKeyDown={(e) => handle2FAKeyDown(index, e)}
                      maxLength={1}
                      className="w-11 h-12 text-center border border-border rounded-lg focus:outline-none focus:border-brand-primary text-[20px] font-bold"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFAToken(['', '', '', '', '', '']);
                    setTwoFASecret('');
                    setSecretCopied(false);
                  }}
                  className="px-4 py-2 border border-border rounded-md hover:bg-surface-subtle text-[13px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify2FA}
                  className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk text-[13px] font-semibold"
                >
                  Verify & Enable
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDisable2FAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="modal-container p-6 w-full mx-4 max-w-md"
            >
              <h3 className="text-lg font-semibold text-content-primary mb-2">Disable Two-Factor Authentication</h3>
              <p className="text-[13px] text-content-secondary mb-6">
                Are you sure you want to disable 2FA? This will make your account less secure.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDisable2FAModal(false)}
                  className="px-4 py-2 border border-border rounded-md hover:bg-surface-subtle text-[13px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable2FA}
                  className="px-6 py-2 btn-danger text-[13px]"
                >
                  Disable 2FA
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Settings() {
  return <SettingsContent />;
}