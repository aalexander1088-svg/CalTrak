import React, { useState } from 'react';
import { Target, Save, ArrowLeft, Sparkles, Loader } from 'lucide-react';
import { getGoalRecommendations } from '../utils/goalRecommendations';

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
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);
  const [userInfo, setUserInfo] = useState({
    gender: 'male',
    weight: '',
    activityLevel: 'moderate',
    primaryGoal: 'maintenance',
    additionalNotes: ''
  });
  const [aiRecommendations, setAiRecommendations] = useState(null);

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

  const handleGetAIRecommendations = async () => {
    if (!userInfo.weight || userInfo.weight < 50 || userInfo.weight > 500) {
      setError('Please enter a valid weight (50-500 lbs)');
      return;
    }

    setIsGettingRecommendations(true);
    setError('');

    try {
      const recommendations = await getGoalRecommendations(userInfo);
      setAiRecommendations(recommendations);
      
      // Apply recommendations to goals
      setGoals({
        calories: recommendations.calories,
        protein: recommendations.protein,
        carbs: recommendations.carbs,
        fat: recommendations.fat
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGettingRecommendations(false);
    }
  };

  const handleApplyRecommendations = () => {
    if (aiRecommendations) {
      setGoals({
        calories: aiRecommendations.calories,
        protein: aiRecommendations.protein,
        carbs: aiRecommendations.carbs,
        fat: aiRecommendations.fat
      });
      setShowAIRecommendation(false);
    }
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
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4 page-enter">
      <div className="card max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover-lift-glow">
            <img src="/logo.png" alt="CalTrak Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-serif-heading mb-3">Set Your Goals</h1>
          <p className="text-caption">Configure your daily nutrition targets</p>
        </div>

        {/* AI Recommendation Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#F0F9F0] rounded-2xl p-6 border border-[#4CAF50]/20">
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-[#4CAF50] mr-2" />
              <h2 className="text-subheading">Get AI-Powered Recommendations</h2>
            </div>
            <p className="text-body mb-6">
              Tell us about yourself and we'll recommend personalized nutrition goals based on your objectives.
            </p>
            
            {!showAIRecommendation ? (
              <button
                onClick={() => setShowAIRecommendation(true)}
                className="btn-primary flex items-center justify-center w-full"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI Recommendations
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gender
                  </label>
                  <select
                    value={userInfo.gender}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, gender: e.target.value }))}
                    className="input-field"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={userInfo.weight}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, weight: e.target.value }))}
                      className="input-field"
                      placeholder="150"
                      min="50"
                      max="500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Activity Level
                    </label>
                    <select
                      value={userInfo.activityLevel}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, activityLevel: e.target.value }))}
                      className="input-field"
                    >
                      <option value="low">Low (desk job, minimal exercise)</option>
                      <option value="moderate">Moderate (light exercise 1-3x/week)</option>
                      <option value="high">High (intense exercise 4+ times/week)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Primary Goal
                  </label>
                  <select
                    value={userInfo.primaryGoal}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, primaryGoal: e.target.value }))}
                    className="input-field"
                  >
                    <option value="muscle_gain">Build Muscle & Gain Weight</option>
                    <option value="weight_loss">Lose Weight & Fat</option>
                    <option value="maintenance">Maintain Current Weight</option>
                    <option value="performance">Improve Athletic Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={userInfo.additionalNotes}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    className="input-field"
                    rows="2"
                    placeholder="e.g., I'm vegetarian, I have dietary restrictions, I train for marathons..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAIRecommendation(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGetAIRecommendations}
                    disabled={isGettingRecommendations}
                    className="flex-1 btn-primary flex items-center justify-center"
                  >
                    {isGettingRecommendations ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Getting Recommendations...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get Recommendations
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* AI Recommendations Display */}
            {aiRecommendations && (
              <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded p-3">
                    <div className="text-sm text-blue-700">Calories</div>
                    <div className="font-bold text-blue-900">{aiRecommendations.calories}</div>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <div className="text-sm text-green-700">Protein</div>
                    <div className="font-bold text-green-900">{aiRecommendations.protein}g</div>
                  </div>
                  <div className="bg-yellow-50 rounded p-3">
                    <div className="text-sm text-yellow-700">Carbs</div>
                    <div className="font-bold text-yellow-900">{aiRecommendations.carbs}g</div>
                  </div>
                  <div className="bg-red-50 rounded p-3">
                    <div className="text-sm text-red-700">Fat</div>
                    <div className="font-bold text-red-900">{aiRecommendations.fat}g</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Reasoning:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• {aiRecommendations.reasoning.calories}</li>
                    <li>• {aiRecommendations.reasoning.protein}</li>
                    <li>• {aiRecommendations.reasoning.carbs}</li>
                    <li>• {aiRecommendations.reasoning.fat}</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <strong>Tips:</strong>
                  <ul className="mt-1 space-y-1">
                    {aiRecommendations.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setAiRecommendations(null)}
                    className="flex-1 btn-secondary"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleApplyRecommendations}
                    className="flex-1 btn-primary"
                  >
                    Use These Goals
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <h2 className="text-subheading mb-6">Daily Targets</h2>
        <div className="space-y-4 mb-8">
          {nutrients.map((nutrient) => (
            <div key={nutrient.key} className="goal-card hover-lift-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={trackedNutrients[nutrient.key]}
                    onChange={() => handleNutrientToggle(nutrient.key)}
                    className="w-5 h-5 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50] mr-3"
                  />
                  <label className="text-body font-semibold">{nutrient.label}</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={goals[nutrient.key]}
                    onChange={(e) => handleGoalChange(nutrient.key, e.target.value)}
                    className="input-field w-24 text-right mr-3"
                    disabled={!trackedNutrients[nutrient.key]}
                    min="0"
                  />
                  <span className="text-caption">{nutrient.unit}</span>
                </div>
              </div>
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
