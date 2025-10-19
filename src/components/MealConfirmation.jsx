import React, { useState } from 'react';
import { Check, X, Edit3, Plus, Minus, ArrowLeft, Loader } from 'lucide-react';
import { handleFollowUpQuestion } from '../utils/claude';

const MealConfirmation = ({ analysis, onConfirm, onCancel, onEditItem }) => {
  const [items, setItems] = useState(() => {
    // Initialize items with numericQuantity for calculations
    return (analysis.items || []).map(item => ({
      ...item,
      numericQuantity: 1 // Start with 1 serving
    }));
  });
  const [followUpQuestions, setFollowUpQuestions] = useState(analysis.followUpQuestions || []);
  const [isEditing, setIsEditing] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [isProcessingFollowUp, setIsProcessingFollowUp] = useState(false);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const adjustQuantity = (index, delta) => {
    const newItems = [...items];
    
    // Get current numeric quantity (stored separately)
    const currentQuantity = newItems[index].numericQuantity || 1;
    const newQuantity = Math.max(1, currentQuantity + delta);
    
    // Store the numeric quantity for calculations
    newItems[index].numericQuantity = newQuantity;
    
    // Keep the original quantity text for display (don't modify it)
    // The original quantity text stays as "1 cup" or "1 cup (245g)"
    const originalQuantityText = analysis.items[index].quantity;
    
    // Create simple display text
    const unit = originalQuantityText.replace(/^\d+\s*/, ''); // Extract "cup" from "1 cup"
    newItems[index].quantity = `${newQuantity} ${unit}${newQuantity > 1 ? 's' : ''}`;
    
    // Recalculate nutrition based on simple multiplier
    const multiplier = newQuantity; // Simple: 1 serving = original values, 2 servings = 2x values
    newItems[index].calories = Math.round(analysis.items[index].calories * multiplier);
    newItems[index].protein = Math.round(analysis.items[index].protein * multiplier * 10) / 10;
    newItems[index].carbs = Math.round(analysis.items[index].carbs * multiplier * 10) / 10;
    newItems[index].fat = Math.round(analysis.items[index].fat * multiplier * 10) / 10;
    
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotals = () => {
    return items.reduce((totals, item) => ({
      calories: totals.calories + (item.calories || 0),
      protein: totals.protein + (item.protein || 0),
      carbs: totals.carbs + (item.carbs || 0),
      fat: totals.fat + (item.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleConfirm = () => {
    const totals = calculateTotals();
    onConfirm({
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        assumptions: item.assumptions
      })),
      totals
    });
  };

  const handleAnswerFollowUp = async () => {
    if (followUpQuestions.length === 0) return;
    
    setIsProcessingFollowUp(true);
    try {
      // Combine all questions and answers into a single prompt
      const questionsAndAnswers = followUpQuestions.map((question, index) => {
        const answer = followUpAnswers[index] || '';
        return `Q: ${question}\nA: ${answer}`;
      }).join('\n\n');
      
      const updatedAnalysis = await handleFollowUpQuestion(questionsAndAnswers, '');
      
      // Update the items with the new analysis
      if (updatedAnalysis.items) {
        setItems(updatedAnalysis.items);
      }
      
      // Clear follow-up questions since they've been answered
      setFollowUpQuestions([]);
      setShowFollowUp(false);
      setFollowUpAnswers({});
      
    } catch (error) {
      console.error('Error processing follow-up:', error);
      // Continue with current items if follow-up fails
      setFollowUpQuestions([]);
      setShowFollowUp(false);
    } finally {
      setIsProcessingFollowUp(false);
    }
  };

  const handleSkipFollowUp = () => {
    setFollowUpQuestions([]);
    setShowFollowUp(false);
  };

  const totals = calculateTotals();

  return (
    <div className="card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-subheading">Confirm Your Meal</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

      {followUpQuestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-3">Follow-up Questions:</h3>
          <ul className="text-sm text-yellow-700 space-y-2 mb-6">
            {followUpQuestions.map((question, index) => (
              <li key={index}>• {question}</li>
            ))}
          </ul>
          {!showFollowUp ? (
            <button
              onClick={() => setShowFollowUp(true)}
              className="btn-primary text-sm py-2 px-4"
            >
              Answer Questions
            </button>
          ) : (
            <div className="space-y-4">
              {followUpQuestions.map((question, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-yellow-300 mb-2">
                    {question}
                  </label>
                  <input
                    type="text"
                    value={followUpAnswers[index] || ''}
                    onChange={(e) => setFollowUpAnswers(prev => ({
                      ...prev,
                      [index]: e.target.value
                    }))}
                    className="input-field"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSkipFollowUp}
                  className="flex-1 btn-secondary"
                >
                  Skip Questions
                </button>
                <button
                  onClick={handleAnswerFollowUp}
                  disabled={isProcessingFollowUp}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  {isProcessingFollowUp ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Update Analysis'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <div key={index} className="meal-item-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.quantity}</p>
                {item.assumptions && (
                  <p className="text-xs text-gray-500 italic">"{item.assumptions}"</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(isEditing === index ? null : index)}
                  className="text-[#4CAF50] hover:text-[#45A049] p-2 rounded-lg hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isEditing === index ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustQuantity(index, -1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => adjustQuantity(index, 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Calories:</span>
                    <span className="ml-2 font-medium">{item.calories}</span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Protein:</span>
                    <span className="ml-2 font-medium">{item.protein}g</span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Carbs:</span>
                    <span className="ml-2 font-medium">{item.carbs}g</span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Fat:</span>
                    <span className="ml-2 font-medium">{item.fat}g</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white rounded p-2">
                  <span className="text-gray-600">Calories:</span>
                  <span className="ml-2 font-medium">{item.calories}</span>
                </div>
                <div className="bg-white rounded p-2">
                  <span className="text-gray-600">Protein:</span>
                  <span className="ml-2 font-medium">{item.protein}g</span>
                </div>
                <div className="bg-white rounded p-2">
                  <span className="text-gray-600">Carbs:</span>
                  <span className="ml-2 font-medium">{item.carbs}g</span>
                </div>
                <div className="bg-white rounded p-2">
                  <span className="text-gray-600">Fat:</span>
                  <span className="ml-2 font-medium">{item.fat}g</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Meal Totals</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-700">Calories:</span>
              <span className="ml-2 font-bold text-blue-900">{totals.calories}</span>
            </div>
            <div>
              <span className="text-blue-700">Protein:</span>
              <span className="ml-2 font-bold text-blue-900">{totals.protein.toFixed(1)}g</span>
            </div>
            <div>
              <span className="text-blue-700">Carbs:</span>
              <span className="ml-2 font-bold text-blue-900">{totals.carbs.toFixed(1)}g</span>
            </div>
            <div>
              <span className="text-blue-700">Fat:</span>
              <span className="ml-2 font-bold text-blue-900">{totals.fat.toFixed(1)}g</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={items.length === 0}
          className="flex-1 btn-primary flex items-center justify-center"
        >
          <Check className="w-5 h-5 mr-2" />
          Confirm Meal
        </button>
      </div>
    </div>
  );
};

export default MealConfirmation;
