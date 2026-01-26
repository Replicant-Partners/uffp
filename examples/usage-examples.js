"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@forecast-intel/core");
async function spaceExample() {
    // Define forecast drivers for ASTS revenue
    const drivers = [
        {
            name: "Subscriber Count",
            description: "Number of subscribers by end of 2026",
            distributionType: "triangular",
            parameters: {
                low: 100000,
                mode: 500000,
                high: 2000000,
            },
            unit: "subscribers",
        },
        {
            name: "ARPU (Monthly)",
            description: "Average Revenue Per User per month",
            distributionType: "triangular",
            parameters: {
                low: 10,
                mode: 15,
                high: 25,
            },
            unit: "USD/month",
        },
        {
            name: "Service Months",
            description: "Average months of service in 2026",
            distributionType: "uniform",
            parameters: {
                low: 6,
                high: 12,
            },
            unit: "months",
        },
    ];
    const config = await core_1.forecastBuilder.buildForecast({
        ticker: "ASTS",
        targetMetric: "revenue",
        targetValue: 150,
        targetDate: "2026-12-31",
        drivers: drivers,
        baserate: {
            description: "20% of pre-revenue satellite companies meet 24-month projections",
            probability: 0.2,
            source: "Historical satellite industry data",
        },
        premortem: [
            {
                scenario: "Technical Failure",
                failureMode: "Satellite constellation deployment delays",
            },
            {
                scenario: "Market Risk",
                failureMode: "Lower than expected subscriber adoption",
            },
            {
                scenario: "Regulatory",
                failureMode: "Spectrum licensing issues in key markets",
            },
        ],
    });
    const result = await core_1.forecastBuilder.runForecast(config);
    console.log("\n═══════════════════════════════════════════════════════");
    console.log("  PROBABILISTIC FORECAST: ASTS REVENUE");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log(`TARGET: Revenue ≥ $${config.targetValue}M by ${config.targetDate}\n`);
    console.log("SIMULATION RESULTS (10,000 iterations):");
    console.log(`  P10 (Bear Case):  $${result.p10.toFixed(2)}M`);
    console.log(`  P50 (Base Case):  $${result.p50.toFixed(2)}M`);
    console.log(`  P90 (Bull Case):  $${result.p90.toFixed(2)}M`);
    console.log(`  Mean:             $${result.mean.toFixed(2)}M`);
    console.log(`  Std Dev:          $${result.stdDev.toFixed(2)}M\n`);
    console.log(`PROBABILITY OF SUCCESS: ${(result.probabilityAboveTarget * 100).toFixed(1)}%\n`);
    console.log("DRIVERS USED:");
    config.drivers.forEach((d) => {
        console.log(`  • ${d.name}: ${JSON.stringify(d.parameters)}`);
    });
    console.log(`\nOUTSIDE VIEW (Base Rate): ${config.baserate.description}`);
    console.log("\n═══════════════════════════════════════════════════════\n");
}
spaceExample().catch(console.error);
