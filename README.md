# CalTrak - Voice-Based Calorie Tracking App

A modern, voice-powered calorie tracking web application built with React, Vite, and Tailwind CSS. CalTrak uses the Web Speech API for voice input and Claude AI for intelligent food analysis.

## Features

### 🎤 Voice Input
- **Tap-to-talk interface** for hands-free meal logging
- **Real-time speech-to-text** with live transcript display
- **Browser compatibility** with fallback to text input
- **Clear audio feedback** and error handling

### 🤖 AI Food Analysis
- **Claude AI integration** for intelligent food parsing
- **Automatic nutrition calculation** for calories, protein, carbs, and fat
- **Smart quantity estimation** with follow-up questions
- **Editable assumptions** with manual adjustments

### 👥 Multi-User Support
- **Local user management** with separate data storage
- **Quick user switching** without losing progress
- **Individual goal settings** per user
- **Persistent data** across browser sessions

### 📊 Progress Tracking
- **Visual progress bars** with color-coded indicators
- **Real-time goal tracking** for all nutrients
- **Meal history** with timestamps and details
- **Achievement celebrations** with confetti animations

### 🎯 Goal Management
- **Customizable daily targets** for calories and macros
- **Selective nutrient tracking** (toggle on/off)
- **Progress visualization** with percentage completion
- **Goal achievement notifications**

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Voice Input**: Web Speech API
- **AI Analysis**: Claude API (Anthropic)
- **Data Storage**: localStorage
- **Animations**: React Confetti
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd caltrak
npm install
```

### 2. Configure API Key
1. The `.env` file should already exist. Edit it and add your API key:
```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

2. Replace `your_anthropic_api_key_here` with your actual API key from Anthropic Console

### 3. Get Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account and generate an API key
3. Add the key to your `.env` file

### 4. Run the Application
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage Guide

### First Time Setup
1. **Create User**: Enter a username to create your profile
2. **Set Goals**: Configure daily targets for calories and macros
3. **Choose Nutrients**: Toggle which nutrients to track

### Logging Meals
1. **Tap to Talk**: Click the microphone button
2. **Describe Food**: Speak clearly about what you ate
3. **Review Analysis**: Check AI's food identification and nutrition
4. **Edit if Needed**: Adjust quantities or remove items
5. **Confirm Meal**: Add to your daily log

### Managing Progress
- **View Progress**: See real-time progress bars for each nutrient
- **Meal History**: Review all logged meals with timestamps
- **Delete Meals**: Remove incorrect entries
- **Undo Actions**: Restore accidentally deleted meals

### User Management
- **Switch Users**: Access different user profiles
- **Update Goals**: Modify daily targets anytime
- **Logout**: Return to user selection screen

## Browser Compatibility

### Voice Input Support
- ✅ **Chrome** (recommended)
- ✅ **Safari** (iOS/macOS)
- ✅ **Edge** (Chromium-based)
- ❌ **Firefox** (limited support)

### Fallback Options
- **Text Input**: Manual typing when voice isn't available
- **Mobile Responsive**: Touch-friendly interface
- **Offline Storage**: Data persists without internet

## Data Structure

### LocalStorage Keys
- `caltrak_users`: Array of usernames
- `caltrak_current_user`: Active username
- `caltrak_{username}_goals`: User's daily goals
- `caltrak_{username}_today`: Today's meal data
- `caltrak_{username}_history`: Historical data

### Data Format
```javascript
// Goals
{
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  trackedNutrients: {
    calories: true,
    protein: true,
    carbs: true,
    fat: true
  }
}

// Meal Entry
{
  id: "timestamp",
  timestamp: "2025-01-19T10:30:00.000Z",
  items: [
    {
      name: "Scrambled Eggs",
      quantity: "2 large",
      calories: 180,
      protein: 12,
      carbs: 1,
      fat: 14,
      assumptions: "Cooked with butter"
    }
  ],
  totals: {
    calories: 180,
    protein: 12,
    carbs: 1,
    fat: 14
  }
}
```

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── UserSelection.jsx
│   ├── GoalSetup.jsx
│   ├── VoiceInput.jsx
│   ├── MealConfirmation.jsx
│   ├── ProgressTracking.jsx
│   └── Dashboard.jsx
├── utils/              # Utility functions
│   ├── storage.js      # localStorage management
│   ├── claude.js       # AI integration
│   └── voice.js        # Speech API utilities
├── App.jsx             # Main app component
├── main.jsx           # React entry point
└── index.css          # Global styles
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Environment Variables
- `VITE_ANTHROPIC_API_KEY`: Required for AI food analysis

## Troubleshooting

### Common Issues

**Voice Input Not Working**
- Ensure you're using Chrome, Safari, or Edge
- Check microphone permissions
- Try refreshing the page

**API Errors**
- Verify your Anthropic API key is correct
- Check your internet connection
- Ensure you have API credits available

**Data Not Persisting**
- Check if localStorage is enabled
- Clear browser cache and try again
- Ensure you're not in incognito mode

**Performance Issues**
- Close other browser tabs
- Clear browser cache
- Restart the development server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser compatibility
3. Ensure all dependencies are installed
4. Verify API key configuration

---

**CalTrak** - Making calorie tracking as easy as talking about your food! 🎤🍎
