import { Plugin } from "@elizaos/core";
import { universalForecastAction } from "./actions/universalForecastAction";
import { resolveForecastAction } from "./actions/resolveForecastAction";
import { leaderboardAction } from "./actions/leaderboardAction";
import { universalFinancialProvider } from "./providers/universalFinancialProvider";

/**
 * Universal Forecasting & Fermi Problems (UFFP) Plugin for ElizaOS
 * 
 * Enables AI agents to:
 * - Create probabilistic forecasts using Monte Carlo simulation
 * - Apply Tetlock Superforecasting methodology
 * - Track forecast accuracy with Brier scores
 * - Maintain calibration leaderboards
 * 
 * @example
 * ```typescript
 * import { universalForecastPlugin } from "@forecast-intel/plugin-eliza";
 * 
 * const character = {
 *   plugins: [universalForecastPlugin],
 *   // ...
 * };
 * ```
 */
export const universalForecastPlugin: Plugin = {
  name: "universal-forecast-intel",
  description: "Universal forecasting for any sector using Monte Carlo simulation and Tetlock methodology",
  
  actions: [
    universalForecastAction,
    resolveForecastAction,
    leaderboardAction
  ],
  
  providers: [
    universalFinancialProvider
  ],
  
  services: []
};

export default universalForecastPlugin;

// Export individual components for advanced usage
export {
  universalForecastAction,
  resolveForecastAction,
  leaderboardAction,
  universalFinancialProvider
};
