#!/bin/bash

echo "🍎 CalTrak Setup Script"
echo "======================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    echo "VITE_ANTHROPIC_API_KEY=your_api_key_here" > .env
    echo "✅ .env file created"
    echo ""
    echo "🔑 Please edit .env file and add your Anthropic API key:"
    echo "   1. Visit https://console.anthropic.com/"
    echo "   2. Create an account and generate an API key"
    echo "   3. Replace 'your_api_key_here' with your actual API key"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🚀 Setup complete! To start the application:"
echo "   npm run dev"
echo ""
echo "📖 For more information, see README.md"
echo ""
echo "Happy tracking! 🎤"
