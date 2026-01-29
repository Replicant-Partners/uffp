import {
  type Action,
  type IAgentRuntime,
  type Memory,
  type State,
  type HandlerCallback,
  type ActionResult,
  logger as elizaLogger,
} from "@elizaos/core";
import { forecastBuilder } from "@forecast-intel/core";
import type { ForecastConfig, ForecastDriver } from "@forecast-intel/core";
import { v4 as uuidv4 } from "uuid";

/**
 * Action for creating universal forecasts using Monte Carlo simulation
 */
export const universalForecastAction: Action = {
  name: "CREATE_FORECAST",
  description: "Create a probabilistic forecast using Monte Carlo simulation and Tetlock methodology",
  
  similes: [
    "FORECAST",
    "PREDICT",
    "ESTIMATE",
    "CREATE_FORECAST",
    "RUN_FORECAST",
    "MONTE_CARLO"
  ],

  validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    const text = message.content.text.toLowerCase();
    
    // Check if message contains forecasting keywords
    const forecastKeywords = [
      "forecast",
      "predict",
      "probability",
      "estimate",
      "monte carlo",
      "simulation",
      "what are the odds",
      "what's the chance"
    ];
    
    return forecastKeywords.some(keyword => text.includes(keyword));
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      elizaLogger.info("[CREATE_FORECAST] Creating probabilistic forecast");

      // Extract forecast parameters from message
      const text = message.content.text;
      
      // Parse ticker symbol
      const tickerMatch = text.match(/\b([A-Z]{2,5})\b/);
      const ticker = tickerMatch ? tickerMatch[1] : "UNKNOWN";

      // Parse target value
      const valueMatch = text.match(/\$?(\d+(?:\.\d+)?)\s*(M|million|B|billion)?/i);
      let targetValue = 100; // Default
      if (valueMatch) {
        targetValue = parseFloat(valueMatch[1]);
        const multiplier = valueMatch[2]?.toLowerCase();
        if (multiplier?.startsWith('b')) targetValue *= 1000;
      }

      // Parse target date
      const dateMatch = text.match(/(?:by|in|until)\s+(\d{4})/);
      const targetDate = dateMatch ? `${dateMatch[1]}-12-31` : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Determine target metric
      let targetMetric: "revenue" | "marketCap" | "profitability" = "revenue";
      if (text.toLowerCase().includes("market cap")) targetMetric = "marketCap";
      if (text.toLowerCase().includes("profit")) targetMetric = "profitability";

      // Create example drivers (in production, these would be extracted from conversation)
      const drivers: ForecastDriver[] = [
        {
          name: "Market Growth",
          description: "Overall market growth rate",
          distributionType: "triangular",
          parameters: { low: 0.8, mode: 1.2, high: 1.5 },
          unit: "multiplier"
        },
        {
          name: "Market Share",
          description: "Company's market share capture",
          distributionType: "normal",
          parameters: { mean: 0.15, stdDev: 0.05 },
          unit: "percentage"
        },
        {
          name: "Execution Risk",
          description: "Operational execution factor",
          distributionType: "beta",
          parameters: { alpha: 2, beta: 5 },
          unit: "multiplier"
        }
      ];

      // Build forecast configuration
      const config: ForecastConfig = {
        ticker,
        targetMetric,
        targetValue,
        targetDate,
        drivers,
        baserate: {
          description: "Historical success rate for similar forecasts",
          probability: 0.35,
          source: "Industry data"
        },
        premortem: [
          { scenario: "Market", failureMode: "Market conditions deteriorate" },
          { scenario: "Competition", failureMode: "Increased competitive pressure" },
          { scenario: "Execution", failureMode: "Operational challenges" }
        ]
      };

      // Run Monte Carlo simulation
      elizaLogger.info(`[CREATE_FORECAST] Running simulation for ${ticker}`);
      const result = await forecastBuilder.runForecast(config);

      // Store forecast in memory
      const forecastId = uuidv4();
      await runtime.messageManager.createMemory({
        id: uuidv4(),
        userId: message.userId,
        agentId: runtime.agentId,
        roomId: message.roomId,
        content: {
          text: `Forecast created for ${ticker}`,
          type: "forecast",
          data: {
            forecastId,
            config,
            result,
            createdAt: new Date().toISOString()
          }
        },
        createdAt: Date.now()
      });

      // Format response
      const responseText = `
📊 **Forecast: ${ticker} ${targetMetric.toUpperCase()}**

🎯 **Target**: $${targetValue}M by ${targetDate}
📈 **Probability**: ${(result.probabilityAboveTarget * 100).toFixed(1)}%

**Monte Carlo Results** (10,000 simulations):
• P10 (10th percentile): $${result.p10.toFixed(1)}M
• P50 (median): $${result.p50.toFixed(1)}M
• P90 (90th percentile): $${result.p90.toFixed(1)}M
• Mean: $${result.mean.toFixed(1)}M
• Std Dev: $${result.stdDev.toFixed(1)}M

**Key Drivers**:
${drivers.map(d => `• ${d.name}: ${d.distributionType} distribution`).join('\n')}

**Base Rate**: ${(config.baserate.probability * 100).toFixed(0)}% (${config.baserate.description})

**Premortem Analysis**:
${config.premortem.map(p => `⚠️  ${p.scenario}: ${p.failureMode}`).join('\n')}

Forecast ID: \`${forecastId}\`
_Track this forecast to calculate Brier score when resolved_
      `.trim();

      await callback({
        text: responseText,
        action: "CREATE_FORECAST"
      });

      return {
        success: true,
        text: responseText,
        data: {
          forecastId,
          ticker,
          config,
          result
        }
      };

    } catch (error) {
      elizaLogger.error("[CREATE_FORECAST] Error:", error);
      
      await callback({
        text: `Failed to create forecast: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          text: "What's the probability that ASTS will hit $150M revenue by 2026?"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "I'll create a probabilistic forecast for ASTS revenue. Let me run a Monte Carlo simulation...",
          action: "CREATE_FORECAST"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Can you forecast RKLB reaching $200M revenue by end of 2026?"
        }
      },
      {
        name: "{{agentName}}",
        content: {
          text: "Running Monte Carlo simulation for RKLB revenue forecast...",
          action: "CREATE_FORECAST"
        }
      }
    ]
  ]
};
