# 🎯 UFFP - Universal Forecasting & Fermi Problems

Universal probabilistic forecasting using Tetlock Superforecasting methodology.

## Overview

UFFP is a forecasting platform that combines probabilistic modeling, Monte Carlo simulation, and Fermi estimation to create accurate, calibrated forecasts. The platform is built as a monorepo with core forecasting logic, ElizaOS plugin integration, and web interfaces.

## Features

- 🌍 **Universal**: Works for any company in any sector
- 📊 **Probabilistic**: Monte Carlo simulation with 10k+ iterations
- 🎯 **Accurate**: Brier Score tracking for calibration
- 🤖 **Agent-Integrated**: ElizaOS plugin for autonomous forecasting
- 📱 **Multi-Platform**: Core library, web interface, and mobile app

## Repository Structure

```
packages/
├── core/           # Core forecasting engine and types
├── plugin-eliza/   # ElizaOS integration plugin
└── web-interface/  # Web-based forecasting interface

characters/         # ElizaOS character configurations
templates/          # Forecast templates and examples
docs/               # Documentation
scripts/            # Build and deployment scripts
```

## Related Projects

- **[UFFP Mobile App](https://github.com/Replicant-Partners/uffp-mobile)** - React Native mobile application (formerly part of this monorepo)

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run development servers
npm run dev

# Run examples
npm run examples
```

## Packages

### @forecast-intel/core

Core forecasting engine with Monte Carlo simulation, distribution modeling, and Brier score calculation.

```typescript
import { ForecastEngine } from '@forecast-intel/core';

const engine = new ForecastEngine();
const result = await engine.runSimulation(drivers, 10000);
```

### @forecast-intel/plugin-eliza

ElizaOS plugin for integrating forecasting capabilities into AI agents.

```typescript
import { forecastPlugin } from '@forecast-intel/plugin-eliza';

const character = {
  // ...
  plugins: [forecastPlugin],
};
```

## Supported Sectors

- 🚀 Space & Aerospace
- ☁️ Software as a Service  
- 💳 Financial Technology
- 🧬 Biotechnology
- And more...

## Forecasting Methodology

UFFP implements the Tetlock Superforecasting methodology:

1. **Fermi Decomposition**: Break complex questions into estimatable components
2. **Base Rates**: Ground forecasts in historical frequencies
3. **Distribution Modeling**: Use appropriate probability distributions (triangular, normal, beta, uniform)
4. **Monte Carlo Simulation**: Run thousands of iterations for robust probability estimates
5. **Premortem Analysis**: Identify potential failure modes
6. **Calibration Tracking**: Measure accuracy with Brier scores

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Core API Reference](docs/core-api.md)
- [ElizaOS Plugin Guide](docs/eliza-plugin.md)
- [Forecasting Best Practices](docs/best-practices.md)

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Lerna for monorepo management

### Build

```bash
# Build all packages
npm run build

# Build specific package
cd packages/core && npm run build
```

### Testing

```bash
# Run all tests
npm run test

# Test specific package
cd packages/core && npm run test
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT - See LICENSE file for details

## Links

- **Main Repository**: https://github.com/Replicant-Partners/uffp
- **Mobile App**: https://github.com/Replicant-Partners/uffp-mobile
- **Documentation**: https://github.com/Replicant-Partners/uffp/tree/main/docs
