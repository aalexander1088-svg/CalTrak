import React from 'react';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { calculateProgress, getProgressColor, formatTime } from '../utils/storage';

const ProgressTracking = ({ goals, todayData, onDeleteMeal }) => {
  const nutrients = [
    { key: 'calories', label: 'Calories', unit: 'kcal', color: 'blue', icon: '🔥' },
    { key: 'protein', label: 'Protein', unit: 'g', color: 'green', icon: '💪' },
    { key: 'carbs', label: 'Carbs', unit: 'g', color: 'yellow', icon: '🍞' },
    { key: 'fat', label: 'Fat', unit: 'g', color: 'red', icon: '🥑' }
  ];

  const getProgressBarColor = (progress) => {
    if (progress >= 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 100) return 'text-red-600';
    if (progress >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Overview */}
      <div className="progress-card hover-lift-glow">
        <div className="flex items-center mb-6">
          <Target className="w-6 h-6 text-[#4CAF50] mr-3" />
          <h2 className="text-subheading">Today's Progress</h2>
        </div>
        
        <div className="space-y-4">
          {nutrients.map((nutrient) => {
            if (!goals.trackedNutrients[nutrient.key]) return null;
            
            const current = todayData.totals[nutrient.key] || 0;
            const goal = goals[nutrient.key] || 1;
            const progress = calculateProgress(current, goal);
            
            return (
              <div key={nutrient.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{nutrient.icon}</span>
                    <span className="text-body font-semibold">{nutrient.label}</span>
                  </div>
                  <div className={`font-semibold ${getProgressTextColor(progress)}`}>
                    {current.toFixed(nutrient.key === 'calories' ? 0 : 1)} / {goal} {nutrient.unit}
                  </div>
                </div>
                
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getProgressBarColor(progress)}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-right">
                  <span className={`text-sm font-medium ${getProgressTextColor(progress)}`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meal History */}
      <div className="progress-card hover-lift-glow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-[#4CAF50] mr-3" />
            <h2 className="text-subheading">Today's Meals</h2>
          </div>
          <span className="text-caption">
            {todayData.meals.length} meal{todayData.meals.length !== 1 ? 's' : ''}
          </span>
        </div>

        {todayData.meals.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No meals logged yet today</p>
            <p className="text-sm text-gray-400 mt-1">Start by adding your first meal!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayData.meals.map((meal, index) => (
              <div key={meal.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Meal #{index + 1}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTime(meal.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {meal.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-500">{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Calories:</span>
                    <span className="ml-1 font-medium">{meal.totals.calories}</span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Protein:</span>
                    <span className="ml-1 font-medium">{meal.totals.protein.toFixed(1)}g</span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Carbs:</span>
                    <span className="ml-1 font-medium">{meal.totals.carbs.toFixed(1)}g</span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Fat:</span>
                    <span className="ml-1 font-medium">{meal.totals.fat.toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracking;
