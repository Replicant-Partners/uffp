#!/bin/bash
echo "🚀 Setting up Forecast Intelligence Platform..."

# Check Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required"
    exit 1
fi

# Install dependencies
npm install

# Build packages
npm run build

# Create .env
if [ ! -f .env ]; then
    cat > .env << 'ENVEOF'
ALPHAVANTAGE_API_KEY=
ANTHROPIC_API_KEY=
ENVEOF
    echo "✅ Created .env file (add your API keys)"
fi

echo "✨ Setup complete!"
