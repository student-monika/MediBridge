import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Search, Package, Users, User, ClipboardList } from 'lucide-react';
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">MediBridge</h1>
                <span className="ml-4 px-2 sm:px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {userRole === 'donor' ? 'Donor' : 'Receiver'}
                </span>
              </div>

              {/* Navigation Links */}
              {userRole === 'donor' && (
                <nav className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <button
                    onClick={() => navigate('/add-donation')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium">Add Donation</span>
                  </button>
                  <button 
                    onClick={() => navigate('/my-donations')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <Package size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium">My Donations</span>
                  </button>
                </nav>
              )}

              {userRole === 'receiver' && (
                <nav className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <button 
                    onClick={() => navigate('/browse-supplies')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium">Browse Supplies</span>
                  </button>
                  <button 
                    onClick={() => navigate('/my-requests')}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <ClipboardList size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium">My Request</span>
                  </button>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Welcome Message */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Welcome to MediBridge {userRole === 'donor' ? 'Donor' : 'Receiver'} Dashboard
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
              {userRole === 'donor'
                ? 'Help others by donating your surplus medical supplies before they expire.'
                : 'Find the medical supplies your organization needs from generous donors.'}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Getting Started:</h3>
              <ul className="text-xs sm:text-sm text-blue-800 list-disc list-inside space-y-1">
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
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {userRole === 'donor' ? 'Donor Statistics' : 'Receiver Statistics'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userRole === 'receiver' ? (
                <>
                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Available Supplies</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">12</p>
                        <p className="text-xs text-gray-500 mt-1">Total donations available</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigate('/my-request')}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">My Requests</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">3</p>
                        <p className="text-xs text-gray-500 mt-1">Items I've requested</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                        <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Approved Requests</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">1</p>
                        <p className="text-xs text-gray-500 mt-1">Ready for pickup</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    onClick={() => navigate('/my-donations')}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">My Donations</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">5</p>
                        <p className="text-xs text-gray-500 mt-1">Items I've donated</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Requests</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">2</p>
                        <p className="text-xs text-gray-500 mt-1">Awaiting your approval</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                        <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">8</p>
                        <p className="text-xs text-gray-500 mt-1">Successfully donated</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
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