# UFFP Prompt Templates

## Overview

This directory contains Tetlock-style forecasting prompt templates for the Universal Forecasting Financial Platform (UFFP).

## Templates

### Core Forecasting
- `single-company-forecast.md` - Individual company probabilistic forecasting
- `comparative-forecast.md` - Multi-company side-by-side analysis

### Interview Protocols
- `../interviews/decomposition-protocol.md` - Multi-stage interview for extracting assumptions

### Examples
- `../examples/asts-revenue-forecast.md` - Complete ASTS forecast example
- `../examples/asts-vs-rklb-comparison.md` - Comparative forecast example

## Usage

1. **For ElizaOS Agent**: Import templates into character knowledge base
2. **For CLI Tool**: Reference templates in forecast commands
3. **For Web Interface**: Use templates to structure forecast input forms

## Key Principles

All templates follow Tetlock Superforecasting methodology:

1. **Outside View First** - Start with base rates
2. **Fermi Decomposition** - Break into independent drivers
3. **Probabilistic Thinking** - Use distributions, not point estimates
4. **Pre-Mortem Analysis** - Identify failure modes upfront
5. **Brier Scoring** - All forecasts are scoreable

## Template Variables

Common variables across templates:
- `{COMPANY}`, `{TICKER}` - Company identifiers
- `{FISCAL_PERIOD}`, `{TARGET_DATE}` - Time horizons
- `{SECTOR}` - Industry classification
- `{METRIC}` - Target metric (revenue, market cap, etc.)
- `{DRIVER_N}` - Independent forecast drivers
- `{P10}`, `{P50}`, `{P90}` - Percentile values

## Contributing

When adding new templates:
1. Follow existing markdown structure
2. Include variable placeholders
3. Provide working examples
4. Document distribution types
5. Specify data sources
