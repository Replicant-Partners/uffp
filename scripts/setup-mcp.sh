#!/bin/bash
echo "🔌 Setting up MCP server..."

if command -v python3 &> /dev/null; then
    pip3 install uv
    echo "✅ MCP prerequisites installed"
else
    echo "⚠️  Python 3 not found"
fi
