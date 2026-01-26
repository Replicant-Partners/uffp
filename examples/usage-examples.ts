import { forecastBuilder } from "@forecast-intel/core";

async function spaceExample() {
  const config = await forecastBuilder.buildForecast({
    ticker: 'ASTS',
    sector: 'space',
    targetMetric: 'revenue',
    targetValue: 150,
    targetDate: '2026-12-31',
    drivers: [],
    userId: 'example'
  });
  
  const result = await forecastBuilder.runForecast(config);
  console.log('ASTS Forecast:', result);
}

spaceExample().catch(console.error);
