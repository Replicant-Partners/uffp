# Pre-Mortem Decomposition Interview Protocol

## Purpose
Multi-stage interview to extract Tetlock-calibrated forecasting assumptions from users.

## Interview Stages

### STAGE 1: Outside View (Base Rate)

**Q1**: "What is the historical success rate for {REFERENCE_CLASS}?"
- Example: "20% of pre-revenue satellite companies reach profitability within 5 years"
- Purpose: Establish base rate anchor

**Q2**: "Why is {YOUR_COMPANY} different from this base rate?"
- Force user to justify deviation from outside view
- Prevents overconfidence

### STAGE 2: Fermi Decomposition

**Q3**: "What 3-5 INDEPENDENT drivers determine {TARGET_METRIC}?"
- Revenue = f(Demand, Price, Execution)
- Avoid overlapping drivers (subscriber growth ≠ market penetration)

**Q4**: "For each driver, provide your 90% confidence interval"
- "I'm 90% sure {DRIVER_1} will be between X and Y"
- This means: P5 and P95, not P10 and P90

**Q5**: "What's the most likely value (mode) for each driver?"
- Establishes triangular distribution

### STAGE 3: Distribution Specification

**Q6**: "Is {DRIVER_1} symmetric around the mode, or skewed?"
- Symmetric → Normal distribution
- Right-skewed → Log-normal or Triangular
- Binary success/fail → Beta distribution

### STAGE 4: Pre-Mortem

**Q7**: "Imagine it's {TARGET_DATE} and your forecast failed by 50%. What happened?"
- Force 3 specific failure modes
- Not: "market conditions"
- Yes: "SpaceX F9 grounding caused 6-month delay"

### STAGE 5: Update Logic

**Q8**: "What specific event would make you change this forecast by >10%?"
- Example: "If ASTS announces <30 satellites deployed by Q4"
- This becomes your "leading indicator" for mid-course updates

### STAGE 6: Confidence Calibration

**Q9**: "On a scale of 0-100%, what's your confidence that {TARGET_METRIC} exceeds {TARGET_VALUE}?"

**Q10**: "If you had to bet $100 at even odds, would you take this bet?"
- Calibration check: stated probability should match willingness to bet

## Implementation Notes

- Run as multi-turn conversation
- Store responses in structured format
- Use responses to build ForecastConfig
- Track for future Brier scoring
