# Example: ASTS vs RKLB 2026 Revenue Comparison

## Complete Comparative Forecast

```
═══════════════════════════════════════════════════════════
          ASTS vs RKLB: 2026 REVENUE COMPARISON
═══════════════════════════════════════════════════════════

┌─ COMPANY A: ASTS ──────────────────────────────────────────┐
│                                                             │
│ INDEPENDENT DRIVERS:                                        │
│   D1_A: Satellite_Subscribers                              │
│         Triangular(1.5M, 3.5M, 7M)                         │
│         Unique to ASTS: Direct-to-unmodified-phone tech    │
│                                                             │
│   D2_A: MNO_Partnership_ARPU                               │
│         Normal(μ=$2.50, σ=$0.60)                           │
│         Unique to ASTS: Revenue-share model with carriers  │
│                                                             │
│ SHARED DRIVERS:                                             │
│   D_SHARED_1: Launch_Availability                          │
│         Beta(α=80, β=20) — SpaceX/Rocket Lab capacity      │
│         [Correlation with RKLB: 0.75]                      │
│                                                             │
│   D_SHARED_2: Space_Market_Sentiment                       │
│         Normal(μ=1.0, σ=0.3) — Investor risk appetite      │
│         [Correlation with RKLB: 0.85]                      │
│                                                             │
│ FORMULA:                                                    │
│   Revenue = Subscribers × ARPU × Launch_Success × 12       │
│                                                             │
│ SIMULATION (10k iterations):                                │
│   P10: $58M  |  P50: $126M  |  P90: $252M                  │
│   P(Revenue > $150M) = 42%                                  │
└─────────────────────────────────────────────────────────────┘

┌─ COMPANY B: RKLB ──────────────────────────────────────────┐
│                                                             │
│ INDEPENDENT DRIVERS:                                        │
│   D1_B: Launch_Cadence                                     │
│         Triangular(18, 24, 30) launches/year               │
│         Unique to RKLB: Electron + Neutron dual manifest   │
│                                                             │
│   D2_B: Space_Systems_Backlog                              │
│         Normal(μ=$450M, σ=$80M)                            │
│         Unique to RKLB: Satellite manufacturing division   │
│                                                             │
│   D3_B: Avg_Launch_Price                                   │
│         Normal(μ=$7.5M, σ=$1.2M)                           │
│         Competitive pressure from SpaceX Transporter       │
│                                                             │
│ SHARED DRIVERS:                                             │
│   D_SHARED_1: Launch_Availability                          │
│         [Same distribution as ASTS, correlation: 0.75]     │
│                                                             │
│   D_SHARED_2: Space_Market_Sentiment                       │
│         [Same distribution as ASTS, correlation: 0.85]     │
│                                                             │
│ FORMULA:                                                    │
│   Revenue = (Launches × Price) + (Systems_Backlog × 0.4)   │
│                                                             │
│ SIMULATION (10k iterations):                                │
│   P10: $168M  |  P50: $224M  |  P90: $285M                 │
│   P(Revenue > $200M) = 68%                                  │
└─────────────────────────────────────────────────────────────┘

CORRELATED SCENARIOS:
┌─────────────────────────────────────────────────────────────┐
│ "Space Renaissance" (25% probability)                      │
│   D_SHARED_2 = 1.5 (high sentiment)                        │
│   → ASTS jumps to P75 (~$200M)                             │
│   → RKLB jumps to P80 (~$260M)                             │
│   Explanation: Capital floods sector, accelerates both     │
│                                                             │
│ "Falcon 9 Grounding" (15% probability)                     │
│   D_SHARED_1 = 0.4 (low launch availability)              │
│   → ASTS falls to P20 (~$75M) — fewer satellites          │
│   → RKLB rises to P65 (~$240M) — captures SpaceX demand   │
│   Explanation: Asymmetric impact on launch provider        │
└─────────────────────────────────────────────────────────────┘

RELATIVE FORECAST:
P(ASTS_Revenue > RKLB_Revenue in 2026) = 8%

INVESTMENT INSIGHT:
RKLB shows tighter confidence interval (P90/P10 = 1.7x)
ASTS shows wider distribution (P90/P10 = 4.3x)
→ ASTS = higher risk, higher potential upside
→ RKLB = more predictable, lower variance
```

## Key Features

- Separate independent vs correlated drivers
- Correlation coefficients quantified (0.75, 0.85)
- Scenario analysis shows asymmetric impacts
- Relative probability calculation
- Risk/return profile comparison
