import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { suppliesService, requestsService } from '../services/firebase'; 
import { Package, Plus, ClipboardList, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

export default function MyDonations() {
  const { currentUser, userRole } = useAuth();
  const [requests, setRequests] = useState([]); // Stores incoming requests
  const [loading, setLoading] = useState(true);
  // FIX 1: Change default active tab to 'all' for better visibility
  const [activeTab, setActiveTab] = useState('all'); 
  const [error, setError] = useState('');
  const [supplyMap, setSupplyMap] = useState({}); 

  const currentDonor = currentUser ? {
    id: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email
  } : null;
  const currentDonorId = currentDonor?.id;


  // 1. Fetch Requests targeted at this Donor
  useEffect(() => {
    if (currentUser === undefined) return;
    if (!currentDonorId || userRole !== 'donor') {
      if (currentUser !== null) {
        setError('Access Denied. Please log in as a Donor to view this page.');
        setLoading(false);
      }
      return;
    }

    // Set up real-time listener for requests made TO this donor
    const unsubscribeRequests = requestsService.onDonorRequestsChange(currentDonorId, (requestsData) => {
      setRequests(requestsData);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeRequests) {
        unsubscribeRequests();
      }
    };
  }, [currentDonorId, currentUser, userRole]);

  // 2. Fetch all related Supplies (for status/contact info) when requests change
  useEffect(() => {
      const fetchAllSupplies = async () => {
        if (requests.length === 0) return;

        const supplyIds = [...new Set(requests.map(req => req.supplyId))];
        const newSupplyMap = {};

        for (const id of supplyIds) {
            const supplyData = await requestsService.getSupplyById(id);
            if(supplyData) {
                newSupplyMap[id] = supplyData;
            }
        }
        setSupplyMap(prev => ({...prev, ...newSupplyMap}));
      };

      fetchAllSupplies();
  }, [requests]);


  const addDonation = () => {
    window.location.href = '/add-donation';
  };

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Response handler for Accept/Reject/Collected
  const handleResponse = async (request, status, message = '') => {
    if (window.confirm(`Are you sure you want to ${status} this request for ${request.supplyName}?`)) {
      try {
        setLoading(true);
        // Use the service function to update request and supply status
        await requestsService.respondToRequest(request.id, request.supplyId, status, message);
        alert(`Request ${status} successfully.`);
      } catch (error) {
        console.error(`Error ${status} request:`, error);
        alert(`Failed to ${status} request. Please try again.`);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCollected = (request) => {
      if (window.confirm(`Mark ${request.supplyName} as COLLECTED/COMPLETED? This will mark the item as collected and close the loop.`)) {
          handleResponse(request, 'collected', 'The supply has been successfully collected and the request is now marked as complete.');
      }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'collected':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'collected':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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


  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) {
      date = date.toDate();
    }
    try {
        return new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });
  
  const requestStats = {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      collected: requests.filter(r => r.status === 'collected').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length
  };


  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests for your donations...</p>
        </div>
      </div>
    );
  }

  if (error || !currentDonor || userRole !== 'donor') {
    if (currentUser === undefined) return null; // Still loading auth

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4 text-sm">
            {error || 'You must be logged in as a Donor to view this page.'}
          </p>
          <button onClick={goToDashboard} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Go to Dashboard</button>
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
              <Plus size={16}/>
              <span className="hidden sm:inline">Add Donation</span>
              <span className="sm:hidden">Add</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-2 sm:px-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {currentDonor.name ? currentDonor.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <span className="hidden sm:inline text-gray-700 font-medium text-sm">{currentDonor.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-white text-gray-900 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">My Donations</h1>
          <p className="text-gray-500 text-sm">Review requests for your donated supplies.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Stats and Tabs */}
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

        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Received Yet</h3>
            <p className="text-gray-600 mb-6">List a donation to start receiving requests from receivers in need.</p>
            <button 
              onClick={addDonation}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Donation
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
                const supply = supplyMap[request.supplyId] || {};
                const currentSupplyStatus = supply.status || 'N/A';

                return (
                  <div key={request.id} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{request.supplyName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(request.category)}`}>
                            {request.category}
                          </span>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3">
                          <p className="flex items-center gap-2"><Clock size={14}/>Requested on: {formatDate(request.requestDate)}</p>
                          <p>Requested by: <strong>{request.receiverName}</strong> ({request.receiverEmail})</p>
                          <p>Quantity: <strong>{request.quantity} {request.unit}</strong></p>
                          <p>Item's Current Status: <strong>{currentSupplyStatus}</strong></p>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusStyle(request.status)} w-fit mb-4`}>
                          {getStatusIcon(request.status)}
                          <span>{request.status.toUpperCase()}</span>
                      </div>


                      {request.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => handleResponse(request, 'approved', 'Your request has been approved! Please check your My Requests page for contact details.')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                                disabled={loading}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleResponse(request, 'rejected', 'We apologize, but this item is no longer available or suitable for donation.')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                                disabled={loading}
                            >
                                Reject
                            </button>
                        </div>
                      )}

                      {request.status === 'approved' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-2">Approved - Awaiting Collection</p>
                            <div className="text-sm text-gray-700">
                                <p>Receiver Contact: **{request.receiverEmail}**</p>
                                <p>This item is currently **reserved**.</p>
                            </div>
                            <button
                                onClick={() => handleCollected(request)}
                                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                                disabled={loading}
                            >
                                Mark as Collected/Completed
                            </button>
                        </div>
                      )}
                      
                      {['rejected', 'cancelled', 'collected'].includes(request.status) && (
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-800">Status Closed: {request.status.toUpperCase()}</p>
                            {request.responseMessage && (
                                <p className="text-xs text-gray-600 mt-1">Response: {request.responseMessage}</p>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
            )})}
          </div>
        )}
      </main>
    </div>
  );
}