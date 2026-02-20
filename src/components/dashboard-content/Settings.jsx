'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  homeCard,
  homeCardTitle,
  inputClass,
  selectClass,
  buttonPrimary,
  modalOverlay,
  modalContainer,
  modalTitle,
  modalText,
  modalActions,
  modalButtonSecondary,
  modalButtonDanger
} from '../../styles/styles';

export default function Settings({ setActiveSection }) {
  const { user, updateUser } = useSuperAdminAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. Adewale Ogunleye',
    email: user?.email || 'admin@megatechsolutions.org',
    role: user?.role || 'Super Administrator',
    department: user?.department || 'Mega Tech Solutions',
    phone: '+234 800 123 4567',
    office: 'Floor 12, Mega Tech Tower, Abuja',
    bio: 'Leading educational technology solutions across Nigeria with focus on Kogi State digital transformation.'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [apiKeys, setApiKeys] = useState([
    { name: 'Production API Key', key: 'mts_live_7x8f9k2p4m6n1q3r5t8w2y9u', lastUsed: '2024-01-15', status: 'active' },
    { name: 'Development API Key', key: 'mts_dev_3a5b7c9d1e3f5g7h9i2k4m6n', lastUsed: '2024-01-14', status: 'active' },
    { name: 'Reporting API Key', key: 'mts_rpt_8p2o5i9u7y4t6r1e3w8q2z5x', lastUsed: '2024-01-10', status: 'active' },
  ]);

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordExpiry: '90',
    twoFactorAuth: false,
    dataRetention: '365',
    backupFrequency: 'daily',
    autoReportGeneration: true,
    reportFormat: 'csv',
    notificationEmail: 'alerts@megatechsolutions.org'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'system', label: 'System', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
  ];

  const handleProfileUpdate = () => {
    updateUser(profileData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    toast.success('Password changed successfully!');
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      name: `API Key ${apiKeys.length + 1}`,
      key: `mts_${Math.random().toString(36).substr(2, 24)}`,
      lastUsed: 'Never',
      status: 'active'
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API key generated!');
  };

  const handleRevokeApiKey = (index) => {
    const updated = apiKeys.filter((_, i) => i !== index);
    setApiKeys(updated);
    toast.success('API key revoked');
  };

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings({
      ...systemSettings,
      [key]: value
    });
  };

  const saveSystemSettings = () => {
    toast.success('System settings saved successfully!');
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>System Settings</h1>
        <p className={examsSubtitle}>Configure platform settings and manage your account</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#F5F3FF] text-[#7C3AED] border-l-4 border-[#7C3AED]'
                    : 'hover:bg-gray-50 text-[#626060]'
                }`}
              >
                <span className="text-[18px]">{tab.icon}</span>
                <span className="text-[13px] leading-[100%] font-[500] font-playfair">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-[#F5F3FF] rounded-lg">
            <h3 className="text-[13px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">Need Help?</h3>
            <p className="text-[11px] leading-[140%] font-[400] text-[#626060] mb-3 font-playfair">
              Contact support for assistance with settings configuration.
            </p>
            <button
              onClick={() => setActiveSection('support')}
              className="text-[11px] leading-[100%] font-[500] text-[#7C3AED] hover:underline font-playfair"
            >
              Contact Support →
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={homeCardTitle}>Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-[#7C3AED] border border-[#7C3AED] rounded-md hover:bg-[#F5F3FF] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[24px] leading-[100%] font-[600]">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-[18px] leading-[120%] font-[600] text-[#1E1E1E] font-playfair">{profileData.name}</h3>
                  <p className="text-[13px] leading-[100%] font-[400] text-[#626060] font-playfair mt-1">{profileData.role}</p>
                  <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mt-1">{profileData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Office Address</label>
                  <input
                    type="text"
                    value={profileData.office}
                    onChange={(e) => setProfileData({...profileData, office: e.target.value})}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Bio</label>
                  <textarea
                    rows="3"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className={modalButtonSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <h2 className={homeCardTitle}>Security Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-[#F5F3FF] rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] mb-1 font-playfair">Password</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Last changed 30 days ago</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Two-Factor Authentication</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.twoFactorAuth}
                          onChange={(e) => handleSystemSettingChange('twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                      </label>
                    </div>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">Add an extra layer of security</p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Session Timeout</span>
                    </div>
                    <select
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => handleSystemSettingChange('sessionTimeout', e.target.value)}
                      className={selectClass}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-3 font-playfair">Login Attempts</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">Maximum attempts before lockout:</span>
                    <select
                      value={systemSettings.maxLoginAttempts}
                      onChange={(e) => handleSystemSettingChange('maxLoginAttempts', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[12px] font-playfair"
                    >
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={homeCardTitle}>API Keys</h2>
                <button
                  onClick={handleGenerateApiKey}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  + Generate New Key
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map((api, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{api.name}</h3>
                        <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair font-mono">
                          {api.key.substring(0, 20)}...
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[9px] leading-[100%] font-[500] ${
                        api.status === 'active' ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {api.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">
                        Last used: {api.lastUsed}
                      </span>
                      <button
                        onClick={() => handleRevokeApiKey(index)}
                        className="text-[#DC2626] text-[11px] leading-[100%] font-[500] hover:underline"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-[11px] leading-[140%] font-[400] text-yellow-800 font-playfair">
                  ⚠️ API keys provide full access to the system. Keep them secure and rotate regularly.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <h2 className={homeCardTitle}>System Configuration</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Maintenance Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                  <p className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">Prevent user access during updates</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">New Registrations</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.allowNewRegistrations}
                        onChange={(e) => handleSystemSettingChange('allowNewRegistrations', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                  <p className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">Allow new school registrations</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Email Verification</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.requireEmailVerification}
                        onChange={(e) => handleSystemSettingChange('requireEmailVerification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                  <p className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">Require email verification for new admins</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Auto Reports</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.autoReportGeneration}
                        onChange={(e) => handleSystemSettingChange('autoReportGeneration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                  <p className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">Generate monthly reports automatically</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Data Retention Period</label>
                  <select
                    value={systemSettings.dataRetention}
                    onChange={(e) => handleSystemSettingChange('dataRetention', e.target.value)}
                    className={selectClass}
                  >
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days</option>
                    <option value="730">2 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Backup Frequency</label>
                  <select
                    value={systemSettings.backupFrequency}
                    onChange={(e) => handleSystemSettingChange('backupFrequency', e.target.value)}
                    className={selectClass}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Report Format</label>
                  <select
                    value={systemSettings.reportFormat}
                    onChange={(e) => handleSystemSettingChange('reportFormat', e.target.value)}
                    className={selectClass}
                  >
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Password Expiry (days)</label>
                  <input
                    type="number"
                    value={systemSettings.passwordExpiry}
                    onChange={(e) => handleSystemSettingChange('passwordExpiry', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={saveSystemSettings}
                  className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Save System Settings
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <h2 className={homeCardTitle}>Notification Preferences</h2>

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Email Notifications</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Receive system alerts via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Support Ticket Updates</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Get notified when tickets are updated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Report Generation</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Receive notification when reports are ready</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Notification Email</label>
                  <input
                    type="email"
                    value={systemSettings.notificationEmail}
                    onChange={(e) => handleSystemSettingChange('notificationEmail', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'backup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <h2 className={homeCardTitle}>Backup & Restore</h2>

              <div className="space-y-4">
                <div className="p-4 bg-[#F5F3FF] rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Latest Backup</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Today at 03:00 AM • 2.4 GB</p>
                    </div>
                    <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair">
                      Download
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition-all">
                    <div className="text-[24px] mb-2">💾</div>
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Create Backup</h3>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Manual backup now</p>
                  </button>

                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition-all">
                    <div className="text-[24px] mb-2">🔄</div>
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Restore</h3>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Restore from backup</p>
                  </button>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-[11px] leading-[140%] font-[400] text-yellow-800 font-playfair">
                    ⚠️ Restoring will overwrite current data. Ensure you have a recent backup.
                  </p>
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
            className={modalOverlay}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={modalContainer}
            >
              <h3 className={modalTitle}>Change Password</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className={modalActions}>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className={modalButtonDanger}
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}