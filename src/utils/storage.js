// Data persistence utilities for localStorage
export const STORAGE_KEYS = {
  USERS: 'caltrak_users',
  CURRENT_USER: 'caltrak_current_user',
  GOALS: (username) => `caltrak_${username}_goals`,
  TODAY: (username) => `caltrak_${username}_today`,
  HISTORY: (username) => `caltrak_${username}_history`,
};

// User management functions
export const getUserList = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const addUser = (username) => {
  const users = getUserList();
  if (!users.includes(username)) {
    users.push(username);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

export const getCurrentUser = () => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (username) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
};

// Goals management
export const getUserGoals = (username) => {
  const goals = localStorage.getItem(STORAGE_KEYS.GOALS(username));
  return goals ? JSON.parse(goals) : null;
};

export const saveUserGoals = (username, goals) => {
  localStorage.setItem(STORAGE_KEYS.GOALS(username), JSON.stringify(goals));
};

// Today's data management
export const getTodayData = (username) => {
  const today = localStorage.getItem(STORAGE_KEYS.TODAY(username));
  const todayData = today ? JSON.parse(today) : null;
  
  // Check if it's a new day
  const todayDate = new Date().toISOString().split('T')[0];
  if (!todayData || todayData.date !== todayDate) {
    // Reset for new day
    const newTodayData = {
      date: todayDate,
      meals: [],
      totals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    };
    saveTodayData(username, newTodayData);
    return newTodayData;
  }
  
  return todayData;
};

export const saveTodayData = (username, todayData) => {
  localStorage.setItem(STORAGE_KEYS.TODAY(username), JSON.stringify(todayData));
};

// History management
export const getUserHistory = (username) => {
  const history = localStorage.getItem(STORAGE_KEYS.HISTORY(username));
  return history ? JSON.parse(history) : [];
};

export const addToHistory = (username, dayData) => {
  const history = getUserHistory(username);
  history.push(dayData);
  localStorage.setItem(STORAGE_KEYS.HISTORY(username), JSON.stringify(history));
};

// Meal management
export const addMeal = (username, meal) => {
  const todayData = getTodayData(username);
  const newMeal = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    items: meal.items,
    totals: meal.totals,
  };
  
  todayData.meals.push(newMeal);
  
  // Update totals
  todayData.totals.calories += meal.totals.calories;
  todayData.totals.protein += meal.totals.protein;
  todayData.totals.carbs += meal.totals.carbs;
  todayData.totals.fat += meal.totals.fat;
  
  saveTodayData(username, todayData);
  return newMeal;
};

export const removeMeal = (username, mealId) => {
  const todayData = getTodayData(username);
  const mealIndex = todayData.meals.findIndex(meal => meal.id === mealId);
  
  if (mealIndex !== -1) {
    const meal = todayData.meals[mealIndex];
    
    // Subtract from totals
    todayData.totals.calories -= meal.totals.calories;
    todayData.totals.protein -= meal.totals.protein;
    todayData.totals.carbs -= meal.totals.carbs;
    todayData.totals.fat -= meal.totals.fat;
    
    // Remove meal
    todayData.meals.splice(mealIndex, 1);
    
    saveTodayData(username, todayData);
    return true;
  }
  
  return false;
};

// Utility functions
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateProgress = (current, goal) => {
  if (goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

export const getProgressColor = (progress) => {
  if (progress >= 100) return 'bg-red-500';
  if (progress >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
};
