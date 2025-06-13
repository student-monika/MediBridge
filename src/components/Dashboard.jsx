import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Search, Package, Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

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
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">MediBridge</h1>
                <span className="ml-4 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {userRole === 'donor' ? 'Donor' : 'Receiver'}
                </span>
              </div>

              {/* Navigation Links */}
              {userRole === 'donor' && (
                <nav className="flex items-center space-x-6">
                  <button
                    onClick={() => navigate('/add-donation')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span className="font-medium">Add Donation</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <Package size={18} />
                    <span className="font-medium">My Donations</span>
                  </button>
                </nav>
              )}

              {userRole === 'receiver' && (
                <nav className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <Search size={18} />
                    <span className="font-medium">Browse Supplies</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <Users size={18} />
                    <span className="font-medium">My Requests</span>
                  </button>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
              </div>

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
          {/* Welcome Message */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to MediBridge {userRole === 'donor' ? 'Donor' : 'Receiver'} Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              {userRole === 'donor'
                ? 'Help others by donating your surplus medical supplies before they expire.'
                : 'Find the medical supplies your organization needs from generous donors.'}
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

          {/* Dashboard Stats */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userRole === 'donor' ? 'Donor Statistics' : 'Receiver Statistics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRole === 'receiver' ? (
                <>
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Available Supplies</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                        <p className="text-xs text-gray-500 mt-1">Total donations available</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Package className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">My Requests</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                        <p className="text-xs text-gray-500 mt-1">Items I've requested</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">My Donations</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                        <p className="text-xs text-gray-500 mt-1">Items I've donated</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Package className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
