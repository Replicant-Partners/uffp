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
import { v4 as uuidv4 } from "uuid";

/**
 * Action for resolving forecasts and calculating Brier scores
 */
export const resolveForecastAction: Action = {
  name: "RESOLVE_FORECAST",
  description: "Resolve a forecast with actual outcome and calculate Brier score for calibration",
  
  similes: [
    "RESOLVE",
    "RESOLVE_FORECAST",
    "CHECK_FORECAST",
    "UPDATE_FORECAST",
    "ACTUAL_OUTCOME"
  ],

  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    const text = message.content.text.toLowerCase();
    
    return (
      (text.includes("resolve") || text.includes("actual") || text.includes("outcome")) &&
      (text.includes("forecast") || text.includes("prediction"))
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
      elizaLogger.info("[RESOLVE_FORECAST] Resolving forecast");

      const text = message.content.text;

      // Extract forecast ID
      const idMatch = text.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
      if (!idMatch) {
        await callback({
          text: "Please provide a forecast ID to resolve. You can find it in the original forecast output.",
          error: true
        });
        return { success: false, error: new Error("No forecast ID provided") };
      }

      const forecastId = idMatch[1];

      // Retrieve forecast from memory
      const memories = await runtime.messageManager.getMemories({
        roomId: message.roomId,
        count: 100,
        unique: false
      });

      const forecastMemory = memories.find(m => 
        m.content.data?.forecastId === forecastId
      );

      if (!forecastMemory) {
        await callback({
          text: `Forecast ${forecastId} not found in memory.`,
          error: true
        });
        return { success: false, error: new Error("Forecast not found") };
      }

      const { config, result } = forecastMemory.content.data;

      // Determine actual outcome
      let actualOutcome = false;
      if (text.toLowerCase().includes("yes") || text.toLowerCase().includes("hit") || text.toLowerCase().includes("achieved")) {
        actualOutcome = true;
      } else if (text.toLowerCase().includes("no") || text.toLowerCase().includes("missed") || text.toLowerCase().includes("failed")) {
        actualOutcome = false;
      } else {
        await callback({
          text: "Please specify if the forecast was achieved (yes/no, hit/missed, achieved/failed).",
          error: true
        });
        return { success: false, error: new Error("Outcome not specified") };
      }

      // Calculate Brier score
      const predictedProbability = result.probabilityAboveTarget;
      const brierScore = brierService.calculate(predictedProbability, actualOutcome);
      const calibrationStatus = brierService.getCalibrationStatus(brierScore);

      // Store resolution in memory
      await runtime.messageManager.createMemory({
        id: uuidv4(),
        userId: message.userId,
        agentId: runtime.agentId,
        roomId: message.roomId,
        content: {
          text: `Forecast ${forecastId} resolved`,
          type: "forecast_resolution",
          data: {
            forecastId,
            actualOutcome,
            predictedProbability,
            brierScore,
            calibrationStatus,
            resolvedAt: new Date().toISOString()
          }
        },
        createdAt: Date.now()
      });

      const responseText = `
📝 **Forecast Resolution**

**Forecast ID**: \`${forecastId}\`
**Ticker**: ${config.ticker}
**Target**: $${config.targetValue}M ${config.targetMetric} by ${config.targetDate}

**Prediction**:
• Probability: ${(predictedProbability * 100).toFixed(1)}%
• P50 (median): $${result.p50.toFixed(1)}M

**Actual Outcome**: ${actualOutcome ? '✅ Target Achieved' : '❌ Target Missed'}

**Calibration Metrics**:
🎯 **Brier Score**: ${brierScore.toFixed(4)}
${calibrationStatus}

_${brierScore < 0.1 ? 'Outstanding accuracy!' : brierScore < 0.2 ? 'Good calibration - keep it up!' : brierScore < 0.25 ? 'Room for improvement' : 'Needs recalibration'}_

**What this means**:
• Brier Score ranges from 0 (perfect) to 1 (worst)
• Scores < 0.1 indicate superforecaster-level calibration
• This forecast was ${(Math.abs(predictedProbability - (actualOutcome ? 1 : 0)) * 100).toFixed(1)}% off
      `.trim();

      await callback({
        text: responseText,
        action: "RESOLVE_FORECAST"
      });

      return {
        success: true,
        text: responseText,
        data: {
          forecastId,
          actualOutcome,
          brierScore,
          calibrationStatus
        }
      };

    } catch (error) {
      elizaLogger.error("[RESOLVE_FORECAST] Error:", error);
      
      await callback({
        text: `Failed to resolve forecast: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          text: "Resolve forecast abc-123-def: the target was achieved"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "Calculating Brier score for forecast resolution...",
          action: "RESOLVE_FORECAST"
        }
      }
    ]
  ]
};
