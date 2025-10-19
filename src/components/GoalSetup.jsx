import React, { useState } from 'react';
import { Target, Save, ArrowLeft } from 'lucide-react';

const GoalSetup = ({ username, onComplete }) => {
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  });
  const [trackedNutrients, setTrackedNutrients] = useState({
    calories: true,
    protein: true,
    carbs: true,
    fat: true
  });
  const [error, setError] = useState('');

  const handleGoalChange = (nutrient, value) => {
    const numValue = parseInt(value) || 0;
    setGoals(prev => ({
      ...prev,
      [nutrient]: numValue
    }));
  };

  const handleNutrientToggle = (nutrient) => {
    setTrackedNutrients(prev => ({
      ...prev,
      [nutrient]: !prev[nutrient]
    }));
  };

  const handleSave = () => {
    // Validate that at least calories are tracked
    if (!trackedNutrients.calories) {
      setError('Calories must be tracked');
      return;
    }

    // Validate that at least one goal is set
    const hasValidGoal = Object.entries(goals).some(([nutrient, value]) => 
      trackedNutrients[nutrient] && value > 0
    );

    if (!hasValidGoal) {
      setError('Please set at least one goal');
      return;
    }

    // Save goals to localStorage
    const goalData = {
      ...goals,
      trackedNutrients
    };
    
    localStorage.setItem(`caltrak_${username}_goals`, JSON.stringify(goalData));
    onComplete(goalData);
  };

  const nutrients = [
    { key: 'calories', label: 'Calories', unit: 'kcal', color: 'blue' },
    { key: 'protein', label: 'Protein', unit: 'g', color: 'green' },
    { key: 'carbs', label: 'Carbohydrates', unit: 'g', color: 'yellow' },
    { key: 'fat', label: 'Fat', unit: 'g', color: 'red' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Your Goals</h1>
          <p className="text-gray-600">Configure your daily nutrition targets</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {nutrients.map((nutrient) => (
            <div key={nutrient.key} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-4 h-4 bg-${nutrient.color}-500 rounded-full mr-3`}></div>
                  <span className="font-medium text-gray-900">{nutrient.label}</span>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={trackedNutrients[nutrient.key]}
                    onChange={() => handleNutrientToggle(nutrient.key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Track</span>
                </label>
              </div>
              
              {trackedNutrients[nutrient.key] && (
                <div className="flex items-center">
                  <input
                    type="number"
                    value={goals[nutrient.key]}
                    onChange={(e) => handleGoalChange(nutrient.key, e.target.value)}
                    className="flex-1 input-field mr-3"
                    min="0"
                    step="1"
                  />
                  <span className="text-sm text-gray-600">{nutrient.unit}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex space-x-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 btn-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <button
            onClick={handleSave}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalSetup;
