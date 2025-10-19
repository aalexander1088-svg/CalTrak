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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-subheading flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#4CAF50]" />
              Quick Add Recent Meals
            </h3>
            <button
              onClick={() => setShowQuickAdd(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover-lift-glow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                    <p className="text-sm text-gray-500">{formatTimeAgo(meal.timestamp)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuickAdd(meal)}
                      disabled={isAdding}
                      className="btn-primary text-sm py-2 px-4 flex items-center hover-lift"
                    >
                      {isAdding ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spin mr-1"></div>
                      ) : (
                        <Plus className="w-4 h-4 mr-1" />
                      )}
                      Add
                    </button>
                    <button
                      onClick={() => handleRemoveRecent(meal.id)}
                      className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Remove from recent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Calories</div>
                    <div className="font-semibold text-gray-800">{meal.totalCalories}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Protein</div>
                    <div className="font-semibold text-gray-800">{meal.totalProtein}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Carbs</div>
                    <div className="font-semibold text-gray-800">{meal.totalCarbs}g</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Fat</div>
                    <div className="font-semibold text-gray-800">{meal.totalFat}g</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200">
                  <span className="font-medium">{meal.items.length} item{meal.items.length !== 1 ? 's' : ''}:</span> {meal.items.map(item => item.name).join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowQuickAdd(false)}
              className="btn-secondary text-sm py-2 px-6 hover-lift"
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
