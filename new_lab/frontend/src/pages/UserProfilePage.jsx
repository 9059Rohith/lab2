import { useState, useEffect } from 'react';
import { createUserProfile, fetchUserProfile, updateUserProfile, deleteUserProfile } from '../api';
import { speak } from '../utils';
import './UserProfilePage.css';

export default function UserProfilePage({ userId, voiceEnabled }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    preferences: {
      voiceEnabled: true,
      theme: 'light',
      notificationsEnabled: true
    }
  });

  // Load existing profile
  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const res = await fetchUserProfile(userId);
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData(res.data);
        setIsCreating(false);
        if (voiceEnabled) speak('Profile loaded successfully!', true);
      } else if (res.error?.includes('not found')) {
        setIsCreating(true);
        setMessage({ type: 'info', text: 'Create your profile to get started!' });
        if (voiceEnabled) speak('No profile found. Create one now!', true);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error loading profile: ${error.message}` });
      if (voiceEnabled) speak('Error loading profile', true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [prefKey]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUserProfile({
        userId,
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : null,
        preferences: formData.preferences
      });

      if (res.success) {
        setProfile(res.data);
        setIsCreating(false);
        setMessage({ type: 'success', text: 'Profile created successfully! ✨' });
        if (voiceEnabled) speak(`Welcome ${formData.name}! Your profile has been created.`, true);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to create profile' });
        if (voiceEnabled) speak('Failed to create profile', true);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      if (voiceEnabled) speak('Error creating profile', true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateUserProfile(userId, {
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : null,
        preferences: formData.preferences
      });

      if (res.success) {
        setProfile(res.data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully! 👍' });
        if (voiceEnabled) speak('Your profile has been updated.', true);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update profile' });
        if (voiceEnabled) speak('Error updating profile', true);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      if (voiceEnabled) speak('Error updating profile', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      setLoading(true);
      try {
        const res = await deleteUserProfile(userId);
        if (res.success) {
          setProfile(null);
          setIsCreating(true);
          setFormData({
            name: '',
            email: '',
            age: '',
            preferences: { voiceEnabled: true, theme: 'light', notificationsEnabled: true }
          });
          setMessage({ type: 'success', text: 'Profile deleted. Create a new one anytime!' });
          if (voiceEnabled) speak('Your profile has been deleted.', true);
        } else {
          setMessage({ type: 'error', text: res.error || 'Failed to delete profile' });
          if (voiceEnabled) speak('Error deleting profile', true);
        }
      } catch (error) {
        setMessage({ type: 'error', text: `Error: ${error.message}` });
        if (voiceEnabled) speak('Error deleting profile', true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="page-wrap">
      <div className="profile-hero">
        <h1>👤 Your Profile</h1>
        <p>Manage your learning preferences and settings</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {!isCreating && profile && !isEditing ? (
        // DISPLAY MODE
        <div className="profile-card">
          <div className="profile-info">
            <div className="info-row">
              <label>Name:</label>
              <span>{profile.name}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{profile.email}</span>
            </div>
            <div className="info-row">
              <label>Age:</label>
              <span>{profile.age || 'Not specified'}</span>
            </div>
            <div className="info-row">
              <label>Voice:</label>
              <span>{profile.preferences?.voiceEnabled ? '🔊 Enabled' : '🔇 Disabled'}</span>
            </div>
            <div className="info-row">
              <label>Theme:</label>
              <span>{profile.preferences?.theme === 'light' ? '☀️ Light' : '🌙 Dark'}</span>
            </div>
            <div className="info-row">
              <label>Joined:</label>
              <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="btn btn-destructive" 
              onClick={handleDeleteProfile}
              disabled={loading}
            >
              🗑️ Delete Profile
            </button>
          </div>
        </div>
      ) : (
        // FORM MODE (Create or Edit)
        <form onSubmit={isCreating ? handleCreateProfile : handleUpdateProfile} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="1"
              max="120"
              placeholder="Optional"
            />
          </div>

          <div className="form-section">
            <h3>🎛️ Preferences</h3>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="voiceEnabled"
                name="preferences.voiceEnabled"
                checked={formData.preferences.voiceEnabled}
                onChange={handleInputChange}
              />
              <label htmlFor="voiceEnabled">Enable Voice Feedback</label>
            </div>

            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                name="preferences.theme"
                value={formData.preferences.theme}
                onChange={handleInputChange}
              >
                <option value="light">☀️ Light Mode</option>
                <option value="dark">🌙 Dark Mode</option>
              </select>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="preferences.notificationsEnabled"
                checked={formData.preferences.notificationsEnabled}
                onChange={handleInputChange}
              />
              <label htmlFor="notificationsEnabled">Enable Notifications</label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : (isCreating ? '✨ Create Profile' : '💾 Save Changes')}
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="crud-info-box">
        <h3>💾 What's Saved</h3>
        <ul>
          <li>✅ Your profile information securely in MongoDB</li>
          <li>✅ Your learning preferences (voice, theme, notifications)</li>
          <li>✅ Game scores and achievements linked to your profile</li>
          <li>✅ Chat history with AI Tutor</li>
        </ul>
      </div>
    </section>
  );
}
