import {
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
  type HandlerCallback,
  type ActionResult,
  logger as elizaLogger,
} from "@elizaos/core";
import { brierService } from "@forecast-intel/core";

/**
 * Action for displaying forecasting leaderboard and calibration metrics
 */
export const leaderboardAction: Action = {
  name: "VIEW_LEADERBOARD",
  description: "View forecasting leaderboard showing top forecasters by Brier score",
  
  similes: [
    "LEADERBOARD",
    "RANKINGS",
    "STANDINGS",
    "TOP_FORECASTERS",
    "SHOW_LEADERBOARD"
  ],

  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    const text = message.content.text.toLowerCase();
    
    return (
      text.includes("leaderboard") ||
      text.includes("ranking") ||
      text.includes("standings") ||
      (text.includes("top") && text.includes("forecaster"))
    );
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      elizaLogger.info("[VIEW_LEADERBOARD] Generating leaderboard");

      // Retrieve all forecast resolutions from memory
      const memories = await runtime.messageManager.getMemories({
        roomId: message.roomId,
        count: 1000,
        unique: false
      });

      const resolutions = memories.filter(m => 
        m.content.type === "forecast_resolution"
      );

      if (resolutions.length === 0) {
        await callback({
          text: "No resolved forecasts yet. Create and resolve forecasts to start tracking calibration!",
          action: "VIEW_LEADERBOARD"
        });
        return { success: true, text: "No forecasts resolved yet" };
      }

      // Group by user and calculate statistics
      const userStats = new Map<string, { scores: number[], totalForecasts: number }>();

      for (const resolution of resolutions) {
        const userId = resolution.userId;
        const brierScore = resolution.content.data.brierScore;

        if (!userStats.has(userId)) {
          userStats.set(userId, { scores: [], totalForecasts: 0 });
        }

        const stats = userStats.get(userId)!;
        stats.scores.push(brierScore);
        stats.totalForecasts++;
      }

      // Calculate average Brier scores and create leaderboard
      const leaderboard = Array.from(userStats.entries())
        .map(([userId, stats]) => ({
          userId,
          avgBrier: brierService.calculateAverage(stats.scores),
          totalForecasts: stats.totalForecasts,
          status: stats.scores.length < 3 
            ? "Emerging" 
            : brierService.calculateAverage(stats.scores) < 0.1 
              ? "Superforecaster" 
              : brierService.calculateAverage(stats.scores) < 0.2 
                ? "Pro Analyst" 
                : "Emerging"
        }))
        .sort((a, b) => a.avgBrier - b.avgBrier);

      // Format leaderboard
      const responseText = `
🏆 **Forecasting Leaderboard**

${leaderboard.map((entry, index) => `
${index + 1}. **${entry.userId}**
   • Avg Brier Score: ${entry.avgBrier.toFixed(4)}
   • Status: ${entry.status}
   • Forecasts: ${entry.totalForecasts}
   • Calibration: ${brierService.getCalibrationStatus(entry.avgBrier)}
`).join('\n')}

**Legend**:
🎯 Superforecaster: < 0.10 Brier Score
✓ Pro Analyst: 0.10 - 0.20
~ Emerging: > 0.20

_Lower Brier scores indicate better calibration_
      `.trim();

      await callback({
        text: responseText,
        action: "VIEW_LEADERBOARD"
      });

      return {
        success: true,
        text: responseText,
        data: { leaderboard }
      };

    } catch (error) {
      elizaLogger.error("[VIEW_LEADERBOARD] Error:", error);
      
      await callback({
        text: `Failed to generate leaderboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      });

      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },

  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me the leaderboard"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "Here are the top forecasters by calibration...",
          action: "VIEW_LEADERBOARD"
        }
      }
    ]
  ]
};
