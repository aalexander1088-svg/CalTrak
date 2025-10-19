import React, { useState, useEffect } from 'react';
import UserSelection from './components/UserSelection';
import GoalSetup from './components/GoalSetup';
import Dashboard from './components/Dashboard';
import { getCurrentUser, getUserGoals } from './utils/storage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showGoalSetup, setShowGoalSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a current user on app load
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Check if user has goals set up
      const goals = getUserGoals(user);
      if (!goals) {
        setShowGoalSetup(true);
      }
    }
    setIsLoading(false);
  }, []);

  const handleUserSelect = (username) => {
    setCurrentUser(username);
    // Check if user has goals set up
    const goals = getUserGoals(username);
    if (!goals) {
      setShowGoalSetup(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowGoalSetup(false);
  };

  const handleGoalSetupComplete = (goals) => {
    setShowGoalSetup(false);
    // Goals are already saved in the GoalSetup component
  };

  const handleSettings = () => {
    setShowGoalSetup(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading CalTrak...</p>
        </div>
      </div>
    );
  }

  // Show user selection if no user is logged in
  if (!currentUser) {
    return <UserSelection onUserSelect={handleUserSelect} />;
  }

  // Show goal setup if user needs to configure goals
  if (showGoalSetup) {
    return (
      <GoalSetup
        username={currentUser}
        onComplete={handleGoalSetupComplete}
      />
    );
  }

  // Show main dashboard
  return (
    <Dashboard
      username={currentUser}
      onLogout={handleLogout}
      onSettings={handleSettings}
    />
  );
}

export default App;
