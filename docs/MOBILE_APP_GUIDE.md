# UFFP Mobile App - Complete Guide

## Overview

The UFFP Mobile App is a cross-platform React Native application that brings Tetlock-style probabilistic forecasting to your mobile device with beautiful charts and interactive visualizations.

## Quick Start

### Installation (2 minutes)

```bash
cd /home/ilabra/uffp/mobile-app
npm install
npm start
```

### Choose Your Platform

Once the Metro bundler starts, you have 4 options:

#### Option 1: Web Browser (Recommended for First Try)
```bash
# Press 'w' in terminal, or
npm run web
```
Opens in your browser at `http://localhost:8081`

#### Option 2: Physical Device (Easiest for Mobile)
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal
3. App loads instantly on your device

#### Option 3: iOS Simulator (macOS only)
```bash
# Press 'i' in terminal, or
npm run ios
```
Requires Xcode installed

#### Option 4: Android Emulator
```bash
# Press 'a' in terminal, or
npm run android
```
Requires Android Studio installed

## App Features

### 🏠 Home Screen

**What You See:**
- List of available forecasts (ASTS, RKLB)
- Each card shows:
  - Ticker symbol
  - Target metric badge
  - Target value and date
  - Preview of drivers
  - Base rate percentage

**What You Can Do:**
- Tap any forecast card to see full analysis
- Scroll through available forecasts

### 📊 Forecast Detail Screen

**Sections:**

#### 1. Success Probability Card (Top)
Large, prominent display showing:
- Percentage chance of hitting target
- Clear visual hierarchy
- Green accent color for easy scanning

#### 2. P10/P50/P90 Bar Chart
Interactive bar chart showing:
- **P10 (Bear Case)** - 10th percentile
- **P50 (Base Case)** - Median outcome
- **P90 (Bull Case)** - 90th percentile
- Mean and standard deviation
- Confidence range variance

#### 3. Probability Distribution Curve
Smooth curve visualization showing:
- Likelihood of each outcome
- Peak at most probable result
- Visual representation of uncertainty
- No dots, just a clean Bezier curve

#### 4. Forecast Drivers
Detailed breakdown of each driver:
- Driver name and description
- Distribution type (triangular, normal, etc.)
- Parameters (low, mode, high, mean, stddev)
- Unit of measurement
- Color-coded parameter chips

#### 5. Outside View (Base Rate)
Historical context:
- Description of reference class
- Success probability percentage
- Data source citation

#### 6. Pre-Mortem Analysis
Risk identification:
- Scenario categories
- Specific failure modes
- Red accent for visibility

#### 7. Methodology Explanation
Educational footer explaining:
- Tetlock Superforecasting principles
- Monte Carlo simulation process
- Percentile interpretation

## Example Forecasts

### ASTS (AST SpaceMobile)

**Target:** $150M revenue by 2026

**Drivers:**
1. **Subscribers** (Triangular)
   - Low: 100,000 users
   - Mode: 500,000 users
   - High: 2,000,000 users

2. **ARPU** (Normal)
   - Mean: $15/month
   - Std Dev: $3

3. **Service Months** (Uniform)
   - Low: 6 months
   - High: 12 months

**Base Rate:** 20% of satellite companies succeed

**Result:**
- P10: $50.34M
- P50: $114.54M
- P90: $228.95M
- Success Probability: ~100% (wide confidence interval)

**Pre-Mortem Risks:**
- Technical: Satellite deployment delays
- Market: Lower subscriber adoption
- Regulatory: Spectrum licensing issues

### RKLB (Rocket Lab)

**Target:** $200M revenue by 2026

**Drivers:**
1. **Launch Cadence** (Triangular)
   - Low: 18 launches/year
   - Mode: 24 launches/year
   - High: 30 launches/year

2. **Avg Launch Price** (Normal)
   - Mean: $7.5M
   - Std Dev: $1.2M

3. **Space Systems Revenue** (Triangular)
   - Low: $50M
   - Mode: $80M
   - High: $120M

**Base Rate:** 40% of launch providers succeed

**Result:**
- P10: ~$168M
- P50: ~$224M
- P90: ~$285M
- Success Probability: ~68%

**Pre-Mortem Risks:**
- Competition: SpaceX price pressure
- Technical: Neutron rocket delays
- Market: Lower satellite demand

## Understanding the Charts

### Bar Chart Interpretation

```
P10 (Bear)    P50 (Base)    P90 (Bull)
    |             |             |
    ▓▓▓▓▓         ▓▓▓▓▓▓▓▓      ▓▓▓▓▓▓▓▓▓▓▓▓
    $50M          $115M         $229M
```

- **10% chance** outcome is below P10
- **50% chance** outcome is below P50 (median)
- **90% chance** outcome is below P90
- Range between P10-P90 represents **80% confidence interval**

### Distribution Curve Interpretation

```
    Probability
        ▲
        |     ╱‾‾‾╲
        |   ╱       ╲
        | ╱           ╲___
        |_________________▶ Revenue
              ↑
            P50 (Peak)
```

- **Peak** = Most likely outcome
- **Wide spread** = High uncertainty
- **Narrow spread** = High confidence
- **Area under curve** = 100% probability

### Confidence Range

```
Variance = (P90 - P10) / P50 × 100%
```

- **<50%** = Low uncertainty (tight range)
- **50-100%** = Moderate uncertainty
- **>100%** = High uncertainty (wide range)

Example:
- ASTS: (229 - 50) / 115 × 100% = **156% variance** (high uncertainty)
- RKLB: (285 - 168) / 224 × 100% = **52% variance** (moderate uncertainty)

## Monte Carlo Simulation

### How It Works

1. **Sample Each Driver** (10,000 times)
   - Triangular: Sample from low/mode/high
   - Normal: Sample from mean/stddev
   - Uniform: Random value in range
   - Beta: Sample from alpha/beta

2. **Calculate Revenue**
   ```
   Revenue = Driver1 × Driver2 × Driver3 × ...
   ```

3. **Sort Results**
   - Order 10,000 outcomes from lowest to highest

4. **Extract Percentiles**
   - P10 = 1,000th value (10%)
   - P50 = 5,000th value (50%)
   - P90 = 9,000th value (90%)

5. **Create Histogram**
   - Group results into 50 bins
   - Count frequency in each bin
   - Plot as distribution curve

### Performance

- **10,000 iterations**: ~1-2 seconds on modern devices
- **1,000 iterations**: ~0.2 seconds (less accurate)
- **100,000 iterations**: ~10-20 seconds (more accurate)

Adjust in `src/services/forecastService.ts`:
```typescript
await runSimulation(drivers, 10000); // Change this number
```

## Customization

### Add Your Own Forecast

1. Open `src/services/forecastService.ts`
2. Find `getExampleForecasts()` method
3. Add new forecast object:

```typescript
{
  ticker: 'YOUR_TICKER',
  targetMetric: 'revenue',
  targetValue: 100, // in millions
  targetDate: '2027-12-31',
  drivers: [
    {
      name: 'Your Driver Name',
      description: 'What this driver represents',
      distributionType: 'triangular',
      parameters: {
        low: 1000,
        mode: 5000,
        high: 10000,
      },
      unit: 'units',
    },
    // Add more drivers...
  ],
  baserate: {
    description: 'Historical success rate for similar companies',
    probability: 0.25, // 25%
    source: 'Industry research',
  },
  premortem: [
    {
      scenario: 'Technical Risk',
      failureMode: 'Specific thing that could go wrong',
    },
    // Add more scenarios...
  ],
}
```

### Change Colors

Edit component style sheets:

**Primary Green** (`#1aff92`):
- Success indicators
- Accent colors
- Interactive elements

**Dark Blue** (`#0f3460`):
- Main background
- Dark sections

**Navy** (`#16213e`):
- Card backgrounds
- Elevated surfaces

**Red** (`#ff6b6b`):
- Warning indicators
- Pre-mortem sections
- Error states

### Modify Chart Configuration

In `src/components/ForecastChart.tsx`:

```typescript
const chartConfig = {
  backgroundColor: '#1a1a2e',
  backgroundGradientFrom: '#16213e',
  backgroundGradientTo: '#0f3460',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  // Customize these values
};
```

## Distribution Types Explained

### Triangular Distribution
**When to use:** You know min, max, and most likely value

**Parameters:**
- `low`: Minimum possible value
- `mode`: Most likely value (peak)
- `high`: Maximum possible value

**Example:** Subscriber count
- You know you'll have at least 100k (minimum viable)
- Most likely around 500k (expected case)
- Could reach 2M (if everything goes right)

**Shape:** Asymmetric triangle with peak at mode

### Normal (Gaussian) Distribution
**When to use:** Symmetric uncertainty around average

**Parameters:**
- `mean`: Expected average value
- `stdDev`: Standard deviation (spread)

**Example:** ARPU (average revenue per user)
- Centered around $15/month
- ±$3 standard deviation
- 68% of values within $12-$18
- 95% of values within $9-$21

**Shape:** Bell curve, symmetric around mean

### Uniform Distribution
**When to use:** No preference for any value in range

**Parameters:**
- `low`: Minimum value
- `high`: Maximum value

**Example:** Service months in a year
- Could be anywhere from 6 to 12 months
- No particular month is more likely
- Equal probability across range

**Shape:** Flat rectangle

### Beta Distribution
**When to use:** Probabilities or percentages (0-1)

**Parameters:**
- `alpha`: Success-like events
- `beta`: Failure-like events

**Example:** System uptime
- Alpha=90, Beta=10 → ~90% average uptime
- Bounded between 0% and 100%
- Can skew toward high reliability

**Shape:** Flexible curve bounded at 0 and 1

## Integration Options

### Option 1: Connect to UFFP Backend

```typescript
// src/services/apiService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-server.com/api',
});

export const fetchForecasts = async () => {
  const response = await api.get('/forecasts');
  return response.data;
};

export const runForecast = async (config: ForecastConfig) => {
  const response = await api.post('/forecasts', config);
  return response.data;
};
```

### Option 2: Use ElizaOS Agent

```typescript
// src/services/elizaService.ts
import axios from 'axios';

const eliza = axios.create({
  baseURL: 'http://your-eliza-server.com',
});

export const askAgent = async (message: string) => {
  const response = await eliza.post('/chat', { message });
  return response.data;
};
```

### Option 3: Local Storage

```typescript
// src/services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveForecasts = async (forecasts: ForecastRecord[]) => {
  await AsyncStorage.setItem('forecasts', JSON.stringify(forecasts));
};

export const loadForecasts = async (): Promise<ForecastRecord[]> => {
  const data = await AsyncStorage.getItem('forecasts');
  return data ? JSON.parse(data) : [];
};
```

## Deployment

### Build for iOS (macOS only)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build
eas build --platform ios
```

### Build for Android

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

### Deploy to Web

```bash
# Build static files
npx expo export --platform web

# Output in dist/ directory
# Deploy to any static host (Vercel, Netlify, etc.)
```

## Troubleshooting

### "Cannot connect to Metro bundler"
```bash
npm start -- --clear
```

### "Module react-native-svg not found"
```bash
npm install
npm start -- --reset-cache
```

### "Charts not rendering on Android"
Ensure hardware acceleration is enabled:
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
  android:hardwareAccelerated="true"
  ...>
```

### "App crashes on iOS"
```bash
cd ios
pod install
cd ..
npm run ios
```

### "TypeScript errors"
```bash
npx tsc --noEmit
```

## Performance Tips

1. **Reduce Iterations** for faster preview:
   ```typescript
   await runSimulation(drivers, 1000); // vs 10000
   ```

2. **Memoize Components**:
   ```typescript
   export const ForecastChart = React.memo(ForecastChartComponent);
   ```

3. **Lazy Load Screens**:
   ```typescript
   const ForecastDetail = lazy(() => import('./screens/ForecastDetailScreen'));
   ```

4. **Optimize Images**:
   - Use WebP format
   - Compress assets
   - Add loading states

## Future Roadmap

- [ ] User authentication
- [ ] Cloud sync with UFFP backend
- [ ] Historical accuracy tracking
- [ ] Leaderboard with Brier scores
- [ ] Push notifications for resolutions
- [ ] Share forecasts as images
- [ ] Compare multiple forecasts
- [ ] Dark/light theme toggle
- [ ] Offline mode
- [ ] Export to PDF/CSV

## Resources

- **Quick Start**: `/mobile-app/QUICKSTART.md`
- **Full README**: `/mobile-app/README.md`
- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Chart Kit**: https://github.com/indiespirit/react-native-chart-kit

## Support

- GitHub Issues: https://github.com/Replicant-Partners/uffp/issues
- Expo Forums: https://forums.expo.dev/
- React Native Discord: https://discord.gg/react-native

---

Built with Tetlock Superforecasting methodology 🎯📊
