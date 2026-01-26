# Example: ASTS Q4 2026 Revenue Forecast

## Complete Working Example

```
[Role]: Superforecasting Analyst (Tetlock-Calibrated)
[Task]: Generate probabilistic revenue forecast for ASTS Q4 2026

[Method]:
1. OUTSIDE VIEW
   - Base Rate: 15% of pre-revenue satellite firms reach $100M within 36 months of launch
   - Reference Class: Iridium (failed 1st gen, succeeded 2nd), Globalstar, OneWeb
   - Source: Space Capital Quarterly Reports 2010-2024

2. FERMI DECOMPOSITION
   ASTS Revenue = Active_Subscribers × Monthly_ARPU × Uptime_Factor × 12
   
   Driver_1: Active_Subscribers (millions)
   - Distribution: Triangular
   - Low: 1.5M (only emergency services)
   - Mode: 3.5M (AT&T + Verizon soft launch)
   - High: 7.0M (full MNO rollout)
   - Justification: 50M+ MNO agreements, but adoption depends on handset compatibility
   
   Driver_2: Monthly_ARPU ($)
   - Distribution: Normal
   - Mean: $2.50
   - StdDev: $0.60
   - Justification: Pricing between premium sat-phone ($30+) and cellular add-on ($0)
   
   Driver_3: Constellation_Uptime
   - Distribution: Beta(α=90, β=10)
   - Represents: % time service is available (depends on satellite density)
   - Justification: 60 satellites planned by end 2026, need 45+ for continuous coverage

3. MONTE CARLO SIMULATION
   - Iterations: 10,000
   - Formula: Revenue_Annual = Subs × ARPU × Uptime × 12
   - Output: P10=$58M, P50=$126M, P90=$252M
   - Probability(Revenue > $150M) = 42%

4. PRE-MORTEM
   Scenario: Q4 2026. Revenue was $40M (68% below P50). Why?
   - SpaceX Falcon 9 grounding delayed 3 launches → only 30 satellites deployed
   - Apple refused iOS integration → addressable market cut by 60%
   - Regulatory delays in EU prevented international expansion

5. UPDATE TRIGGERS
   - BlueBird Block 2 launch manifest published (changes satellite count assumption)
   - First commercial MNO pricing announcement (updates ARPU)
   - FCC approves/denies supplemental spectrum allocation
```

## Key Insights

- Base rate anchors at 15% success for similar companies
- Three independent drivers multiply to create revenue
- Wide confidence interval (P90/P10 = 4.3x) reflects high uncertainty
- Pre-mortem identifies specific technical risks
- Update triggers tied to measurable events
