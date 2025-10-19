import React, { useState, useEffect } from 'react';
import { LogOut, Settings, Plus, Undo2 } from 'lucide-react';
import Confetti from 'react-confetti';
import VoiceInput from './VoiceInput';
import MealConfirmation from './MealConfirmation';
import ProgressTracking from './ProgressTracking';
import QuickAdd from './QuickAdd';
import { 
  getUserGoals, 
  getTodayData, 
  addMeal, 
  removeMeal, 
  setCurrentUser,
  calculateProgress 
} from '../utils/storage';

const Dashboard = ({ username, onLogout, onSettings }) => {
  const [goals, setGoals] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [mealAnalysis, setMealAnalysis] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastDeletedMeal, setLastDeletedMeal] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, [username]);

  const loadUserData = () => {
    const userGoals = getUserGoals(username);
    const userTodayData = getTodayData(username);
    
    if (!userGoals) {
      onSettings();
      return;
    }
    
    setGoals(userGoals);
    setTodayData(userTodayData);
  };

  const handleMealAnalyzed = (analysis) => {
    setMealAnalysis(analysis);
    setShowVoiceInput(false);
  };

  const handleMealAdded = (meal) => {
    setTodayData(getTodayData(username));
    setMealAnalysis(null);
    
    // Check if any goals were achieved
    checkGoalAchievement();
    
    // Show success animation
    setTimeout(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 100);
  };

  const handleMealConfirmed = (mealData) => {
    try {
      const newMeal = addMeal(username, mealData);
      setTodayData(getTodayData(username));
      setMealAnalysis(null);
      
      // Check if any goals were achieved
      checkGoalAchievement();
      
      // Show success animation
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }, 100);
      
    } catch (err) {
      setError('Failed to save meal. Please try again.');
    }
  };

  const handleMealCancelled = () => {
    setMealAnalysis(null);
    setShowVoiceInput(true);
  };

  const handleDeleteMeal = (mealId) => {
    const meal = todayData.meals.find(m => m.id === mealId);
    if (meal) {
      setLastDeletedMeal(meal);
      removeMeal(username, mealId);
      setTodayData(getTodayData(username));
    }
  };

  const handleUndoLastEntry = () => {
    if (lastDeletedMeal) {
      addMeal(username, lastDeletedMeal);
      setTodayData(getTodayData(username));
      setLastDeletedMeal(null);
    }
  };

  const checkGoalAchievement = () => {
    if (!goals || !todayData) return;
    
    // Check if calories goal is met (most important)
    if (goals.trackedNutrients.calories) {
      const caloriesProgress = calculateProgress(todayData.totals.calories, goals.calories);
      if (caloriesProgress >= 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onLogout();
  };

  if (!goals || !todayData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] page-enter">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
          initialVelocityY={20}
        />
      )}
      
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {username}!</h1>
            <p className="text-sm text-gray-600 mt-1">Track your nutrition goals today</p>
          </div>
          <div className="flex items-center space-x-3">
            {lastDeletedMeal && (
              <button
                onClick={handleUndoLastEntry}
                className="btn-secondary flex items-center"
              >
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
              </button>
            )}
            <button
              onClick={onSettings}
              className="btn-secondary flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Voice Input */}
          <div className="lg:col-span-1">
            {showVoiceInput ? (
              <VoiceInput
                onMealAnalyzed={handleMealAnalyzed}
                onError={setError}
              />
            ) : mealAnalysis ? (
              <MealConfirmation
                analysis={mealAnalysis}
                onConfirm={handleMealConfirmed}
                onCancel={handleMealCancelled}
              />
            ) : (
              <div className="card text-center hover-lift-glow">
                <div className="w-24 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg hover-lift-glow">
                  <img src="/logo.png" alt="CalTrak Logo" className="w-20 h-12 object-contain" />
                </div>
                <h3 className="text-subheading mb-3">Add a Meal</h3>
                <p className="text-body mb-6">
                  Use voice input to quickly log your meals and snacks
                </p>
                <button
                  onClick={() => setShowVoiceInput(true)}
                  className="btn-primary w-full mb-4 hover-lift"
                >
                  Start Voice Input
                </button>
                <QuickAdd 
                  onMealAdded={handleMealAdded}
                  onError={setError}
                />
              </div>
            )}
          </div>

          {/* Progress Tracking */}
          <div className="lg:col-span-1">
            <ProgressTracking
              goals={goals}
              todayData={todayData}
              onDeleteMeal={handleDeleteMeal}
            />
          </div>
        </div>

        {/* Goal Achievement Message */}
        {goals.trackedNutrients.calories && 
         calculateProgress(todayData.totals.calories, goals.calories) >= 100 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Goal Achieved!</h3>
            <p className="text-green-700">
              Congratulations! You've reached your daily calorie goal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
