# UFFP Agent Preview Guide

## Overview

The UFFP (Universal Forecasting Financial Platform) agent is a Tetlock-calibrated forecasting system that can be run in multiple modes:

1. **CLI Tool** - Command-line forecasting with the core library
2. **ElizaOS Agent** - Conversational AI agent for interactive forecasting
3. **Web Interface** - Browser-based forecasting dashboard (coming soon)

## Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm
- Bun runtime (for TypeScript execution)

## Quick Start: CLI Preview

### 1. Run the Example Forecast

The simplest way to preview the forecasting engine:

```bash
cd /home/ilabra/uffp
bun run examples/usage-examples.ts
```

This runs a complete ASTS revenue forecast with:
- Monte Carlo simulation (10,000 iterations)
- Triangular and uniform distributions
- P10/P50/P90 confidence intervals
- Base rate analysis
- Pre-mortem failure scenarios

### 2. Create Your Own Forecast

Create a new file `examples/my-forecast.ts`:

```typescript
import { forecastBuilder, ForecastDriver } from "../packages/core/src/index";

async function myForecast() {
  const drivers: ForecastDriver[] = [
    {
      name: "Subscribers",
      description: "Total active users",
      distributionType: "triangular",
      parameters: {
        low: 100000,
        mode: 500000,
        high: 2000000
      },
      unit: "users"
    },
    {
      name: "ARPU",
      description: "Average revenue per user",
      distributionType: "normal",
      parameters: {
        mean: 15,
        stdDev: 3
      },
      unit: "USD/month"
    }
  ];

  const config = await forecastBuilder.buildForecast({
    ticker: 'YOUR_TICKER',
    targetMetric: 'revenue',
    targetValue: 100, // in millions
    targetDate: '2026-12-31',
    drivers: drivers,
    baserate: {
      description: "Historical success rate for this sector",
      probability: 0.25,
      source: "Your research"
    },
    premortem: [
      {
        scenario: "Technical Risk",
        failureMode: "Specific technical failure"
      }
    ]
  });
  
  const result = await forecastBuilder.runForecast(config);
  
  // Display results
  const toMillions = (value: number) => value / 1_000_000;
  console.log(`P10: $${toMillions(result.p10).toFixed(2)}M`);
  console.log(`P50: $${toMillions(result.p50).toFixed(2)}M`);
  console.log(`P90: $${toMillions(result.p90).toFixed(2)}M`);
  console.log(`Probability > $${config.targetValue}M: ${(result.probabilityAboveTarget * 100).toFixed(1)}%`);
}

myForecast().catch(console.error);
```

Run it:
```bash
bun run examples/my-forecast.ts
```

## ElizaOS Agent Setup (Advanced)

### 1. Install ElizaOS

```bash
cd /home/ilabra
git clone https://github.com/elizaos/eliza.git
cd eliza
pnpm install
pnpm build
```

### 2. Link UFFP as a Local Plugin

```bash
cd /home/ilabra/uffp/packages/plugin-eliza
pnpm link --global

cd /home/ilabra/eliza
pnpm link --global @forecast-intel/plugin-eliza
```

### 3. Configure Character

Copy the character configuration:

```bash
cp /home/ilabra/uffp/characters/universal-forecaster.json \
   /home/ilabra/eliza/characters/universal-forecaster.json
```

Edit the character file to add the plugin:

```json
{
  "name": "UniversalForecaster",
  "plugins": [
    "@forecast-intel/plugin-eliza"
  ],
  ...
}
```

### 4. Run the Agent

```bash
cd /home/ilabra/eliza
pnpm start --character=characters/universal-forecaster.json
```

## Agent Interaction Examples

Once the agent is running, you can interact with forecasting commands:

### Example 1: Single Company Forecast

**User**: "I want to forecast ASTS revenue for Q4 2026"

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

### Example 2: Comparative Forecast

**User**: "Compare ASTS vs RKLB revenue for 2026"

**Agent**:
```
Running comparative forecast with correlation analysis...

ASTS (Direct-to-Cell Satellite):
  P10: $58M  |  P50: $126M  |  P90: $252M

RKLB (Launch Services):
  P10: $168M  |  P50: $224M  |  P90: $285M

Shared Drivers:
  - Launch Availability (correlation: 0.75)
  - Space Market Sentiment (correlation: 0.85)

P(ASTS > RKLB) = 8%

ASTS has 4.3x variance (high risk, high upside)
RKLB has 1.7x variance (more predictable)
```

### Example 3: Check Leaderboard

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
   3  charlie@domain       0.156      0.81      19  Pro Analyst
   4  david@domain         0.203      0.74      12  Emerging

Brier Score: (Predicted − Actual)²
Perfect = 0.00 | Random = 0.25 | Superforecaster < 0.10
```

## Available Distribution Types

### Triangular Distribution
Best for: Asymmetric uncertainty with known min/mode/max

```typescript
{
  distributionType: "triangular",
  parameters: {
    low: 1000,    // Minimum value
    mode: 5000,   // Most likely value
    high: 15000   // Maximum value
  }
}
```

### Normal Distribution
Best for: Symmetric uncertainty around a mean

```typescript
{
  distributionType: "normal",
  parameters: {
    mean: 10000,
    stdDev: 2000
  }
}
```

### Beta Distribution
Best for: Probabilities or percentages (bounded 0-1)

```typescript
{
  distributionType: "beta",
  parameters: {
    alpha: 90,  // Success-like events
    beta: 10    // Failure-like events
  }
}
```

### Uniform Distribution
Best for: No preference for any value in range

```typescript
{
  distributionType: "uniform",
  parameters: {
    low: 5,
    high: 10
  }
}
```

## Prompt Templates

All Tetlock-style prompts are in `/templates/prompts/`:

- `single-company-forecast.md` - Individual company forecasting
- `comparative-forecast.md` - Multi-company comparison

Interview protocols in `/templates/interviews/`:

- `decomposition-protocol.md` - Multi-stage forecasting interview

Working examples in `/templates/examples/`:

- `asts-revenue-forecast.md` - Complete ASTS example
- `asts-vs-rklb-comparison.md` - Comparative forecast example

## Key Forecasting Principles

### 1. Outside View First
Always start with base rates for the reference class before analyzing the specific company.

### 2. Fermi Decomposition
Break the target metric into 3-5 independent drivers that multiply/add to create the outcome.

### 3. Probabilistic Thinking
Use distributions, not point estimates. Provide P10/P50/P90 ranges.

### 4. Pre-Mortem Analysis
Imagine failure and work backwards to identify specific failure modes.

### 5. Brier Scoring
Every forecast must be scoreable: (predicted_probability - actual_outcome)²

## Troubleshooting

### "Cannot find module" errors
Make sure you've built the core package:
```bash
cd /home/ilabra/uffp
pnpm run build
```

### TypeScript execution errors
Use `bun` instead of `node`:
```bash
bun run examples/usage-examples.ts
```

### Large values in output
Results are in dollars, divide by 1,000,000 to convert to millions:
```typescript
const toMillions = (value: number) => value / 1_000_000;
```

## Next Steps

1. **Try the CLI examples** - Run existing forecasts
2. **Create custom forecasts** - Build your own driver models
3. **Install ElizaOS** - Set up the conversational agent
4. **Track calibration** - Make forecasts and score them with Brier
5. **Contribute templates** - Add new sector-specific templates

## Support

- Documentation: `/docs` directory
- Examples: `/examples` directory
- Templates: `/templates` directory
- Issues: https://github.com/Replicant-Partners/uffp/issues
