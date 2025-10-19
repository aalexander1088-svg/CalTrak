# CalTrak Setup Script for Windows
Write-Host "🍎 CalTrak Setup Script" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first:" -ForegroundColor Red
    Write-Host "   https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating template..." -ForegroundColor Yellow
    "VITE_ANTHROPIC_API_KEY=your_api_key_here" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔑 Please edit .env file and add your Anthropic API key:" -ForegroundColor Cyan
    Write-Host "   1. Visit https://console.anthropic.com/" -ForegroundColor White
    Write-Host "   2. Create an account and generate an API key" -ForegroundColor White
    Write-Host "   3. Replace 'your_api_key_here' with your actual API key" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Setup complete! To start the application:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more information, see README.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy tracking! 🎤" -ForegroundColor Green
