import { LeaderboardEntry, ForecastRecord } from "../types/universal";

export class CalibrationService {
  /**
   * Calculates calibration index for a forecaster
   * Measures how well predicted probabilities match actual frequencies
   */
  calculateCalibration(forecasts: ForecastRecord[]): number {
    const bins = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    let totalError = 0;
    let binCount = 0;

    for (let i = 0; i < bins.length - 1; i++) {
      const binForecasts = forecasts.filter(
        (f) => f.predictedProbability >= bins[i] && f.predictedProbability < bins[i + 1],
      );

      if (binForecasts.length === 0) continue;

      const avgPredicted =
        binForecasts.reduce((sum, f) => sum + f.predictedProbability, 0) / binForecasts.length;
      const actualFreq = binForecasts.filter((f) => f.actualOutcome).length / binForecasts.length;

      totalError += Math.abs(avgPredicted - actualFreq);
      binCount++;
    }

    return binCount > 0 ? 1 - totalError / binCount : 0;
  }

  /**
   * Generates leaderboard from forecast records
   */
  calculateLeaderboard(forecasts: ForecastRecord[]): LeaderboardEntry[] {
    const userForecasts = new Map<string, ForecastRecord[]>();

    // Group by user
    forecasts.forEach((f) => {
      if (!userForecasts.has(f.userId)) {
        userForecasts.set(f.userId, []);
      }
      userForecasts.get(f.userId)!.push(f);
    });

    // Calculate metrics for each user
    return Array.from(userForecasts.entries()).map(([userId, userForecastList]) => {
      const resolved = userForecastList.filter((f) => f.resolved);
      const brierScores = resolved.map((f) => f.brierScore!);
      const avgBrier = brierScores.reduce((sum, s) => sum + s, 0) / brierScores.length;
      const calibration = this.calculateCalibration(resolved);

      let status: "Superforecaster" | "Pro Analyst" | "Emerging" = "Emerging";
      if (avgBrier < 0.1) status = "Superforecaster";
      else if (avgBrier < 0.2) status = "Pro Analyst";

      return {
        userId,
        avgBrier,
        calibration,
        totalForecasts: userForecastList.length,
        resolvedForecasts: resolved.length,
        status,
      };
    });
  }
}

export const calibrationService = new CalibrationService();
