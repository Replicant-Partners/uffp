import { ForecastConfig, SimulationResult } from "../types/universal";
import { monteCarloEngine } from "./MonteCarloEngine";

export class ForecastBuilder {
  /**
   * Builds a forecast configuration
   */
  async buildForecast(config: Partial<ForecastConfig>): Promise<ForecastConfig> {
    // Validate and build complete config
    if (!config.ticker || !config.targetMetric || !config.targetValue || !config.targetDate) {
      throw new Error("Missing required forecast parameters");
    }

    return {
      ticker: config.ticker,
      targetMetric: config.targetMetric,
      targetValue: config.targetValue,
      targetDate: config.targetDate,
      drivers: config.drivers || [],
      baserate: config.baserate || {
        description: "No base rate provided",
        probability: 0.5,
        source: "default",
      },
      premortem: config.premortem || [],
    };
  }

  /**
   * Runs a forecast simulation
   */
  async runForecast(config: ForecastConfig): Promise<SimulationResult> {
    const result = await monteCarloEngine.runMonteCarlo(config.drivers, 10000);

    // Calculate probability above target
    const aboveTarget = result.histogram
      .filter((h) => h.value >= config.targetValue)
      .reduce((sum, h) => sum + h.count, 0);

    result.probabilityAboveTarget = aboveTarget / 10000;

    return result;
  }
}

export const forecastBuilder = new ForecastBuilder();
