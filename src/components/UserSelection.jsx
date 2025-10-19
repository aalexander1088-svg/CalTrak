import React, { useState } from 'react';
import { User, Plus, LogIn, Trash2 } from 'lucide-react';
import { getUserList, addUser, setCurrentUser, deleteUser } from '../utils/storage';
import DeleteUserDialog from './DeleteUserDialog';

const UserSelection = ({ onUserSelect }) => {
  const [users, setUsers] = useState(getUserList());
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleSelectUser = (username) => {
    setCurrentUser(username);
    onUserSelect(username);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    if (users.includes(newUsername.trim())) {
      setError('Username already exists');
      return;
    }

    const username = newUsername.trim();
    addUser(username);
    setUsers(getUserList());
    setNewUsername('');
    setShowNewUserForm(false);
    setError('');
    
    // Auto-select the new user
    handleSelectUser(username);
  };

  const handleDeleteUser = (username, e) => {
    e.stopPropagation(); // Prevent user selection
    setUserToDelete(username);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUsers(getUserList());
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">CalTrak</h1>
          <p className="text-gray-600">Voice-based calorie tracking</p>
        </div>

        {users.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User</h2>
            <div className="space-y-2">
              {users.map((username) => (
                <div
                  key={username}
                  className="group flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
                >
                  <button
                    onClick={() => handleSelectUser(username)}
                    className="flex items-center flex-1"
                  >
                    <User className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="font-medium text-slate-200">{username}</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSelectUser(username)}
                      className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Login"
                    >
                      <LogIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteUser(username, e)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showNewUserForm ? (
          <button
            onClick={() => setShowNewUserForm(true)}
            className="w-full btn-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New User
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewUserForm(false);
                  setNewUsername('');
                  setError('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                Create User
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Delete User Dialog */}
      {showDeleteDialog && (
        <DeleteUserDialog
          username={userToDelete}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};

export default UserSelection;
