import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Loader, AlertCircle, Mail, Phone, MapPin, ClipboardList, Package, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 
import { requestsService } from '../services/firebase'; 

export default function MyRequestsPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donorContactMap, setDonorContactMap] = useState({}); 
  const [activeTab, setActiveTab] = useState('all');
  
  const currentUserId = currentUser?.uid;

  // Derive receiver info for the navbar
  const currentReceiver = currentUser ? {
    id: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email
  } : null;

  // 1. Fetch Requests for the Receiver
  useEffect(() => {
    if (currentUser === undefined) return; 

    if (!currentUserId) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = requestsService.onReceiverRequestsChange(currentUserId, (requestsData) => {
      setRequests(requestsData);
      setLoading(false);
    });
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
    
  }, [currentUserId, currentUser]);
  
  // 2. Fetch Donor Contact details when requests change
  useEffect(() => {
      const fetchDonorContacts = async () => {
          if (requests.length === 0) return;
          
          const suppliesToFetch = requests
            .filter(r => r.status === 'approved' && !donorContactMap[r.supplyId])
            .map(r => r.supplyId);
            
          const newContactMap = {};

          for (const supplyId of suppliesToFetch) {
            try {
              const supplyData = await requestsService.getSupplyById(supplyId);
              
              if (supplyData) {
                newContactMap[supplyId] = {
                    location: supplyData.pickupLocation || supplyData.location,
                    email: supplyData.donorEmail,
                    phone: supplyData.donorPhone 
                };
              }
            } catch (err) {
              console.error('Error fetching supply for contact:', err);
            }
          }
          setDonorContactMap(prev => ({...prev, ...newContactMap}));
      };

      fetchDonorContacts();
  }, [requests]);


  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const browseSupplies = () => {
        window.location.href = '/supplies';
  };

  const cancelRequest = async (request) => {
    if (window.confirm(`Cancel request for ${request.supplyName}?`)) {
      try {
        await requestsService.cancelRequest(request.id);
        alert(`Request for ${request.supplyName} cancelled.`);
      } catch (error) {
        console.error('Error cancelling request:', error);
        alert('Failed to cancel request. Please try again.');
      }
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
      case 'collected': 
      case 'completed': 
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryStyle = (category) => {
    const categoryColors = {
      'Medication': 'bg-purple-100 text-purple-800',
      'PPE': 'bg-yellow-100 text-yellow-800',
      'Medical Equipment': 'bg-green-100 text-green-800',
      'Surgical Supplies': 'bg-indigo-100 text-indigo-800',
      'Diagnostic Equipment': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (dateString && typeof dateString === 'object' && dateString.toDate) {
        dateString = dateString.toDate();
      }
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (dateString && typeof dateString === 'object' && dateString.toDate) {
        dateString = dateString.toDate();
      }
      return new Date(dateString).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Filtering and Stats Logic
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const requestStats = {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      collected: requests.filter(r => r.status === 'collected').length || requests.filter(r => r.status === 'completed').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length,
  };


  if (loading || currentUser === undefined) { 
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
              onClick={() => window.location.reload()}
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

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* START NAVIGATION BAR */}
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
              onClick={browseSupplies} 
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1 sm:gap-2 text-sm"
            >
              <Package size={16} /> 
              <span className="hidden sm:inline">Browse Supplies</span>
              <span className="sm:hidden">Browse</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-2 sm:px-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {currentReceiver?.name ? currentReceiver.name.split(' ').map(n => n[0]).join('') : 'R'}
              </div>
              <span className="hidden sm:inline text-gray-700 font-medium text-sm">{currentReceiver?.name}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>
      </nav>
      {/* END NAVIGATION BAR */}

      {/* Header Section (Title Block) */}
      <header className="bg-white text-gray-900 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">My Requests</h1>
            <p className="text-sm text-gray-600">Track and manage your medical supply requests</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
            {Object.entries(requestStats).map(([status, count]) => (
                <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-4 py-2 -mb-px rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 
                        ${activeTab === status 
                          ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                          : 'text-gray-600 hover:text-gray-800'}`
                        }
                >
                    <ClipboardList size={16} />
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </button>
            ))}
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
        ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests</h3>
                <p className="text-gray-600">Try checking a different status tab.</p>
            </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const status = request.status?.toLowerCase();
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';
              const isClosed = status === 'collected' || status === 'cancelled';
              const contactInfo = donorContactMap[request.supplyId]; 

              let responseStyle = 'bg-gray-50 text-gray-700';
              if (isApproved) responseStyle = 'bg-green-50 text-green-700 border-l-4 border-green-500';
              if (isRejected) responseStyle = 'bg-red-50 text-red-700 border-l-4 border-red-500';
              if (isClosed) responseStyle = 'bg-gray-50 text-gray-600 border-l-4 border-gray-500';
              
              const isActionable = status === 'pending';

              return (
              <div
                key={request.id}
                className={`bg-white rounded-lg shadow-sm p-6 ${isApproved ? 'border-green-500' : isRejected ? 'border-red-500' : 'border-gray-200'} border-l-4`}
              >
                  {/* Top Header - Item Name and Category */}
                  <div className="flex items-center justify-between border-b pb-3 mb-3 border-gray-100">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {request.supplyName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(request.category)}`}>
                            {request.category}
                        </span>
                    </div>
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(status)}`}>
                        {status}
                    </div>
                  </div>
                
                  {/* Main Details Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                      <p>
                          <span className="font-medium text-gray-500">From:</span> <strong>{request.donorName}</strong>
                      </p>
                      <p>
                          <span className="font-medium text-gray-500">Quantity:</span> <strong>{request.quantity} {request.unit}</strong>
                      </p>
                      <p>
                          <span className="font-medium text-gray-500">Location:</span> <strong>{request.location}</strong>
                      </p>
                      <p>
                          <span className="font-medium text-gray-500">Expires:</span> {formatDate(request.expiryDate)}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-500 col-span-2">
                           <Clock size={12}/> Requested: {formatDate(request.requestDate)} {formatDateTime(request.requestDate)}
                      </p>
                  </div>

                  {/* Donor Response Message + Contact Details */}
                  {request.responseMessage && (
                      <div className={`mt-4 p-4 rounded-lg ${responseStyle}`}>
                          <p className="text-sm font-semibold mb-1">Donor Response:</p>
                          <p className="text-sm">{request.responseMessage}</p>

                          {/* Contact Details (Inserted directly below message if approved) */}
                          {isApproved && contactInfo && (
                              <div className="mt-3 p-3 bg-white border border-green-400 rounded-lg text-green-800">
                                  <p className="text-sm font-semibold mb-2 flex items-center">
                                      <CheckCircle size={16} className="mr-2"/> Pickup Contact Information
                                  </p>
                                  <div className="space-y-1 text-sm ml-1">
                                      <div className="flex items-center">
                                          <MapPin size={16} className="mr-2 flex-shrink-0" /> 
                                          <span>Pickup Location: <strong>{contactInfo.location || 'Not Specified'}</strong></span>
                                      </div>
                                      <div className="flex items-center">
                                          <Mail size={16} className="mr-2 flex-shrink-0" />
                                          <span>Email: <strong>{contactInfo.email || 'N/A'}</strong></span>
                                      </div>
                                      <div className="flex items-center">
                                          <Phone size={16} className="mr-2 flex-shrink-0" />
                                          <span>Phone: <strong>{contactInfo.phone || 'N/A'}</strong></span>
                                      </div>
                                      <p className="text-xs mt-2 italic">Coordinate with the donor directly.</p>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
                  
                  {/* Cancel Button (Only visible for Pending requests) */}
                  {isActionable && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          <button
                              onClick={() => cancelRequest(request)}
                              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          >
                              Cancel Request
                          </button>
                      </div>
                  )}
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}