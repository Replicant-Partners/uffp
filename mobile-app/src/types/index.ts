export interface ForecastDriver {
  name: string;
  description: string;
  distributionType: 'triangular' | 'normal' | 'beta' | 'uniform';
  parameters: {
    low?: number;
    mode?: number;
    high?: number;
    mean?: number;
    stdDev?: number;
    alpha?: number;
    beta?: number;
  };
  unit: string;
}

export interface ForecastConfig {
  ticker: string;
  targetMetric: 'revenue' | 'marketCap' | 'profitability';
  targetValue: number;
  targetDate: string;
  drivers: ForecastDriver[];
  baserate: {
    description: string;
    probability: number;
    source: string;
  };
  premortem: {
    scenario: string;
    failureMode: string;
  }[];
}

export interface SimulationResult {
  p10: number;
  p50: number;
  p90: number;
  mean: number;
  stdDev: number;
  probabilityAboveTarget: number;
  histogram: { value: number; count: number }[];
}

export interface ForecastRecord {
  id: string;
  userId: string;
  ticker: string;
  config: ForecastConfig;
  result: SimulationResult;
  predictedProbability: number;
  resolutionDate: Date;
  resolved: boolean;
  actualOutcome?: boolean;
  brierScore?: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  avgBrier: number;
  calibration: number;
  totalForecasts: number;
  resolvedForecasts: number;
  status: 'Superforecaster' | 'Pro Analyst' | 'Emerging';
}
