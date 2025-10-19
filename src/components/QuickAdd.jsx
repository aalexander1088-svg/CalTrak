import React, { useState } from 'react';
import { Clock, Plus, X, Trash2 } from 'lucide-react';
import { getRecentMeals, addMeal, removeRecentMeal, getCurrentUser } from '../utils/storage';

const QuickAdd = ({ onMealAdded, onError }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const currentUser = getCurrentUser();
  const recentMeals = getRecentMeals(currentUser);

  const handleQuickAdd = async (meal) => {
    setIsAdding(true);
    try {
      // Create a new meal with current timestamp
      const newMeal = {
        name: meal.name,
        items: meal.items,
        totals: {
          calories: meal.totalCalories,
          protein: meal.totalProtein,
          carbs: meal.totalCarbs,
          fat: meal.totalFat
        }
      };

      const addedMeal = addMeal(currentUser, newMeal);
      onMealAdded(addedMeal);
      setShowQuickAdd(false);
    } catch (error) {
      onError('Failed to add meal');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveRecent = (mealId) => {
    removeRecentMeal(currentUser, mealId);
    // Force re-render by updating state
    setShowQuickAdd(false);
    setTimeout(() => setShowQuickAdd(true), 0);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const mealTime = new Date(timestamp);
    const diffInHours = Math.floor((now - mealTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (recentMeals.length === 0) {
    return null; // Don't show if no recent meals
  }

  return (
    <div className="mt-6">
      {!showQuickAdd ? (
        <button
          onClick={() => setShowQuickAdd(true)}
          className="w-full btn-secondary flex items-center justify-center"
        >
          <Clock className="w-5 h-5 mr-2" />
          Quick Add Recent Meal
        </button>
      ) : (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Quick Add Recent Meals
            </h3>
            <button
              onClick={() => setShowQuickAdd(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200">{meal.name}</h4>
                    <p className="text-sm text-slate-400">{formatTimeAgo(meal.timestamp)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuickAdd(meal)}
                      disabled={isAdding}
                      className="btn-primary text-sm py-1 px-3 flex items-center"
                    >
                      {isAdding ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                      ) : (
                        <Plus className="w-4 h-4 mr-1" />
                      )}
                      Add
                    </button>
                    <button
                      onClick={() => handleRemoveRecent(meal.id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                      title="Remove from recent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-slate-400">Calories</div>
                    <div className="font-medium text-slate-200">{meal.totalCalories}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Protein</div>
                    <div className="font-medium text-slate-200">{meal.totalProtein}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Carbs</div>
                    <div className="font-medium text-slate-200">{meal.totalCarbs}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Fat</div>
                    <div className="font-medium text-slate-200">{meal.totalFat}g</div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}: {meal.items.map(item => item.name).join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowQuickAdd(false)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAdd;
