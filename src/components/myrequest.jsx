import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      itemName: "Paracetamol Tablets",
      category: "Medication",
      quantity: "100 tablets",
      requestDate: "2024-01-15",
      status: "accepted",
      donor: "City Hospital",
      description: "500mg tablets for pain relief",
      location: "Central Pharmacy",
      categoryColor: "purple"
    },
    {
      id: 2,
      itemName: "Surgical Gloves",
      category: "PPE",
      quantity: "50 boxes",
      requestDate: "2024-01-12",
      status: "pending",
      donor: null,
      description: "Latex-free sterile gloves, medium size",
      location: "Medical Supply Center",
      categoryColor: "yellow"
    },
    {
      id: 3,
      itemName: "Insulin Vials",
      category: "Medication",
      quantity: "10 vials",
      requestDate: "2024-01-10",
      status: "declined",
      donor: "General Hospital",
      description: "Fast-acting insulin for diabetes management",
      location: "Diabetes Care Clinic",
      categoryColor: "purple"
    },
    {
      id: 4,
      itemName: "Blood Pressure Monitor",
      category: "Medical Equipment",
      quantity: "2 units",
      requestDate: "2024-01-08",
      status: "fulfilled",
      donor: "Metro Clinic",
      description: "Digital automatic BP monitor with arm cuff",
      location: "Healthcare Center",
      categoryColor: "green"
    }
  ]);

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const browseSupplies = () => {
    window.location.href = '/supplies';
  };

  const cancelRequest = (request) => {
    if (window.confirm(`Cancel request for ${request.itemName}?`)) {
      setRequests(prev => prev.filter(item => item.id !== request.id));
      alert(`Request for ${request.itemName} cancelled`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'fulfilled':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'declined':
        return 'bg-red-500';
      case 'fulfilled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryStyle = (categoryColor) => {
    switch (categoryColor) {
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              onClick={browseSupplies}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all inline-flex items-center gap-1 sm:gap-2 text-sm"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Browse Supplies</span>
              <span className="sm:hidden">Browse</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-2 sm:px-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                JD
              </div>
              <span className="hidden sm:inline text-gray-700 font-medium text-sm">John </span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-white text-gray-900 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">My Requests</h1>
            <p className="text-gray-500 text-sm">Track the status of your medical supply requests</p>
          </div>
          <div className="bg-gray-50 border border-gray-300 px-4 py-3 rounded-lg text-center">
            <div className="text-xs text-gray-600 mb-1">Total Requests</div>
            <div className="text-xl font-bold text-gray-800">{requests.length}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-200 min-h-80 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{request.itemName}</h3>
                  <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-medium ${getCategoryStyle(request.categoryColor)}`}>
                    {request.category}
                  </span>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(request.status)}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mb-4 flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Quantity:</span>
                  <span className="text-gray-900 font-semibold text-sm">{request.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Request Date:</span>
                  <span className="text-gray-900 font-semibold text-sm">{new Date(request.requestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Location:</span>
                  <span className="text-gray-900 font-semibold text-sm">{request.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(request.status)}`}>
                    <span className={`w-2 h-2 ${getStatusDot(request.status)} rounded-full`}></span>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-sm font-medium">Donor:</span>
                  <span className="text-gray-900 font-semibold text-sm text-right">{request.donor || 'Not assigned'}</span>
                </div>
              </div>

              <div className="text-gray-500 text-sm mb-4 leading-relaxed">
                {request.description}
              </div>

              {request.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-yellow-800 text-sm font-medium">
                    <span>⏰</span>
                    Request Pending
                  </div>
                  <div className="text-gray-500 text-sm mb-3">
                    Waiting for donor approval
                  </div>
                  <button 
                    className="bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-md font-medium transition-all w-full text-sm"
                    onClick={() => cancelRequest(request)}
                  >
                    ✕ Cancel Request
                  </button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="bg-green-50 border border-green-400 rounded-lg p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-green-800 text-sm font-medium">
                    <span>✓</span>
                    Request Accepted
                  </div>
                  <div className="text-green-700 text-sm">
                    <strong>Approved by:</strong> {request.donor}<br />
                    You will be contacted soon for pickup details.
                  </div>
                </div>
              )}

              {request.status === 'declined' && (
                <div className="bg-red-50 border border-red-400 rounded-lg p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-red-800 text-sm font-medium">
                    <span>✕</span>
                    Request Declined
                  </div>
                  <div className="text-red-700 text-sm">
                    Request was declined by {request.donor}. You can browse other available supplies.
                  </div>
                </div>
              )}

              {request.status === 'fulfilled' && (
                <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-2 text-blue-800 text-sm font-medium">
                    <span>✓</span>
                    Request Fulfilled
                  </div>
                  <div className="text-blue-700 text-sm">
                    <strong>Received from:</strong> {request.donor}<br />
                    This item has been successfully collected.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}