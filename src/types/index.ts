export interface GeneratorSettings {
  energyLevel: 'balanced' | 'high' | 'low';
  focusMode: 'default' | 'work' | 'relax' | 'creative';
}

export interface Wallpaper {
  id: string;
  url: string;
  createdAt: string;
  settings: GeneratorSettings;
}

export interface SubscriptionStatus {
  type: 'free' | 'basic' | 'premium';
  expiresAt?: string;
}

export interface TelegramUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// API Types
export interface BirthDataSchema {
  date: string;
  latitude: number;
  longitude: number;
}

export interface BiorhythmData {
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
}

export interface WallpaperRequest {
  birth_date: string;
  focus_mode?: string;
  energy_level?: string;
  current_biorhythm?: BiorhythmData;
  preferences?: Record<string, any>;
}

export interface WallpaperResponse {
  image_url: string;
  focus_mode: string;
  biorhythm_alignment: Record<string, any>;
  prompt_used: string;
}

export interface UserState {
  current_biorhythm: Record<string, any>;
  current_dasha: Record<string, any>;
  current_focus_mode?: string;
  last_updated: string;
}

export interface UserPreferences {
  focus_preferences?: Record<string, any>;
}
