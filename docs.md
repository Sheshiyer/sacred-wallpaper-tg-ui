# Sacred Wallpaper Pack - Telegram Mini App Specification
`Version 1.0.0 | January 2025`

## 1. Technical Architecture

### 1.1 Component Overview
```
sacred-wallpaper-tg/
├── bot/                    # Telegram Bot
│   ├── handlers/          # Message & callback handlers
│   ├── keyboards/         # Custom keyboard layouts
│   └── utils/             # Helper functions
├── mini-app/              # Mini App Frontend
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # UI components
│       ├── hooks/         # Custom hooks
│       ├── services/      # API services
│       └── utils/         # Utility functions
└── backend/               # Existing FastAPI Backend
```

### 1.2 Technology Stack
- Bot Framework: python-telegram-bot
- Mini App: React + Telegram Web App SDK
- Backend: FastAPI (existing)
- Database: Supabase (existing)
- Image Generation: Replicate API (existing)

### 1.3 Core Dependencies
```json
{
  "dependencies": {
    "@twa-dev/sdk": "^6.9.0",
    "react": "^18.2.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0"
  }
}
```

## 2. Bot Implementation

### 2.1 Command Structure
```python
BOT_COMMANDS = {
    'start': 'Begin using Sacred Wallpaper Pack',
    'generate': 'Generate a new wallpaper',
    'profile': 'View your profile and settings',
    'subscription': 'Manage your subscription',
    'help': 'Get usage instructions'
}
```

### 2.2 Keyboard Layouts
```python
MAIN_KEYBOARD = [
    ['🎨 Generate Wallpaper', '👤 Profile'],
    ['📱 Open Mini App', '💫 Subscription']
]

SUBSCRIPTION_KEYBOARD = [
    ['💎 Premium Plan', '✨ Basic Plan'],
    ['↩️ Back to Menu']
]
```

### 2.3 Handler Functions
```python
async def start_command(update, context):
    user = update.effective_user
    await register_user(user.id, user.username)
    welcome_text = (
        "Welcome to Sacred Wallpaper Pack! 🌟\n"
        "Generate consciousness-optimizing wallpapers "
        "based on your biorhythms."
    )
    await update.message.reply_text(
        welcome_text,
        reply_markup=ReplyKeyboardMarkup(MAIN_KEYBOARD)
    )

async def handle_subscription(update, context):
    user_id = update.effective_user.id
    subscription = await get_user_subscription(user_id)
    # Handle subscription logic
```

## 3. Mini App Implementation

### 3.1 Main Components

#### App Container
```typescript
interface AppProps {
  initData: string;
  userId: number;
}

const App: React.FC<AppProps> = ({ initData, userId }) => {
  const webApp = window.Telegram.WebApp;
  
  useEffect(() => {
    webApp.ready();
    webApp.expand();
  }, []);
  
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MainLayout>
  );
};
```

#### Wallpaper Generator
```typescript
interface GeneratorProps {
  onGenerate: (settings: GeneratorSettings) => Promise<void>;
}

const Generator: React.FC<GeneratorProps> = ({ onGenerate }) => {
  const [settings, setSettings] = useState<GeneratorSettings>({
    energyLevel: 'balanced',
    focusMode: 'default'
  });
  
  return (
    <div className="generator">
      <EnergyLevelSelector 
        value={settings.energyLevel}
        onChange={(level) => setSettings({...settings, energyLevel: level})}
      />
      <GenerateButton 
        onClick={() => onGenerate(settings)}
      />
    </div>
  );
};
```

### 3.2 API Integration
```typescript
class TelegramAPI {
  static async getUserData() {
    const webApp = window.Telegram.WebApp;
    return webApp.initDataUnsafe.user;
  }
  
  static async sendMessage(text: string) {
    const webApp = window.Telegram.WebApp;
    await webApp.sendData(JSON.stringify({ type: 'message', text }));
  }
}

class BackendAPI {
  static async generateWallpaper(settings: GeneratorSettings) {
    const response = await fetch(`${API_URL}/wallpapers/generate`, {
      method: 'POST',
      body: JSON.stringify(settings)
    });
    return response.json();
  }
}
```

### 3.3 State Management
```typescript
interface AppState {
  user: TelegramUser | null;
  subscription: SubscriptionStatus;
  currentWallpaper: Wallpaper | null;
}

const useAppState = create<AppState>((set) => ({
  user: null,
  subscription: 'free',
  currentWallpaper: null,
  setUser: (user: TelegramUser) => set({ user }),
  setSubscription: (status: SubscriptionStatus) => set({ subscription: status })
}));
```

## 4. Payment Integration

### 4.1 Subscription Plans
```typescript
const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic_monthly',
    price: 4.99,
    features: [
      '5 wallpapers per month',
      'Basic patterns',
      'Standard resolution'
    ]
  },
  premium: {
    id: 'premium_monthly',
    price: 9.99,
    features: [
      'Unlimited wallpapers',
      'Advanced patterns',
      'High resolution',
      'Priority generation'
    ]
  }
};
```

### 4.2 Payment Processing
```typescript
async function handleSubscription(planId: string) {
  const webApp = window.Telegram.WebApp;
  
  try {
    const invoice = await BackendAPI.createInvoice(planId);
    webApp.openInvoice(invoice.url, (status) => {
      if (status === 'paid') {
        BackendAPI.activateSubscription(planId);
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
  }
}
```

## 5. User Flow

### 5.1 Initial Setup
1. User starts bot with `/start`
2. Bot sends welcome message with Mini App link
3. User opens Mini App
4. App collects birth data for calculations
5. User selects subscription plan

### 5.2 Wallpaper Generation
1. User clicks "Generate Wallpaper"
2. Selects energy level and focus mode
3. App generates wallpaper
4. User can download or share
5. Wallpaper saved to history

### 5.3 Profile Management
1. View current biorhythm
2. Check subscription status
3. Access wallpaper history
4. Update preferences
5. Manage notifications

## 6. Deployment Structure

### 6.1 Bot Deployment
```yaml
# render.yaml
services:
  - type: web
    name: sacred-wallpaper-bot
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python bot/main.py
    envVars:
      - key: BOT_TOKEN
        sync: false
```

### 6.2 Mini App Deployment
```yaml
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "mini-app/package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/mini-app/$1"
    }
  ]
}
```

## 7. Security Considerations

### 7.1 Data Validation
```typescript
function validateInitData(initData: string): boolean {
  // Validate Telegram.WebApp init data
  const data = new URLSearchParams(initData);
  const hash = data.get('hash');
  // Implement hash validation
  return true;
}
```

### 7.2 API Security
- Use Telegram user ID for authentication
- Validate all API requests
- Rate limiting per user
- Secure webhook endpoints

## 8. Testing Strategy

### 8.1 Bot Testing
```python
async def test_start_command():
    update = Mock()
    context = Mock()
    update.effective_user.id = 12345
    await start_command(update, context)
    # Assert response format
```

### 8.2 Mini App Testing
```typescript
describe('Generator Component', () => {
  it('should handle wallpaper generation', async () => {
    render(<Generator />);
    // Test user interaction
    // Verify API calls
  });
});
```

## 9. Monitoring and Analytics

### 9.1 Metrics to Track
- User engagement rates
- Wallpaper generation counts
- Subscription conversions
- Error rates
- API performance

### 9.2 Implementation
```typescript
interface AnalyticsEvent {
  type: string;
  userId: number;
  data: Record<string, any>;
}

async function trackEvent(event: AnalyticsEvent) {
  await BackendAPI.logAnalytics(event);
}
```