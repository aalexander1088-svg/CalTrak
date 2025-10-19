// AI-powered goal recommendation utility
const GOAL_RECOMMENDATION_PROMPT = `You are a nutrition expert. Based on the user's information, provide personalized daily nutrition goals.

User Information:
- Gender: {gender}
- Weight: {weight} lbs
- Activity Level: {activityLevel}
- Primary Goal: {primaryGoal}
- Additional Notes: {additionalNotes}

Please provide recommendations in this exact JSON format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "reasoning": {
    "calories": "explanation for calorie target",
    "protein": "explanation for protein target (e.g., 1g per lb body weight for muscle gain)",
    "carbs": "explanation for carb target",
    "fat": "explanation for fat target"
  },
  "tips": ["tip1", "tip2", "tip3"]
}

Guidelines:
- For muscle gain: ~1g protein per lb body weight, slight calorie surplus
- For weight loss: moderate calorie deficit (300-500 below maintenance), adequate protein
- For maintenance: balanced macros, maintenance calories
- Consider activity level in calorie calculations
- Consider gender differences in metabolism and nutritional needs
- Provide practical, achievable targets`;

export const getGoalRecommendations = async (userInfo) => {
  try {
    const prompt = GOAL_RECOMMENDATION_PROMPT
      .replace('{gender}', userInfo.gender)
      .replace('{weight}', userInfo.weight)
      .replace('{activityLevel}', userInfo.activityLevel)
      .replace('{primaryGoal}', userInfo.primaryGoal)
      .replace('{additionalNotes}', userInfo.additionalNotes || 'None');

    const response = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 800,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    // Fallback recommendations based on basic rules
    const weight = parseInt(userInfo.weight) || 150;
    const activityLevel = userInfo.activityLevel || 'moderate';
    
    let baseCalories = weight * 15; // Base calculation
    if (activityLevel === 'low') baseCalories *= 0.9;
    if (activityLevel === 'high') baseCalories *= 1.2;
    
    let protein = weight; // 1g per lb
    let calories = baseCalories;
    
    if (userInfo.primaryGoal === 'muscle_gain') {
      calories = baseCalories + 300; // Surplus for muscle gain
    } else if (userInfo.primaryGoal === 'weight_loss') {
      calories = baseCalories - 400; // Deficit for weight loss
    }

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(calories * 0.4 / 4), // 40% of calories from carbs
      fat: Math.round(calories * 0.25 / 9), // 25% of calories from fat
      reasoning: {
        calories: `Based on your weight (${weight}lbs) and ${activityLevel} activity level`,
        protein: `${protein}g protein (1g per lb body weight) for muscle support`,
        carbs: 'Balanced carb intake for energy',
        fat: 'Essential fats for hormone production'
      },
      tips: [
        'Track your progress weekly',
        'Adjust goals based on results',
        'Stay consistent with your targets'
      ]
    };

  } catch (error) {
    console.error('Error getting goal recommendations:', error);
    throw new Error('Failed to get AI recommendations. Please set goals manually.');
  }
};
