import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Search, Package, Users } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, userRole, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MediBridge</h1>
              <span className="ml-4 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {userRole === 'donor' ? 'Donor' : 'Receiver'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {currentUser?.displayName || currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Actions */}
            {userRole === 'donor' ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Plus className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Add Donation</h3>
                      <p className="text-sm text-gray-500">List surplus medical supplies</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">My Donations</h3>
                      <p className="text-sm text-gray-500">View and manage your listings</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Search className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Browse Supplies</h3>
                      <p className="text-sm text-gray-500">Find medical supplies you need</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">My Requests</h3>
                      <p className="text-sm text-gray-500">Track your supply requests</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Welcome Message */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to MediBridge Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              {userRole === 'donor' 
                ? "Help others by donating your surplus medical supplies before they expire."
                : "Find the medical supplies your organization needs from generous donors."
              }
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-900">Getting Started:</h3>
              <ul className="mt-2 text-sm text-blue-800 list-disc list-inside">
                {userRole === 'donor' ? (
                  <>
                    <li>Click "Add Donation" to list your surplus supplies</li>
                    <li>Include expiry dates, quantities, and your location</li>
                    <li>Review and approve requests from receivers</li>
                  </>
                ) : (
                  <>
                    <li>Browse available supplies using the search filters</li>
                    <li>Request items that match your needs</li>
                    <li>Wait for donor approval and contact information</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}