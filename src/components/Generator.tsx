import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneratorSettings, BirthDataSchema, WallpaperResponse } from '../types';
import { api } from '../services/api';

const Generator = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GeneratorSettings>({
    energyLevel: 'balanced',
    focusMode: 'default'
  });
  const [birthData, setBirthData] = useState<BirthDataSchema | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wallpaperResponse, setWallpaperResponse] = useState<WallpaperResponse | null>(null);

  useEffect(() => {
    // TODO: Fetch birth data from API or local storage
    const storedBirthData = localStorage.getItem('birthData');
    if (storedBirthData) {
      setBirthData(JSON.parse(storedBirthData));
    }
  }, []);

  const energyLevels = [
    { value: 'balanced', label: '⚖️ Balanced' },
    { value: 'high', label: '⚡ High Energy' },
    { value: 'low', label: '🌙 Low Energy' }
  ];

  const focusModes = [
    { value: 'default', label: '🎯 Default' },
    { value: 'work', label: '💼 Work Focus' },
    { value: 'relax', label: '🌿 Relaxation' },
    { value: 'creative', label: '🎨 Creative Flow' }
  ];

  const handleGenerate = async () => {
    if (!birthData) {
      navigate('/profile');
      return;
    }

    setIsGenerating(true);
    try {
      // Calculate current biorhythm
      const biorhythm = await api.calculateBiorhythm(birthData);

      // Generate wallpaper with biorhythm data
      const data = await api.generateWallpaper({
        birth_date: birthData.date,
        focus_mode: settings.focusMode,
        energy_level: settings.energyLevel,
      });
      setWallpaperResponse(data);
      setPreviewUrl(data.image_url);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!birthData) {
    return (
      <div className="generator">
        <h1>Generate Wallpaper</h1>
        <div className="birth-data-prompt slide-in">
          <h2>Birth Data Required</h2>
          <p>Please provide your birth information to generate personalized wallpapers aligned with your biorhythms.</p>
          <button 
            className="add-button"
            onClick={() => navigate('/profile')}
          >
            ➕ Add Birth Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="generator fade-in">
      <h1>Generate Wallpaper</h1>

      <div className="settings-section">
        <h2>Energy Level</h2>
        <div className="option-grid">
          {energyLevels.map(level => (
            <button
              key={level.value}
              className={`option-button ${settings.energyLevel === level.value ? 'selected' : ''}`}
              onClick={() => setSettings({ ...settings, energyLevel: level.value as GeneratorSettings['energyLevel'] })}
            >
              {level.label}
            </button>
          ))}
        </div>

        <h2>Focus Mode</h2>
        <div className="option-grid">
          {focusModes.map(mode => (
            <button
              key={mode.value}
              className={`option-button ${settings.focusMode === mode.value ? 'selected' : ''}`}
              onClick={() => setSettings({ ...settings, focusMode: mode.value as GeneratorSettings['focusMode'] })}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {previewUrl && (
        <div className="preview-section slide-in">
          <img src={previewUrl} alt="Generated wallpaper preview" />
          {wallpaperResponse && (
            <div className="wallpaper-info">
              <p className="alignment-info">
                Biorhythm Alignment: {JSON.stringify(wallpaperResponse.biorhythm_alignment)}
              </p>
            </div>
          )}
          <div className="preview-actions">
            <button className="action-button">
              💾 Save
            </button>
            <button className="action-button">
              📤 Share
            </button>
          </div>
        </div>
      )}

      <button 
        className="generate-button"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? '✨ Generating...' : '✨ Generate Wallpaper'}
      </button>
    </div>
  );
};

export default Generator;
