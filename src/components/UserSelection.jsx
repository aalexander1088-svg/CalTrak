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
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4 page-enter">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg hover-lift-glow">
            <img src="/logo.png" alt="CalTrak Logo" className="w-20 h-12 object-contain" />
          </div>
          <h1 className="text-serif-heading mb-3">CalTrak</h1>
          <p className="text-caption">Voice-based calorie tracking</p>
        </div>

        {users.length > 0 && (
          <div className="mb-8">
            <h2 className="text-subheading mb-6">Select User</h2>
            <div className="space-y-3">
              {users.map((username) => (
                <div
                  key={username}
                  className="group flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl hover-lift-glow border border-gray-100 cursor-pointer"
                  onClick={() => handleSelectUser(username)}
                >
                  <div className="flex items-center flex-1">
                    <User className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-semibold text-gray-800">{username}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={(e) => handleDeleteUser(username, e)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
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
            className="w-full btn-primary flex items-center justify-center hover-lift"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New User
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
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
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}
            </div>
            <div className="flex space-x-4">
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
