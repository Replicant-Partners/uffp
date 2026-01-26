# UFFP ElizaOS Deployment Guide

## Overview

This guide shows you how to integrate the UFFP (Universal Forecasting Financial Platform) plugin into an existing ElizaOS installation.

## Prerequisites

- Existing ElizaOS installation (v0.1.0+)
- Node.js >= 18.0.0
- pnpm package manager
- UFFP repository cloned at `/home/ilabra/uffp`

## Deployment Steps

### Step 1: Build the UFFP Plugin

First, build the UFFP packages:

```bash
cd /home/ilabra/uffp
pnpm install
pnpm run build
```

This compiles:
- `@forecast-intel/core` - Core forecasting engine
- `@forecast-intel/plugin-eliza` - ElizaOS plugin integration

### Step 2: Link UFFP as a Local Plugin

Create a symlink so ElizaOS can find the UFFP plugin:

```bash
# Navigate to the plugin directory
cd /home/ilabra/uffp/packages/plugin-eliza

# Create global symlink
pnpm link --global

# Navigate to your ElizaOS installation
cd /path/to/your/eliza

# Link the plugin
pnpm link --global @forecast-intel/plugin-eliza
```

**Alternative: Install as Local Dependency**

If symlink doesn't work, install directly:

```bash
cd /path/to/your/eliza

# Install from local path
pnpm add file:/home/ilabra/uffp/packages/plugin-eliza
```

### Step 3: Copy Character Configuration

Copy the forecaster character to your ElizaOS characters directory:

```bash
cp /home/ilabra/uffp/characters/universal-forecaster.json \
   /path/to/your/eliza/characters/
```

### Step 4: Update Character to Use Plugin

Edit `/path/to/your/eliza/characters/universal-forecaster.json` and add the plugin reference:

```json
{
  "name": "UniversalForecaster",
  "plugins": [
    "@forecast-intel/plugin-eliza"
  ],
  "modelProvider": "anthropic",
  ...
}
```

### Step 5: Configure Environment Variables

If using Alpha Vantage MCP for real financial data:

```bash
# In your ElizaOS .env file
echo "ALPHAVANTAGE_API_KEY=your_api_key_here" >> /path/to/your/eliza/.env
```

**Get a free Alpha Vantage API key**: https://www.alphavantage.co/support/#api-key

### Step 6: Start ElizaOS with the Forecaster Character

```bash
cd /path/to/your/eliza

# Start with the forecaster character
pnpm start --character=characters/universal-forecaster.json
```

**Or if using specific clients**:

```bash
# Discord client
pnpm start --character=characters/universal-forecaster.json --client=discord

# Twitter client
pnpm start --character=characters/universal-forecaster.json --client=twitter

# Multiple clients
pnpm start --character=characters/universal-forecaster.json --client=discord,twitter
```

## Verification

Once ElizaOS starts, verify the plugin loaded correctly:

1. **Check startup logs** for:
   ```
   [plugin] Loading plugin: @forecast-intel/plugin-eliza
   [plugin] Registered actions: INITIATE_SUPERFORECAST, RESOLVE_SPACE_FORECAST, GET_LEADERBOARD
   [plugin] Registered providers: spaceFinancialProvider
   ```

2. **Test basic interaction**:
   - Send: "What's your Brier score?"
   - Expected: Agent responds about calibration tracking

3. **Test forecasting**:
   - Send: "Forecast ASTS revenue for Q4 2026"
   - Expected: Agent starts decomposition interview

## Available Commands

Once deployed, the agent supports these interaction patterns:

### Forecasting Commands

```
# Single company forecast
"Forecast ASTS revenue for Q4 2026"
"What will RKLB revenue be in 2027?"
"Predict profitability for [TICKER]"

# Comparative forecast
"Compare ASTS vs RKLB revenue"
"Which is more likely to succeed: ASTS or RKLB?"

# Leaderboard
"Show leaderboard"
"What's my Brier score?"
"Who are the top forecasters?"

# Resolve forecasts
"Resolve my forecasts"
"Check if any forecasts can be scored"
```

### Expected Agent Behavior

**Example 1: Forecast Request**

**User**: "Forecast ASTS revenue for Q4 2026"

**Agent**:
```
Let's build a probabilistic forecast using Tetlock's methodology.

First, what's your Outside View? What percentage of pre-revenue 
satellite companies historically meet their 24-month projections?
```

**User**: "About 20%"

**Agent**:
```
Good base rate. Now let's decompose the revenue into independent drivers.

For ASTS Revenue = Subscribers × ARPU × Uptime × 12

For Subscribers, give me your 90% confidence interval:
- P5 (pessimistic): ?
- P50 (most likely): ?
- P95 (optimistic): ?
```

**Example 2: Leaderboard Request**

**User**: "Show leaderboard"

**Agent**:
```
═══════════════════════════════════════════════════════════════
                    FORECASTER CALIBRATION
═══════════════════════════════════════════════════════════════

Rank  Forecaster           Avg Brier  Calib   Bets  Status
─────────────────────────────────────────────────────────────
   1  alice@domain         0.087      0.92      34  Superforecaster
   2  bob@domain           0.112      0.88      28  Pro Analyst

Brier Score: (Predicted − Actual)²
Perfect = 0.00 | Random = 0.25 | Superforecaster < 0.10
```

## Plugin Architecture

The UFFP plugin provides:

### Actions
- **INITIATE_SUPERFORECAST** - Start decomposition interview
- **RESOLVE_SPACE_FORECAST** - Score forecasts on resolution date
- **GET_LEADERBOARD** - Display calibration rankings
- **GENERATE_COMPARISON** - Multi-company comparative analysis

### Providers
- **spaceFinancialProvider** - Fetches real-time financial data via Alpha Vantage MCP

### Services
- **brierService** - Brier score calculation
- **calibrationService** - Forecaster performance tracking
- **simulationService** - Monte Carlo engine

## Customization

### Add Sector-Specific Knowledge

Edit the character file to add sector expertise:

```json
{
  "knowledge": [
    "Your existing knowledge...",
    "SaaS companies typically have 110-120% net revenue retention",
    "Fintech payment processors average 2.5% take rate",
    "Biotech Phase 3 trials have 60% success rate historically"
  ]
}
```

### Customize Forecasting Style

Adjust the `style` section:

```json
{
  "style": {
    "all": [
      "Use precise probabilities",
      "Your custom style guidelines..."
    ]
  }
}
```

### Add Custom Drivers

Create sector templates in `/home/ilabra/uffp/templates/sectors/`:

```yaml
# templates/sectors/saas.yaml
name: saas
description: Software as a Service
drivers:
  - name: ARR
    description: Annual Recurring Revenue
    distributionType: triangular
    defaultParams:
      low: 1000000
      mode: 5000000
      high: 15000000
  - name: Net Revenue Retention
    distributionType: normal
    defaultParams:
      mean: 1.15
      stdDev: 0.10
```

## Troubleshooting

### Issue: Plugin not loading

**Check 1**: Verify plugin is built
```bash
cd /home/ilabra/uffp
pnpm run build
ls packages/plugin-eliza/dist/  # Should see index.js
```

**Check 2**: Verify symlink
```bash
cd /path/to/your/eliza/node_modules
ls -la | grep forecast-intel  # Should see symlink
```

**Check 3**: Check plugin name in character.json
```json
"plugins": [
  "@forecast-intel/plugin-eliza"  // Must match package name
]
```

### Issue: "Cannot find module @forecast-intel/core"

The plugin depends on the core package. Install both:

```bash
cd /path/to/your/eliza
pnpm add file:/home/ilabra/uffp/packages/core
pnpm add file:/home/ilabra/uffp/packages/plugin-eliza
```

### Issue: Agent doesn't start forecasting interview

**Check**: Action validation may be too strict. Test with explicit trigger:

```
User: "I want to initiate a superforecast for ASTS"
```

### Issue: Financial data not loading

**Check 1**: Alpha Vantage API key is set
```bash
grep ALPHAVANTAGE_API_KEY /path/to/your/eliza/.env
```

**Check 2**: MCP server is configured (if using MCP)
```json
{
  "settings": {
    "mcpServers": {
      "alphavantage": {
        "command": "uvx",
        "args": ["alphavantage-mcp"]
      }
    }
  }
}
```

### Issue: Memory/Database errors

ElizaOS stores forecasts in memory. Ensure database is initialized:

```bash
cd /path/to/your/eliza
pnpm run init-db  # If using PostgreSQL
```

## Advanced Configuration

### Use Custom Database for Forecasts

Create a dedicated PostgreSQL database:

```sql
CREATE DATABASE uffp_forecasts;

CREATE TABLE forecasts (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255),
  ticker VARCHAR(10),
  config JSONB,
  result JSONB,
  predicted_probability FLOAT,
  resolution_date TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE,
  actual_outcome BOOLEAN,
  brier_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_forecasts ON forecasts(user_id);
CREATE INDEX idx_unresolved ON forecasts(resolved) WHERE resolved = FALSE;
```

Then configure ElizaOS to use this database.

### Schedule Automatic Forecast Resolution

Add a cron job to check and resolve forecasts daily:

```bash
# Add to crontab
0 9 * * * cd /path/to/your/eliza && pnpm run resolve-forecasts
```

Create `resolve-forecasts` script:

```json
{
  "scripts": {
    "resolve-forecasts": "node scripts/resolve-forecasts.js"
  }
}
```

### Multi-Agent Leaderboard

If running multiple ElizaOS instances, aggregate forecasts:

```javascript
// scripts/aggregate-leaderboard.js
const forecasts = await fetchAllForecasts(); // From all agents
const leaderboard = calibrationService.calculateLeaderboard(forecasts);
console.log(leaderboard);
```

## Production Deployment

### Docker Deployment

Create a `Dockerfile` in your ElizaOS directory:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy ElizaOS
COPY package.json pnpm-lock.yaml ./
COPY . .

# Copy UFFP plugin
COPY --from=/home/ilabra/uffp/packages/plugin-eliza/dist /app/plugins/uffp

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build
RUN pnpm build

# Run
CMD ["pnpm", "start", "--character=characters/universal-forecaster.json"]
```

Build and run:
```bash
docker build -t eliza-forecaster .
docker run -d \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e ALPHAVANTAGE_API_KEY=$ALPHAVANTAGE_API_KEY \
  --name forecaster \
  eliza-forecaster
```

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_key_here

# Optional (for financial data)
ALPHAVANTAGE_API_KEY=your_key_here

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:pass@localhost:5432/eliza

# Discord bot (if using Discord client)
DISCORD_BOT_TOKEN=your_token_here
DISCORD_APPLICATION_ID=your_app_id_here

# Twitter (if using Twitter client)
TWITTER_API_KEY=your_key_here
TWITTER_API_SECRET=your_secret_here
```

## Testing the Deployment

### Unit Test: Plugin Loading

```bash
cd /path/to/your/eliza

# Check if plugin loads
node -e "
const plugin = require('@forecast-intel/plugin-eliza');
console.log('Plugin loaded:', plugin.spaceMarketIntelPlugin.name);
console.log('Actions:', plugin.spaceMarketIntelPlugin.actions.map(a => a.name));
"
```

Expected output:
```
Plugin loaded: space-market-intel
Actions: [ 'INITIATE_SUPERFORECAST', 'RESOLVE_SPACE_FORECAST', 'GET_LEADERBOARD', 'GENERATE_COMPARISON' ]
```

### Integration Test: Complete Forecast

Send a test message through your client:

```
User: "I want to forecast ASTS revenue for Q4 2026. 
       Base rate: 20% of satellite companies reach profitability.
       Subscribers: P5=1M, P50=3M, P95=7M
       ARPU: mean=$2.50, stddev=$0.50
       Uptime: 90% (Beta distribution)"
```

Agent should respond with:
- Parsed drivers
- Monte Carlo simulation results (P10/P50/P90)
- Probability of hitting target
- Forecast ID for future scoring

## Monitoring

### Log Forecasts

Add logging middleware:

```javascript
// In your ElizaOS config
{
  "middleware": {
    "forecast-logger": {
      "onForecastCreated": (forecast) => {
        console.log(`[FORECAST] ${forecast.ticker} by ${forecast.userId}`);
        // Send to analytics, Datadog, etc.
      }
    }
  }
}
```

### Track Calibration Metrics

Export metrics for monitoring:

```javascript
const metrics = {
  avgBrier: leaderboard.avgBrier,
  totalForecasts: leaderboard.totalForecasts,
  resolvedForecasts: leaderboard.resolvedForecasts
};

// Send to Prometheus, CloudWatch, etc.
```

## Support

- **Documentation**: `/home/ilabra/uffp/docs/`
- **Examples**: `/home/ilabra/uffp/examples/`
- **Templates**: `/home/ilabra/uffp/templates/`
- **Issues**: https://github.com/Replicant-Partners/uffp/issues

## Next Steps

1. ✅ Deploy plugin to ElizaOS
2. Test forecasting with example prompts
3. Create sector-specific templates
4. Set up automatic forecast resolution
5. Monitor calibration metrics
6. Add custom knowledge for your domain

The UFFP plugin is now integrated with your ElizaOS installation! 🚀
