const API_BASE_URL = 'https://sacred-wallpaper-api.onrender.com/api/v1';

export interface ApiError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const api = {
  async generateWallpaper(data: {
    birth_date: string;
    focus_mode?: string;
    energy_level?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/wallpapers/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to generate wallpaper');
    }

    return response.json();
  },

  async calculateBiorhythm(birthData: {
    date: string;
    latitude: number;
    longitude: number;
  }, targetDate?: string) {
    const url = new URL(`${API_BASE_URL}/calculations/biorhythm`);
    if (targetDate) {
      url.searchParams.append('target_date', targetDate);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to calculate biorhythm');
    }

    return response.json();
  },

  async calculateDasha(birthData: {
    date: string;
    latitude: number;
    longitude: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/calculations/dasha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to calculate dasha');
    }

    return response.json();
  },

  async optimizeFocusMode(data: {
    biorhythm: {
      physical: number;
      emotional: number;
      intellectual: number;
      spiritual: number;
    };
    preferences: {
      focus_preferences?: Record<string, any>;
    };
  }) {
    const response = await fetch(`${API_BASE_URL}/calculations/focus-mode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to optimize focus mode');
    }

    return response.json();
  },
};
