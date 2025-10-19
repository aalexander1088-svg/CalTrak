import React, { useState } from 'react';
import { Check, X, Edit3, Plus, Minus } from 'lucide-react';

const MealConfirmation = ({ analysis, onConfirm, onCancel, onEditItem }) => {
  const [items, setItems] = useState(analysis.items || []);
  const [followUpQuestions, setFollowUpQuestions] = useState(analysis.followUpQuestions || []);
  const [isEditing, setIsEditing] = useState(null);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const adjustQuantity = (index, delta) => {
    const newItems = [...items];
    const currentQuantity = parseFloat(newItems[index].quantity) || 1;
    const newQuantity = Math.max(0.1, currentQuantity + delta);
    newItems[index].quantity = newQuantity.toString();
    
    // Recalculate nutrition based on quantity multiplier
    const multiplier = newQuantity / (parseFloat(analysis.items[index].quantity) || 1);
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

  const totals = calculateTotals();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Confirm Your Meal</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {followUpQuestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">Follow-up Questions:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {followUpQuestions.map((question, index) => (
              <li key={index}>• {question}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
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
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isEditing === index ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustQuantity(index, -0.1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => adjustQuantity(index, 0.1)}
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
