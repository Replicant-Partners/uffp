# Multi-Company Comparative Forecast Template

## Overview
Side-by-side probabilistic forecasting with correlation analysis for multiple companies.

## Template Structure

```
[Role]: Comparative Financial Intelligence System
[Task]: Generate probabilistic forecasts for {COMPANY_A} vs {COMPANY_B} on {METRIC}

[Constraints]:
- Use IDENTICAL methodology for both companies
- Identify INDEPENDENT vs CORRELATED drivers
- Calculate correlation coefficient for shared market factors

[Structure]:

═══════════════════════════════════════════════════════════
                    COMPARATIVE DECOMPOSITION
═══════════════════════════════════════════════════════════

TARGET METRIC: {Revenue | Market Share | Profitability}
TIME HORIZON: {FISCAL_PERIOD}

┌─ COMPANY A: {TICKER} ─────────────────────────────────────┐
│                                                            │
│ INDEPENDENT DRIVERS (unique to company):                  │
│   D1_A: {COMPANY_SPECIFIC_FACTOR_1}                       │
│   D2_A: {COMPANY_SPECIFIC_FACTOR_2}                       │
│                                                            │
│ DEPENDENT DRIVERS (shared with Company B):                │
│   D_SHARED_1: {MARKET_FACTOR}                             │
│   D_SHARED_2: {REGULATORY_FACTOR}                         │
│                                                            │
│ SIMULATION RESULT:                                        │
│   P10: {VALUE}  |  P50: {VALUE}  |  P90: {VALUE}         │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌─ COMPANY B: {TICKER} ─────────────────────────────────────┐
│                                                            │
│ INDEPENDENT DRIVERS:                                       │
│   D1_B: {COMPANY_SPECIFIC_FACTOR_1}                       │
│   D2_B: {COMPANY_SPECIFIC_FACTOR_2}                       │
│                                                            │
│ DEPENDENT DRIVERS (correlated with Company A):            │
│   D_SHARED_1: {MARKET_FACTOR} [correlation: {COEF}]       │
│   D_SHARED_2: {REGULATORY_FACTOR} [correlation: {COEF}]   │
│                                                            │
│ SIMULATION RESULT:                                        │
│   P10: {VALUE}  |  P50: {VALUE}  |  P90: {VALUE}         │
│                                                            │
└────────────────────────────────────────────────────────────┘

CORRELATED SCENARIOS (Market-Wide Events):
┌────────────────────────────────────────────────────────────┐
│ Scenario: "Bull Market" (Prob: {PROB})                    │
│   → Company A outcome: {PERCENTILE_SHIFT}                 │
│   → Company B outcome: {PERCENTILE_SHIFT}                 │
│                                                            │
│ Scenario: "Bear Market" (Prob: {PROB})                    │
│   → Company A outcome: {PERCENTILE_SHIFT}                 │
│   → Company B outcome: {PERCENTILE_SHIFT}                 │
└────────────────────────────────────────────────────────────┘

RELATIVE PROBABILITY:
P(Company A > Company B) = {PROBABILITY}%
```

## Key Features

- Distinguishes independent vs correlated drivers
- Calculates correlation coefficients for shared factors
- Models scenario-based outcomes
- Provides relative probability comparison
