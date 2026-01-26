# @forecast-intel/core

Universal probabilistic forecasting engine.

## Installation

```bash
npm install @forecast-intel/core
```

## Usage

```typescript
import { forecastBuilder } from "@forecast-intel/core";

const config = await forecastBuilder.buildForecast({
  ticker: 'SNOW',
  sector: 'saas',
  // ... configuration
});

const result = await forecastBuilder.runForecast(config);
```
