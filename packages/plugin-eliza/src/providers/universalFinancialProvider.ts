import {
  type Provider,
  type IAgentRuntime,
  type Memory,
  type State,
  logger as elizaLogger,
} from "@elizaos/core";

/**
 * Provider for financial data context (placeholder for API integration)
 */
export const universalFinancialProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<string> => {
    elizaLogger.info("[UniversalFinancialProvider] Providing financial context");

    // Extract ticker from message
    const text = message.content.text;
    const tickerMatch = text.match(/\b([A-Z]{2,5})\b/);
    const ticker = tickerMatch ? tickerMatch[1] : null;

    if (!ticker) {
      return "";
    }

    // In production, this would call Alpha Vantage, Yahoo Finance, etc.
    // For now, return placeholder data
    const context = `
**Financial Context for ${ticker}**:
• Sector: Technology/Aerospace
• Recent Performance: Growing revenue base
• Market Conditions: Bullish sentiment in sector
• Key Metrics: Revenue growth, market share expansion
• Risk Factors: Execution risk, competitive pressure, market conditions

_Note: Integrate with financial APIs for real-time data_
    `.trim();

    elizaLogger.info(`[UniversalFinancialProvider] Provided context for ${ticker}`);
    return context;
  },
};
