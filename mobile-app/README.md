# UFFP Mobile App

A React Native mobile application for the Universal Forecasting Financial Platform (UFFP) with interactive charts and visualizations.

## Features

- 📊 **Interactive Forecast Charts** - Bar charts showing P10/P50/P90 projections
- 📈 **Probability Distribution Graphs** - Visualize Monte Carlo simulation results
- 🎯 **Success Probability Display** - Clear probability of reaching targets
- 🔍 **Driver Analysis** - Detailed breakdown of forecast drivers
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🎨 **Modern UI** - Dark theme with gradient backgrounds

## Screenshots

### Home Screen
- List of available forecasts (ASTS, RKLB)
- Quick view of target metrics and base rates

### Forecast Detail Screen
- Success probability card
- P10/P50/P90 bar chart
- Probability distribution curve
- Driver breakdown with parameters
- Outside view (base rate) analysis
- Pre-mortem failure scenarios
- Methodology explanation

## Tech Stack

- **React Native (Expo)** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Navigation** - Native stack navigation
- **React Native Chart Kit** - Beautiful charts and graphs
- **React Native SVG** - Vector graphics support

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or pnpm
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Setup

```bash
# Navigate to mobile app directory
cd /home/ilabra/uffp/mobile-app

# Install dependencies
npm install

# Start the development server
npm start
```

## Running the App

### iOS Simulator (macOS only)

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

### Web Browser

```bash
npm run web
```

### Physical Device

1. Install Expo Go app from App Store or Play Store
2. Run `npm start`
3. Scan the QR code with your device

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ForecastCard.tsx       # Forecast list item
│   │   ├── ForecastChart.tsx      # Bar chart component
│   │   └── DistributionChart.tsx  # Distribution curve
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.tsx         # Main forecast list
│   │   └── ForecastDetailScreen.tsx  # Detailed analysis
│   ├── services/            # Business logic
│   │   └── forecastService.ts     # Monte Carlo simulation
│   ├── types/               # TypeScript types
│   │   └── index.ts              # Shared interfaces
│   └── App.tsx              # Navigation setup
├── App.tsx                  # Root component
└── package.json
```

## Components

### ForecastCard
Displays summary of a forecast with:
- Ticker symbol
- Target metric badge
- Target value and date
- Driver preview
- Base rate percentage

### ForecastChart
Bar chart visualization showing:
- P10 (Bear Case)
- P50 (Base Case)
- P90 (Bull Case)
- Mean and standard deviation stats
- Confidence range variance

### DistributionChart
Probability distribution curve showing:
- Likelihood of different outcomes
- Peak at most probable result
- Visual representation of uncertainty

## Screens

### HomeScreen
- Lists all available forecasts
- Tap to navigate to detail view
- Dark theme with gradient background

### ForecastDetailScreen
Complete forecast analysis with:
1. **Success Probability Card** - Large, prominent display
2. **Bar Chart** - P10/P50/P90 visualization
3. **Distribution Chart** - Probability curve
4. **Drivers Section** - Each driver with parameters
5. **Base Rate Section** - Historical success rate
6. **Pre-Mortem Section** - Failure scenario analysis
7. **Methodology** - Explanation of approach

## Monte Carlo Simulation

The app runs real-time Monte Carlo simulations with:
- 10,000 iterations
- 4 distribution types: Triangular, Normal, Beta, Uniform
- Client-side calculation (no server required)
- Results in ~1-2 seconds

### Distribution Types

**Triangular Distribution**
- Parameters: low, mode, high
- Best for: Asymmetric uncertainty
- Example: Subscriber count with known min/max

**Normal Distribution**
- Parameters: mean, stdDev
- Best for: Symmetric uncertainty
- Example: ARPU (average revenue per user)

**Uniform Distribution**
- Parameters: low, high
- Best for: No preference for any value in range
- Example: Service months in year

**Beta Distribution**
- Parameters: alpha, beta
- Best for: Probabilities (0-1 bounded)
- Example: Constellation uptime percentage

## Example Forecasts

### ASTS (AST SpaceMobile)
- **Target**: $150M revenue by 2026
- **Drivers**: Subscribers, ARPU, Service Months
- **Base Rate**: 20% (satellite companies)
- **Result**: P50 = $114.5M

### RKLB (Rocket Lab)
- **Target**: $200M revenue by 2026
- **Drivers**: Launch Cadence, Avg Price, Space Systems
- **Base Rate**: 40% (launch providers)
- **Result**: Higher probability than ASTS

## Customization

### Add New Forecasts

Edit `src/services/forecastService.ts`:

```typescript
getExampleForecasts(): ForecastConfig[] {
  return [
    // ... existing forecasts
    {
      ticker: 'YOUR_TICKER',
      targetMetric: 'revenue',
      targetValue: 100,
      targetDate: '2027-12-31',
      drivers: [
        {
          name: 'Your Driver',
          description: 'Driver description',
          distributionType: 'triangular',
          parameters: { low: 1000, mode: 5000, high: 10000 },
          unit: 'units',
        },
      ],
      baserate: {
        description: 'Historical success rate',
        probability: 0.3,
        source: 'Your research',
      },
      premortem: [
        { scenario: 'Risk', failureMode: 'Specific failure' },
      ],
    },
  ];
}
```

### Change Color Scheme

Edit styles in component files:
- Primary: `#1aff92` (green)
- Background: `#0f3460` (dark blue)
- Card Background: `#16213e` (navy)
- Text: `#fff` (white), `#aaa` (gray)

### Modify Chart Appearance

In `ForecastChart.tsx` and `DistributionChart.tsx`:

```typescript
const chartConfig = {
  backgroundColor: '#YOUR_COLOR',
  backgroundGradientFrom: '#YOUR_COLOR',
  backgroundGradientTo: '#YOUR_COLOR',
  color: (opacity = 1) => `rgba(YOUR_RGB, ${opacity})`,
  // ... other config
};
```

## Integration with UFFP Core

To connect to the UFFP backend:

1. **Add API Client**:
```bash
npm install axios
```

2. **Create API Service**:
```typescript
// src/services/apiService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-uffp-server.com/api',
});

export const fetchForecasts = async () => {
  const response = await api.get('/forecasts');
  return response.data;
};
```

3. **Update ForecastService**:
```typescript
import { fetchForecasts } from './apiService';

async getForecasts() {
  return await fetchForecasts();
}
```

## Performance Optimization

### Reduce Simulation Time

Adjust iterations in `forecastService.ts`:

```typescript
// Faster (less accurate)
await runSimulation(drivers, 1000);

// Default (good balance)
await runSimulation(drivers, 10000);

// Slower (more accurate)
await runSimulation(drivers, 100000);
```

### Lazy Load Charts

Add dynamic imports for large components:

```typescript
import { lazy, Suspense } from 'react';

const ForecastChart = lazy(() => import('./components/ForecastChart'));

// In component
<Suspense fallback={<ActivityIndicator />}>
  <ForecastChart {...props} />
</Suspense>
```

## Build for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

### Android

```bash
# Build APK
eas build --platform android --profile production

# Or build AAB for Play Store
eas build --platform android --profile production
```

## Testing

```bash
# Run type checking
npx tsc --noEmit

# Test on web (fastest)
npm run web
```

## Troubleshooting

### "Metro bundler error"
```bash
# Clear cache
npm start -- --clear
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Charts not rendering"
- Ensure `react-native-svg` is installed
- Restart Metro bundler
- Clear cache: `npm start -- --clear`

## Future Enhancements

- [ ] Add user authentication
- [ ] Store forecasts locally (AsyncStorage)
- [ ] Push notifications for forecast resolution
- [ ] Share forecasts as images
- [ ] Compare multiple forecasts side-by-side
- [ ] Historical forecast accuracy tracking
- [ ] Leaderboard with Brier scores
- [ ] Dark/light theme toggle
- [ ] Export forecast data as PDF/CSV

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on iOS, Android, and Web
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- Documentation: `/docs` directory
- Issues: https://github.com/Replicant-Partners/uffp/issues
- Expo Docs: https://docs.expo.dev/

---

Built with ❤️ using Tetlock Superforecasting methodology
