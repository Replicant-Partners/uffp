# Single Company Revenue Forecast Template

## Overview
Tetlock-calibrated probabilistic forecasting for individual company revenue projections.

## Template Structure

```
[Role]: Superforecasting Analyst (Tetlock-Calibrated)
[Task]: Generate probabilistic revenue forecast for {COMPANY} {FISCAL_PERIOD}

[Method]:
1. OUTSIDE VIEW
   - Base Rate: What % of {SECTOR} companies hit similar targets historically?
   - Reference Class: Use {COMPARABLE_COMPANIES} as benchmark
   - Source: {DATA_SOURCE}

2. FERMI DECOMPOSITION (Independent Drivers)
   For {COMPANY} Revenue = f(Driver_1, Driver_2, Driver_3)
   
   Driver_1: {DEMAND_METRIC}
   - Distribution: Triangular
   - Low: {P10_VALUE} {UNIT}
   - Mode: {P50_VALUE} {UNIT}
   - High: {P90_VALUE} {UNIT}
   - Justification: {REASONING}
   
   Driver_2: {PRICING_METRIC}
   - Distribution: Normal
   - Mean: {MEAN_VALUE} {UNIT}
   - StdDev: {STDDEV_VALUE} {UNIT}
   - Justification: {REASONING}
   
   Driver_3: {EXECUTION_METRIC}
   - Distribution: Beta(α={ALPHA}, β={BETA})
   - Represents: Probability of operational success
   - Justification: {REASONING}

3. MONTE CARLO SIMULATION
   - Iterations: 10,000
   - Formula: Revenue = Driver_1 × Driver_2 × Driver_3 × 12 (if monthly)
   - Output: P10, P50, P90, Probability(Revenue > Target)

4. PRE-MORTEM
   Scenario: It's {TARGET_DATE}. Revenue was 50% below forecast. Why?
   - Failure Mode 1: {BOTTLENECK_SCENARIO}
   - Failure Mode 2: {EXECUTION_RISK}
   - Failure Mode 3: {MARKET_CONDITION}

5. UPDATE TRIGGERS
   What new information would change this forecast by >10%?
   - {LEADING_INDICATOR_1}
   - {LEADING_INDICATOR_2}
   - {LEADING_INDICATOR_3}

[Deliverables]:
- P10/P50/P90 confidence intervals
- Binary probability for specific target
- Fermi driver assumptions (for Brier scoring)
- Pre-mortem risk register
```

## Variables to Replace

- `{COMPANY}` - Company name or ticker
- `{FISCAL_PERIOD}` - Target time period
- `{SECTOR}` - Industry sector
- `{COMPARABLE_COMPANIES}` - Reference class companies
- `{DATA_SOURCE}` - Source of historical data
- `{DEMAND_METRIC}` - Primary demand driver
- `{PRICING_METRIC}` - Pricing/ARPU driver
- `{EXECUTION_METRIC}` - Operational execution factor
- `{TARGET_DATE}` - Forecast resolution date
