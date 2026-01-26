import { ForecastDriver, SimulationResult } from "../types/universal";

export class MonteCarloEngine {
  /**
   * Runs Monte Carlo simulation based on driver distributions
   */
  async runMonteCarlo(
    drivers: ForecastDriver[],
    iterations: number = 10000,
  ): Promise<SimulationResult> {
    const results: number[] = [];

    for (let i = 0; i < iterations; i++) {
      let value = 1;

      // Sample from each driver's distribution
      for (const driver of drivers) {
        const sample = this.sampleFromDistribution(driver);

        // Multiply or add depending on driver relationship
        // This is simplified - in production, use proper formula
        value *= sample;
      }

      results.push(value);
    }

    results.sort((a, b) => a - b);

    // Calculate percentiles
    const p10 = results[Math.floor(iterations * 0.1)];
    const p50 = results[Math.floor(iterations * 0.5)];
    const p90 = results[Math.floor(iterations * 0.9)];
    const mean = results.reduce((sum, v) => sum + v, 0) / iterations;

    // Calculate standard deviation
    const variance = results.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / iterations;
    const stdDev = Math.sqrt(variance);

    // Create histogram
    const histogram = this.createHistogram(results, 50);

    return {
      p10,
      p50,
      p90,
      mean,
      stdDev,
      probabilityAboveTarget: 0, // Set based on target
      histogram,
    };
  }

  private sampleFromDistribution(driver: ForecastDriver): number {
    switch (driver.distributionType) {
      case "triangular":
        return this.sampleTriangular(
          driver.parameters.low!,
          driver.parameters.mode!,
          driver.parameters.high!,
        );

      case "normal":
        return this.sampleNormal(driver.parameters.mean!, driver.parameters.stdDev!);

      case "beta":
        return this.sampleBeta(driver.parameters.alpha!, driver.parameters.beta!);

      case "uniform":
        return this.sampleUniform(driver.parameters.low!, driver.parameters.high!);

      default:
        return driver.parameters.mean || 1;
    }
  }

  private sampleTriangular(low: number, mode: number, high: number): number {
    const u = Math.random();
    const f = (mode - low) / (high - low);

    if (u < f) {
      return low + Math.sqrt(u * (high - low) * (mode - low));
    } else {
      return high - Math.sqrt((1 - u) * (high - low) * (high - mode));
    }
  }

  private sampleNormal(mean: number, stdDev: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  private sampleBeta(alpha: number, beta: number): number {
    // Simplified beta sampling (use proper library in production)
    const samples = 12;
    let sum = 0;
    for (let i = 0; i < samples; i++) {
      sum += Math.random();
    }
    return sum / samples;
  }

  private sampleUniform(low: number, high: number): number {
    return low + Math.random() * (high - low);
  }

  private createHistogram(data: number[], bins: number) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;

    const histogram = Array(bins).fill(0);

    data.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex]++;
    });

    return histogram.map((count, i) => ({
      value: min + (i + 0.5) * binWidth,
      count,
    }));
  }
}

export const monteCarloEngine = new MonteCarloEngine();
