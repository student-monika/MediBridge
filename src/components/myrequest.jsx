import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Loader, RefreshCw, AlertCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase'; // Adjust the import path to your Firebase config

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Replace with actual user ID from auth context
  // You can get this from Firebase Auth: const { currentUser } = useAuth();
  const currentUserId = 'receiver1'; // Replace with actual user ID

  const fetchRequests = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a query to get requests for the current user, ordered by request date (newest first)
      const requestsQuery = query(
        collection(db, 'requests'),
        where('receiverId', '==', currentUserId),
        orderBy('requestDate', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        requestsQuery,
        (querySnapshot) => {
          const requestsData = [];
          querySnapshot.forEach((doc) => {
            requestsData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          setRequests(requestsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching requests:', error);
          setError('Failed to load requests. Please check your connection and try again.');
          setLoading(false);
        }
      );

      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (err) {
      console.error('Error setting up requests listener:', err);
      setError('Failed to load requests. Please try again.');
      setLoading(false);
    }
  };

  const refreshRequests = () => {
    // Since we're using real-time listeners, this function is no longer needed
    // Data updates automatically from Firestore
    console.log('Data refreshes automatically with real-time listeners');
  };

  useEffect(() => {
    if (!currentUserId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const unsubscribe = fetchRequests();
    
    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUserId]);

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const browseSupplies = () => {
        window.location.href = '/supplies';
  };

  const cancelRequest = async (request) => {
    if (window.confirm(`Cancel request for ${request.supplyName}?`)) {
      try {
        const requestRef = doc(db, 'requests', request.id);
        await updateDoc(requestRef, {
          status: 'cancelled',
          cancelledDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        // The real-time listener will automatically update the UI
        alert(`Request for ${request.supplyName} cancelled`);
      } catch (error) {
        console.error('Error cancelling request:', error);
        alert('Failed to cancel request. Please try again.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryStyle = (category) => {
    const categoryColors = {
      'Medication': 'bg-purple-100 text-purple-800',
      'PPE': 'bg-yellow-100 text-yellow-800',
      'Medical Equipment': 'bg-green-100 text-green-800',
      'Supplies': 'bg-blue-100 text-blue-800',
      'Emergency': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle Firestore Timestamp objects
      if (dateString && typeof dateString === 'object' && dateString.toDate) {
        return dateString.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      // Handle your specific date format
      if (dateString.includes('at') && dateString.includes('UTC')) {
        const parts = dateString.split(' at ');
        const datePart = parts[0];
        return datePart;
      }
      
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle Firestore Timestamp objects
      if (dateString && typeof dateString === 'object' && dateString.toDate) {
        return dateString.toDate().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      if (dateString.includes('at') && dateString.includes('UTC')) {
        return dateString.replace('UTC+5:30', 'IST');
      }
      
      const dateObj = new Date(dateString);
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const getRequestStats = () => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status?.toLowerCase() === 'pending').length,
      approved: requests.filter(r => r.status?.toLowerCase() === 'approved').length,
      completed: requests.filter(r => r.status?.toLowerCase() === 'completed').length,
      rejected: requests.filter(r => r.status?.toLowerCase() === 'rejected').length,
      cancelled: requests.filter(r => r.status?.toLowerCase() === 'cancelled').length,
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading your requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchRequests}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={goToDashboard}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getRequestStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
              <p className="text-sm text-gray-600">Track your medical supply requests</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={goToDashboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={browseSupplies}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Supplies
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Clock className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any requests yet.</p>
            <button
              onClick={browseSupplies}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Available Supplies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${
                  !request.isRead ? 'border-l-blue-500 bg-blue-50' : 'border-l-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.supplyName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(request.category)}`}>
                            {request.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>From: <strong>{request.donorName}</strong></span>
                          <span>•</span>
                          <span>Quantity: <strong>{request.quantity} {request.unit}</strong></span>
                          <span>•</span>
                          <span>Location: <strong>{request.location}</strong></span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{request.requestMessage}</p>
                        
                        {/* Response Message */}
                        {request.responseMessage && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Response:</strong> {request.responseMessage}
                            </p>
                          </div>
                        )}
                        
                        {/* Dates */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Requested: {formatDateTime(request.requestDate)}</span>
                          {request.approvedDate && (
                            <>
                              <span>•</span>
                              <span>Approved: {formatDateTime(request.approvedDate)}</span>
                            </>
                          )}
                          {request.completionDate && (
                            <>
                              <span>•</span>
                              <span>Completed: {formatDateTime(request.completionDate)}</span>
                            </>
                          )}
                          {request.expiryDate && (
                            <>
                              <span>•</span>
                              <span>Expires: {formatDate(request.expiryDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(request.status)}`}></div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      {/* Action Button */}
                      {request.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => cancelRequest(request)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Priority Indicator */}
                  {request.priority && request.priority !== 'normal' && (
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : request.priority === 'medium'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.priority} priority
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}