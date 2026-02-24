'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSuperAdminAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import ProtectedRoute from '../../components/ProtectedRoute'

function SettingsContent() {
  const { user, updateUser, fetchWithAuth, refreshUser } = useSuperAdminAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false)
  const [twoFASecret, setTwoFASecret] = useState('')
  const [twoFAQRCode, setTwoFAQRCode] = useState('')
  const [twoFAToken, setTwoFAToken] = useState(['', '', '', '', '', ''])
  const [loading2FA, setLoading2FA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState([])
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '+234 800 123 4567',
    office: 'Mega Tech Tower, Abuja',
    bio: 'Managing educational technology solutions across Kogi State.'
  })

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })

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
    notificationEmail: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Super Admin',
        email: user.email || 'superadmin@megatechsolutions.org',
        role: user.role || 'Super Administrator',
        phone: user.phone || '+234 800 123 4567',
        office: user.office || 'Mega Tech Tower, Abuja',
        bio: user.bio || 'Managing educational technology solutions across Kogi State.'
      })
      
      setSystemSettings(prev => ({
        ...prev,
        twoFactorAuth: user.twoFactorEnabled || false,
        notificationEmail: user.email || 'alerts@megatechsolutions.org'
      }))
    }
  }, [user])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'system', label: 'System', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'backup', label: 'Backup & Restore', icon: '💾' },
  ]

  const handleProfileUpdate = async () => {
    setLoading(true)
    const toastId = toast.loading('Updating profile...')
    try {
      const response = await fetchWithAuth('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        updateUser(profileData)
        setIsEditing(false)
        toast.success('Profile updated successfully!', { id: toastId })
        await refreshUser()
      } else {
        toast.error(data.message || 'Failed to update profile', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setLoading(true)
    const toastId = toast.loading('Changing password...')
    
    try {
      const response = await fetchWithAuth('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success('Password changed successfully!', { id: toastId })
        setShowPasswordModal(false)
        setPasswordData({ current: '', new: '', confirm: '' })
      } else {
        toast.error(data.message || 'Failed to change password', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleSetup2FA = async () => {
    setLoading2FA(true)
    const toastId = toast.loading('Setting up 2FA...')
    try {
      const response = await fetchWithAuth('/auth/setup-2fa', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setTwoFASecret(data.secret)
        setTwoFAQRCode(data.qrCode)
        setShow2FAModal(true)
        toast.success('Scan the QR code with Google Authenticator', { id: toastId })
      } else {
        toast.error(data.message || 'Failed to setup 2FA', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    } finally {
      setLoading2FA(false)
    }
  }

  const handleVerify2FA = async () => {
    const token = twoFAToken.join('')
    if (token.length !== 6) {
      toast.error('Please enter complete 6-digit code')
      return
    }

    const toastId = toast.loading('Verifying...')
    try {
      const response = await fetchWithAuth('/auth/verify-2fa-setup', {
        method: 'POST',
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success('2FA enabled successfully', { id: toastId })
        setShow2FAModal(false)
        setTwoFAToken(['', '', '', '', '', ''])
        await refreshUser()
      } else {
        toast.error(data.message || 'Invalid code', { id: toastId })
        setTwoFAToken(['', '', '', '', '', ''])
      }
    } catch (error) {
      toast.error('Verification failed', { id: toastId })
    }
  }

  const handleDisable2FA = async () => {
    const toastId = toast.loading('Disabling 2FA...')
    try {
      const response = await fetchWithAuth('/auth/disable-2fa', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success('2FA disabled successfully', { id: toastId })
        setShowDisable2FAModal(false)
        await refreshUser()
      } else {
        toast.error(data.message || 'Failed to disable 2FA', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    }
  }

  const handle2FAChange = (index, value) => {
    if (isNaN(value)) return
    const newToken = [...twoFAToken]
    newToken[index] = value.slice(-1)
    setTwoFAToken(newToken)
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handle2FAKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFAToken[index] && index > 0) {
      const prevInput = document.getElementById(`2fa-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleGenerateApiKey = async () => {
    const toastId = toast.loading('Generating API key...')
    try {
      const response = await fetchWithAuth('/auth/generate-api-key', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setApiKeys([...apiKeys, data.apiKey])
        toast.success('New API key generated!', { id: toastId })
      } else {
        toast.error(data.message || 'Failed to generate API key', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    }
  }

  const handleRevokeApiKey = async (keyId) => {
    const toastId = toast.loading('Revoking API key...')
    try {
      const response = await fetchWithAuth(`/auth/revoke-api-key/${keyId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId))
        toast.success('API key revoked', { id: toastId })
      } else {
        toast.error('Failed to revoke API key', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    }
  }

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings({
      ...systemSettings,
      [key]: value
    })
  }

  const saveSystemSettings = async () => {
    const toastId = toast.loading('Saving settings...')
    try {
      const response = await fetchWithAuth('/settings/system', {
        method: 'POST',
        body: JSON.stringify(systemSettings)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success('System settings saved successfully!', { id: toastId })
      } else {
        toast.error(data.message || 'Failed to save settings', { id: toastId })
      }
    } catch (error) {
      toast.error('Network error', { id: toastId })
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E1E1E] font-playfair">System Settings</h1>
        <p className="text-sm text-[#626060] font-playfair">Configure platform settings and manage your account</p>
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
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[#1E1E1E] font-playfair">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-[#7C3AED] border border-[#7C3AED] rounded-md hover:bg-[#F5F3FF] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[24px] leading-[100%] font-[600]">
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SA'}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Office Address</label>
                  <input
                    type="text"
                    value={profileData.office}
                    onChange={(e) => setProfileData({...profileData, office: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Bio</label>
                  <textarea
                    rows="3"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair resize-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-[13px] font-playfair"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair disabled:opacity-50"
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
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-[#1E1E1E] mb-6 font-playfair">Security Settings</h2>
              
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

                <div className="p-4 bg-[#F5F3FF] rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] mb-1 font-playfair">Two-Factor Authentication</h3>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">
                        {user?.twoFactorEnabled ? '2FA is enabled' : 'Add an extra layer of security'}
                      </p>
                    </div>
                    {user?.twoFactorEnabled ? (
                      <button
                        onClick={() => setShowDisable2FAModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                      >
                        Disable 2FA
                      </button>
                    ) : (
                      <button
                        onClick={handleSetup2FA}
                        disabled={loading2FA}
                        className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair disabled:opacity-50"
                      >
                        {loading2FA ? 'Setting up...' : 'Enable 2FA'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Session Timeout</span>
                    </div>
                    <select
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => handleSystemSettingChange('sessionTimeout', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[12px] font-playfair"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-3 font-playfair">Login Attempts</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">Maximum attempts:</span>
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

                <div className="flex justify-end">
                  <button
                    onClick={saveSystemSettings}
                    className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                  >
                    Save Security Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[#1E1E1E] font-playfair">API Keys</h2>
                <button
                  onClick={handleGenerateApiKey}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  Generate New Key
                </button>
              </div>

              {apiKeys.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-[14px] text-[#626060] font-playfair">No API keys generated yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="text-[14px] font-[600] text-[#1E1E1E] mb-1 font-playfair">{key.name}</h3>
                        <p className="text-[12px] font-mono text-[#626060] mb-1">{key.key}</p>
                        <p className="text-[11px] text-[#626060] font-playfair">Last used: {key.lastUsed} • Created: {key.createdAt}</p>
                      </div>
                      <button
                        onClick={() => handleRevokeApiKey(key.id)}
                        className="px-3 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-[11px] font-[500] font-playfair"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4 font-playfair">Change Password</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-[13px] font-playfair"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] text-[13px] font-playfair disabled:opacity-50"
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4 font-playfair">Setup Two-Factor Authentication</h3>
              
              <div className="mb-6">
                <p className="text-[13px] text-[#626060] mb-4 font-playfair">
                  Scan this QR code with Google Authenticator or enter the secret key manually.
                </p>
                
                {twoFAQRCode && (
                  <div className="flex justify-center mb-4">
                    <img src={twoFAQRCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-[11px] text-[#626060] mb-1 font-playfair">Secret Key:</p>
                  <p className="text-[12px] font-mono font-bold break-all">{twoFASecret}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-3 font-playfair">
                  Enter 6-digit code from authenticator
                </label>
                <div className="flex gap-2 justify-center">
                  {twoFAToken.map((digit, index) => (
                    <input
                      key={index}
                      id={`2fa-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handle2FAChange(index, e.target.value)}
                      onKeyDown={(e) => handle2FAKeyDown(index, e)}
                      maxLength={1}
                      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[18px] font-bold"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShow2FAModal(false)
                    setTwoFAToken(['', '', '', '', '', ''])
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-[13px] font-playfair"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify2FA}
                  className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] text-[13px] font-playfair"
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-[#1E1E1E] mb-2 font-playfair">Disable Two-Factor Authentication</h3>
              <p className="text-[13px] text-[#626060] mb-6 font-playfair">
                Are you sure you want to disable 2FA? This will make your account less secure.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDisable2FAModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-[13px] font-playfair"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable2FA}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-[13px] font-playfair"
                >
                  Disable 2FA
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}