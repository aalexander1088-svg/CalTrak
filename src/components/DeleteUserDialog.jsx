import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteUserDialog = ({ username, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-200">Delete User</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-300 mb-4">
            Are you sure you want to delete <strong className="text-slate-200">{username}</strong>?
          </p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-400 mb-2">This will permanently delete:</h3>
            <ul className="text-sm text-red-300 space-y-1">
              <li>• User profile and settings</li>
              <li>• All meal history and data</li>
              <li>• Progress tracking records</li>
              <li>• Nutrition goals and preferences</li>
            </ul>
          </div>

          <p className="text-sm text-slate-400">
            <strong>Warning:</strong> This action cannot be undone. All data for this user will be lost forever.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserDialog;
