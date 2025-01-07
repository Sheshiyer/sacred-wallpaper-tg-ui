import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface InitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date?: number;
  hash?: string;
}

class TelegramService {
  private static instance: TelegramService;
  private initData: InitData;

  private constructor() {
    this.initData = WebApp.initDataUnsafe;
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  public getCurrentUser(): TelegramUser | null {
    return this.initData.user || null;
  }

  public async sendWallpaperToChat(imageUrl: string, caption?: string): Promise<void> {
    try {
      await WebApp.sendData(JSON.stringify({
        type: 'wallpaper',
        url: imageUrl,
        caption
      }));
    } catch (error) {
      console.error('Failed to send wallpaper to chat:', error);
      throw error;
    }
  }

  public getLanguageCode(): string {
    return this.initData.user?.language_code || 'en';
  }

  public showAlert(message: string): void {
    WebApp.showAlert(message);
  }

  public showConfirm(message: string): void {
    WebApp.showConfirm(message);
  }

  public expandApp(): void {
    WebApp.expand();
  }

  public closeApp(): void {
    WebApp.close();
  }

  // Method to verify if the app is running inside Telegram
  public isRunningInTelegram(): boolean {
    return !!this.initData.hash;
  }

  // Method to get user's profile photo if available
  public getUserPhotoUrl(): string | null {
    return this.initData.user?.photo_url || null;
  }

  // Method to handle back button
  public enableBackButton(callback: () => void): void {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(callback);
  }

  public disableBackButton(): void {
    WebApp.BackButton.hide();
  }

  // Method to handle main button
  public setMainButton(text: string, callback: () => void): void {
    WebApp.MainButton.text = text;
    WebApp.MainButton.onClick(callback);
    WebApp.MainButton.show();
  }

  public hideMainButton(): void {
    WebApp.MainButton.hide();
  }

  // Method to get color scheme (dark/light)
  public getColorScheme(): 'dark' | 'light' {
    return WebApp.colorScheme;
  }

  // Method to check if user is premium
  public isUserPremium(): boolean {
    return WebApp.initDataUnsafe.user?.is_premium || false;
  }
}

export const telegramService = TelegramService.getInstance();
