import { useState, useEffect } from 'react';
import { SubscriptionStatus, TelegramUser, BirthDataSchema, UserState } from '../types';
import BirthDataForm from './BirthDataForm';
import { api } from '../services/api';
import { telegramService } from '../services/telegram';

const Profile = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [birthData, setBirthData] = useState<BirthDataSchema | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    type: 'free'
  });
  const [showBirthDataForm, setShowBirthDataForm] = useState(false);

  useEffect(() => {
    // Load Telegram user data
    const telegramUser = telegramService.getCurrentUser();
    if (telegramUser) {
      setUser(telegramUser);
      
      // Set theme based on Telegram settings
      document.documentElement.setAttribute(
        'data-theme',
        telegramService.getColorScheme()
      );

      // Show back button if not on main screen
      if (window.location.pathname !== '/') {
        telegramService.enableBackButton(() => {
          window.history.back();
        });
      }

      // Update subscription based on Telegram premium status
      if (telegramService.isUserPremium()) {
        setSubscription({ type: 'premium' });
      }
    }

    // Load stored birth data and calculations
    const storedBirthData = localStorage.getItem('birthData');
    const storedBiorhythm = localStorage.getItem('biorhythm');
    const storedDasha = localStorage.getItem('dasha');

    if (storedBirthData) {
      const birthData = JSON.parse(storedBirthData);
      setBirthData(birthData);

      // If we have birth data but missing calculations, recalculate them
      if (!storedBiorhythm || !storedDasha) {
        handleBirthDataSubmit(birthData).catch(console.error);
      } else {
        setUserState({
          current_biorhythm: JSON.parse(storedBiorhythm),
          current_dasha: JSON.parse(storedDasha),
          last_updated: new Date().toISOString()
        });
      }
    }
  }, []);

  const subscriptionFeatures = {
    free: [
      '3 wallpapers per month',
      'Basic patterns',
      'Standard resolution'
    ],
    basic: [
      '15 wallpapers per month',
      'Advanced patterns',
      'HD resolution',
      'Priority support'
    ],
    premium: [
      'Unlimited wallpapers',
      'All patterns',
      '4K resolution',
      'Priority support',
      'Custom requests'
    ]
  };

  const handleUpgrade = () => {
    // TODO: Implement subscription upgrade flow
    console.log('Upgrade subscription');
  };

  const handleBirthDataSubmit = async (data: BirthDataSchema) => {
    try {
      // Calculate initial biorhythm and dasha
      const [biorhythmData, dashaData] = await Promise.all([
        api.calculateBiorhythm(data),
        api.calculateDasha(data)
      ]);

      // Store birth data and calculations
      localStorage.setItem('birthData', JSON.stringify(data));
      localStorage.setItem('biorhythm', JSON.stringify(biorhythmData));
      localStorage.setItem('dasha', JSON.stringify(dashaData));

      setBirthData(data);
      setUserState({
        current_biorhythm: biorhythmData,
        current_dasha: dashaData,
        last_updated: new Date().toISOString()
      });
      setShowBirthDataForm(false);
    } catch (error) {
      console.error('Failed to save birth data:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="profile">
      <div className="user-info">
        <h1>Profile</h1>
        {user && (
          <div className="user-details">
            {telegramService.getUserPhotoUrl() && (
              <img 
                src={telegramService.getUserPhotoUrl()!} 
                alt="Profile" 
                className="user-photo"
              />
            )}
            <div className="user-text">
              <h2>{user.firstName} {user.lastName}</h2>
              {user.username && (
                <p className="username">@{user.username}</p>
              )}
              {telegramService.isUserPremium() && (
                <span className="premium-badge">⭐️ Premium</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="birth-data-section">
        <h2>Birth Information</h2>
        {birthData ? (
          <>
            <div className="birth-data-display">
              <p>
                <span className="label">Date & Time:</span>
                {new Date(birthData.date).toLocaleString()}
              </p>
              <p>
                <span className="label">Location:</span>
                {birthData.latitude.toFixed(6)}°, {birthData.longitude.toFixed(6)}°
              </p>
            </div>
            {showBirthDataForm ? (
              <div className="birth-data-form-container">
                <BirthDataForm 
                  onSubmit={handleBirthDataSubmit}
                  initialData={birthData}
                />
                <button 
                  className="cancel-button"
                  onClick={() => setShowBirthDataForm(false)}
                >
                  Cancel Edit
                </button>
              </div>
            ) : (
              <button 
                className="edit-button"
                onClick={() => setShowBirthDataForm(true)}
              >
                ✏️ Edit Birth Data
              </button>
            )}
          </>
        ) : (
          <div className="birth-data-form-container">
            <p className="birth-data-prompt">
              Please provide your birth information to generate personalized wallpapers.
            </p>
            <BirthDataForm 
              onSubmit={handleBirthDataSubmit}
            />
          </div>
        )}
      </div>

      <div className="subscription-info">
        <h2>Your Subscription</h2>
        <div className="current-plan">
          <h3>{subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)} Plan</h3>
          <ul>
            {subscriptionFeatures[subscription.type].map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>
          {subscription.type !== 'premium' && (
            <button 
              className="upgrade-button"
              onClick={handleUpgrade}
            >
              ⭐️ Upgrade Plan
            </button>
          )}
        </div>
      </div>

      <div className="settings">
        <h2>Settings</h2>
        <div className="settings-list">
          <button className="setting-item">
            🔔 Notifications
          </button>
          <button className="setting-item">
            🎨 Theme Preferences
          </button>
          <button className="setting-item">
            📱 Device Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
