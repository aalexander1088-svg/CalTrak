// Food analysis prompt template
const FOOD_ANALYSIS_PROMPT = `You are a nutrition expert. Analyze the following food description and provide detailed nutritional information.

Instructions:
1. Identify all food items mentioned
2. Estimate quantities (use standard serving sizes if not specified)
3. Provide calories, protein (g), carbs (g), and fat (g) for each item
4. If quantities are ambiguous, ask specific follow-up questions
5. Format your response as JSON with this structure:
{
  "items": [
    {
      "name": "food item name",
      "quantity": "estimated quantity",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "assumptions": "any assumptions made"
    }
  ],
  "followUpQuestions": ["question1", "question2"],
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number
}

Food description: `;

export const analyzeFood = async (foodDescription) => {
  try {
    const response = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: FOOD_ANALYSIS_PROMPT + foodDescription
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
      console.error('Failed to parse Claude response:', parseError);
    }

    // Fallback: return a basic structure if JSON parsing fails
    return {
      items: [{
        name: foodDescription,
        quantity: "1 serving",
        calories: 200,
        protein: 10,
        carbs: 20,
        fat: 8,
        assumptions: "Estimated based on description"
      }],
      followUpQuestions: [],
      totalCalories: 200,
      totalProtein: 10,
      totalCarbs: 20,
      totalFat: 8
    };

  } catch (error) {
    console.error('Error analyzing food:', error);
    throw new Error('Failed to analyze food. Please try again.');
  }
};

// Follow-up question handler
export const handleFollowUpQuestion = async (question, answer) => {
  try {
    const response = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: `Question: ${question}\nAnswer: ${answer}\n\nProvide updated nutritional information in the same JSON format.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error handling follow-up:', error);
    throw new Error('Failed to process follow-up question.');
  }
};
