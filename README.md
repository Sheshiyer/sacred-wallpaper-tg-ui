# Sacred Wallpaper Pack - Telegram Mini App

Generate consciousness-optimizing wallpapers based on your biorhythms.

## 🔒 Security & Environment Variables

### Frontend (.env)
1. Copy the example env file:
```bash
cp .env.example .env
```

2. Set up Google Maps API:
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project or select existing one
- Enable Places API
- Create credentials (API key)
- Restrict the API key:
  - Set application restrictions to "HTTP referrers"
  - Add your domains (localhost and production)
  - Restrict to Places API only
- Add the key to .env:
```
VITE_GOOGLE_MAPS_API_KEY=your_new_restricted_key
```

### Bot (bot/.env)
1. Copy the example env file:
```bash
cp bot/.env.example bot/.env
```

2. Set up environment variables:
```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
WEBAPP_URL=http://localhost:5173  # Development
BOT_SECRET=generate_random_secret  # For WebApp validation
```

To generate a secure BOT_SECRET:
```bash
openssl rand -hex 32
```

## 🚀 Development Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Install bot dependencies:
```bash
cd bot
pip install -r requirements.txt
```

3. Start development server:
```bash
# Frontend
npm run dev

# Bot (in another terminal)
cd bot
python main.py
```

## 🌐 Deployment

### Frontend (Vercel)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel:
- Go to your project settings
- Add VITE_GOOGLE_MAPS_API_KEY
- Redeploy if needed

### Bot
1. Update bot/.env:
```
WEBAPP_URL=your_vercel_url
```

2. Deploy bot to your preferred platform:
- Railway.app (recommended)
- Heroku
- DigitalOcean
- Your own server

## ⚠️ Important Security Notes

1. Never commit .env files
2. Keep API keys restricted and secure
3. Rotate secrets if compromised
4. Use environment variables in production
5. Validate WebApp data with BOT_SECRET

## 🔄 Rotating Compromised Secrets

If a secret is exposed:

1. Google Maps API Key:
- Go to Google Cloud Console
- Disable the compromised key
- Create a new key with proper restrictions
- Update in .env and Vercel

2. Bot Token:
- Go to @BotFather
- Use /revoke command
- Generate new token
- Update in bot/.env and deployment platform

3. BOT_SECRET:
- Generate new secret
- Update in bot/.env and deployment platform

## 📱 Testing Mini App

1. Open @realitywrapsbot in Telegram
2. Use /start command
3. Click "Open Sacred Wallpaper Pack" button
4. Test all features:
   - Birth data input
   - Location search
   - Wallpaper generation
   - Profile management
