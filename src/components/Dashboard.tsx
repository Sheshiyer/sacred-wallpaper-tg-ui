import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallpaper } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentWallpapers, setRecentWallpapers] = useState<Wallpaper[]>([]);

  // TODO: Fetch recent wallpapers from API
  useEffect(() => {
    // Placeholder data
    setRecentWallpapers([]);
  }, []);

  return (
    <div className="dashboard">
      <h1>Sacred Wallpaper Pack</h1>
      
      <div className="quick-actions">
        <button 
          className="generate-button"
          onClick={() => navigate('/generate')}
        >
          🎨 Generate New Wallpaper
        </button>
      </div>

      <div className="recent-wallpapers">
        <h2>Recent Wallpapers</h2>
        {recentWallpapers.length > 0 ? (
          <div className="wallpaper-grid">
            {recentWallpapers.map((wallpaper) => (
              <div key={wallpaper.id} className="wallpaper-item">
                <img src={wallpaper.url} alt="Wallpaper" />
                <span>{new Date(wallpaper.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No wallpapers generated yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
