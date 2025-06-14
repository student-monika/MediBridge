import React, { useState, useEffect } from 'react';
import { suppliesService } from '../services/firebase'; // Import the service

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock user data - should come from auth context in real app
  const currentUser = {
    id: 'user123', // This should match the donorId used in AddDonation
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@cityhospital.com'
  };

  // Fetch donations on component mount
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        console.log('Fetching donations for user:', currentUser.id); // Debug log
        
        // Check if suppliesService and the method exist
        if (!suppliesService || !suppliesService.getDonorSupplies) {
          throw new Error('suppliesService.getDonorSupplies is not available');
        }
        
        // Use the new getDonorSupplies function to get ALL user donations regardless of status
        const userDonations = await suppliesService.getDonorSupplies(currentUser.id);
        
        console.log('Fetched donations:', userDonations); // Debug log
        
        // Ensure userDonations is an array
        if (!Array.isArray(userDonations)) {
          console.warn('userDonations is not an array:', userDonations);
          setDonations([]);
        } else {
          setDonations(userDonations);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          code: error.code
        });
        setError(`Failed to load donations: ${error.message}`);
        setDonations([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();

    // Set up real-time listener for the current user's donations
    let unsubscribe = null;
    
    try {
      // Check if the real-time listener method exists
      if (suppliesService && suppliesService.onDonorSuppliesChange) {
        unsubscribe = suppliesService.onDonorSuppliesChange(currentUser.id, (userDonations) => {
          console.log('Real-time update received:', userDonations); // Debug log
          
          if (Array.isArray(userDonations)) {
            setDonations(userDonations);
          } else {
            console.warn('Real-time userDonations is not an array:', userDonations);
            setDonations([]);
          }
          setLoading(false);
        });
      } else {
        console.warn('Real-time listener not available');
      }
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
    }

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser.id]);

  const addDonation = () => {
    window.location.href = '/add-donation';
  };

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const acceptRequest = async (donation) => {
    if (window.confirm(`Accept request for ${donation.itemName}?`)) {
      try {
        await suppliesService.updateSupplyStatus(donation.id, 'accepted');
        alert(`Request accepted for ${donation.itemName}!`);
      } catch (error) {
        console.error('Error accepting request:', error);
        alert('Failed to accept request. Please try again.');
      }
    }
  };

  const editItem = (itemName) => {
    alert(`Edit functionality for ${itemName} - To be implemented`);
  };

  const deleteItem = async (donation) => {
    if (window.confirm(`Delete ${donation.itemName}?`)) {
      try {
        await suppliesService.deleteSupply(donation.id);
        alert(`${donation.itemName} deleted successfully`);
      } catch (error) {
        console.error('Error deleting donation:', error);
        alert('Failed to delete donation. Please try again.');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'collected':
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'requested':
        return 'bg-yellow-500';
      case 'collected':
      case 'accepted':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'PPE':
        return 'bg-yellow-100 text-yellow-800';
      case 'Medical Equipment':
      case 'Medical Devices':
        return 'bg-blue-100 text-blue-800';
      case 'Medication':
        return 'bg-purple-100 text-purple-800';
      case 'Surgical Supplies':
        return 'bg-green-100 text-green-800';
      case 'Diagnostic Equipment':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
      // If it's a date string (YYYY-MM-DD), format it nicely
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    if (date.toDate) {
      // If it's a Firestore timestamp
      return date.toDate().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    return 'N/A';
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'requested':
        return 'Requested';
      case 'accepted':
        return 'Accepted';
      case 'collected':
        return 'Collected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button 
              onClick={() => {
                setError('');
                setLoading(true);
                // Retry the fetch manually
                const retryFetch = async () => {
                  try {
                    const userDonations = await suppliesService.getDonorSupplies(currentUser.id);
                    setDonations(Array.isArray(userDonations) ? userDonations : []);
                  } catch (error) {
                    setError(`Failed to load donations: ${error.message}`);
                  } finally {
                    setLoading(false);
                  }
                };
                retryFetch();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
            MediBridge
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={goToDashboard}
              className="text-gray-700 hover:text-blue-600 px-2 py-2 sm:px-3 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={addDonation}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1 sm:gap-2 text-sm"
            >
              <span>+</span>
              <span className="hidden sm:inline">Add Donation</span>
              <span className="sm:hidden">Add</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-2 sm:px-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="hidden sm:inline text-gray-700 font-medium text-sm">{currentUser.name}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-white text-gray-900 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">My Donations</h1>
            <p className="text-gray-500 text-sm">Track and manage your donated medical supplies</p>
          </div>
          <div className="bg-gray-50 border border-gray-300 px-4 py-3 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Total Donations</div>
            <div className="text-xl font-bold text-gray-800">{donations.length}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {donations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600 mb-6">Start helping others by donating your surplus medical supplies.</p>
            <button 
              onClick={addDonation}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Donation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-200 min-h-80 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{donation.itemName}</h3>
                    <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium ${getCategoryStyle(donation.category)}`}>
                      {donation.category}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      className="w-8 h-8 sm:w-7 sm:h-7 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-sm transition-colors"
                      onClick={() => editItem(donation.itemName)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="w-8 h-8 sm:w-7 sm:h-7 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center text-sm transition-colors"
                      onClick={() => deleteItem(donation)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-medium">Quantity:</span>
                    <span className="text-gray-900 font-semibold text-sm">{donation.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-medium">Expiry Date:</span>
                    <span className="text-gray-900 font-semibold text-sm">{formatDate(donation.expiryDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-medium">Location:</span>
                    <span className="text-gray-900 font-semibold text-sm">{donation.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-medium">Status:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusDot(donation.status)}`}></div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(donation.status)}`}>
                        {getStatusDisplayText(donation.status)}
                      </span>
                    </div>
                  </div>
                  {donation.notes && (
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm font-medium">Notes:</span>
                      <p className="text-gray-700 text-sm mt-1 break-words">{donation.notes}</p>
                    </div>
                  )}
                </div>

                {donation.status === 'requested' && (
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <button
                      onClick={() => acceptRequest(donation)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Accept Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}