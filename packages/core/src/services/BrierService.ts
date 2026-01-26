export class BrierService {
  /**
   * Calculates Brier Score: (predicted_probability - actual_outcome)²
   * @param probability Predicted probability (0-1)
   * @param outcome Actual outcome (true/false)
   * @returns Brier score (0 = perfect, 1 = worst)
   */
  calculate(probability: number, outcome: boolean): number {
    const actualValue = outcome ? 1.0 : 0.0;
    return Math.pow(probability - actualValue, 2);
  }

  /**
   * Returns calibration status based on Brier score
   */
  getCalibrationStatus(score: number): string {
    if (score < 0.1) return "🎯 Superforecaster Status";
    if (score < 0.2) return "✓ Good Calibration";
    if (score < 0.25) return "~ Fair (Better than random)";
    return "✗ Poor Calibration";
  }

  /**
   * Calculates average Brier score across multiple predictions
   */
  calculateAverage(scores: number[]): number {
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
}

export const brierService = new BrierService();
