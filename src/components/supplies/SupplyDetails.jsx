import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  X, 
  Package, 
  Calendar, 
  MapPin, 
  User,
  AlertTriangle,
  Building,
  Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; 

// Component accepts the full supply object directly from its parent
const SupplyDetails = ({ supply, onClose, onRequest, requestStatus, loading }) => {
  const { currentUser } = useAuth(); // Get current user
  
  if (!supply) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Error</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="mr-2" size={20} />
              <span>Supply data not found</span>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to format date safely (handles Date objects from service and strings)
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    try {
      if (typeof date === 'object' && date.toDate) {
        date = date.toDate();
      }
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper function to format date and time (handles Date objects from service and strings)
  const formatDateTime = (date) => {
    if (!date) return 'Not specified';
    try {
      if (typeof date === 'object' && date.toDate) {
        date = date.toDate();
      }
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry(supply.expiryDate);
  const isUrgent = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
  const supplyName = supply.name || supply.itemName || 'Unnamed Supply';

  const getExpiryStatus = () => {
    if (daysUntilExpiry === null) return { text: 'No expiry date set', color: 'text-gray-600', bg: 'bg-gray-50' };
    if (isExpired) return { 
      text: `Expired ${Math.abs(daysUntilExpiry)} days ago`, 
      color: 'text-red-800', 
      bg: 'bg-red-50',
      border: 'border-red-200'
    };
    if (isUrgent) return { 
      text: `Expires in ${daysUntilExpiry} days`, 
      color: 'text-red-800', 
      bg: 'bg-red-50',
      border: 'border-red-200'
    };
    return { 
      text: `Expires in ${daysUntilExpiry} days`, 
      color: 'text-green-800', 
      bg: 'bg-green-50',
      border: 'border-green-200'
    };
  };

  const expiryStatus = getExpiryStatus();
  const isLoggedIn = !!currentUser;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{supplyName}</h2>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Details
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {supply.category || 'Uncategorized'}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  supply.status === 'available' ? 'bg-green-100 text-green-800' :
                  supply.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                  supply.status === 'distributed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {supply.status ? supply.status.charAt(0).toUpperCase() + supply.status.slice(1) : 'Unknown Status'}
                </span>
                {requestStatus && (
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    requestStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    requestStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    requestStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    requestStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Request {requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Expiry Alert */}
          {(isUrgent || isExpired) && (
            <div className={`${expiryStatus.bg} border-l-4 p-4 mb-6 rounded-r-md border-red-200`}>
              <div className="flex">
                {isExpired ? (
                  <AlertTriangle className="text-red-400 mr-3 flex-shrink-0" size={20} />
                ) : (
                  <AlertCircle className="text-red-400 mr-3 flex-shrink-0" size={20} />
                )}
                <div>
                  <p className={`${expiryStatus.color} font-medium`}>
                    {isExpired ? 'Expired Supply' : 'Urgent: Expires Soon'}
                  </p>
                  <p className={`${expiryStatus.color} text-sm`}>
                    {expiryStatus.text}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Supply Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2" size={20} />
                  Supply Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Quantity Available</span>
                    <span className="font-medium">{supply.quantity || 'N/A'} {supply.unit || 'units'}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Expiry Date</span>
                    <div className="text-right">
                      <span className="font-medium block">{formatDate(supply.expiryDate)}</span>
                      {daysUntilExpiry !== null && (
                        <span className={`text-xs ${expiryStatus.color}`}>
                          {expiryStatus.text}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Date Added</span>
                    <span className="font-medium">{formatDateTime(supply.dateAdded)}</span>
                  </div>
                  
                  {supply.batchNumber && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Batch Number</span>
                      <span className="font-medium">{supply.batchNumber}</span>
                    </div>
                  )}
                  
                  {supply.manufacturer && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Manufacturer</span>
                      <span className="font-medium">{supply.manufacturer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Donor Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="mr-2" size={20} />
                  Donor Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Organization</span>
                    <span className="font-medium">{supply.donorName || 'Anonymous Donor'}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="font-medium">{supply.pickupLocation || supply.location || 'Location not specified'}</span>
                  </div>
                  
                  {supply.donorContact && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Contact</span>
                      <span className="font-medium">{supply.donorContact}</span>
                    </div>
                  )}
                  
                  {supply.donorEmail && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="font-medium">{supply.donorEmail}</span>
                    </div>
                  )}
                  
                  {supply.donorPhone && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Phone</span>
                      <span className="font-medium">{supply.donorPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Description and Instructions remain unchanged */}
          {supply.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">{supply.description}</p>
              </div>
            </div>
          )}
          
          {supply.specialInstructions && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                <p className="text-blue-800">{supply.specialInstructions}</p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            
            {requestStatus === 'pending' ? (
              <button
                disabled
                className="flex-1 bg-yellow-100 text-yellow-800 py-3 px-4 rounded-md flex items-center justify-center"
              >
                <Clock className="mr-2" size={16} />
                Request Pending
              </button>
            ) : requestStatus === 'approved' ? (
              <button
                disabled
                className="flex-1 bg-green-100 text-green-800 py-3 px-4 rounded-md flex items-center justify-center"
              >
                <CheckCircle className="mr-2" size={16} />
                Request Approved
              </button>
            ) : requestStatus === 'completed' ? (
              <button
                disabled
                className="flex-1 bg-blue-100 text-blue-800 py-3 px-4 rounded-md flex items-center justify-center"
              >
                <CheckCircle className="mr-2" size={16} />
                Request Completed
              </button>
            ) : requestStatus === 'rejected' ? (
              <button
                disabled
                className="flex-1 bg-red-100 text-red-800 py-3 px-4 rounded-md"
              >
                Request Rejected
              </button>
            ) : isExpired ? (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-600 py-3 px-4 rounded-md"
              >
                Item Expired
              </button>
            ) : supply.status !== 'available' ? (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-600 py-3 px-4 rounded-md"
              >
                Not Available
              </button>
            ) : !isLoggedIn ? ( // Display if user is not logged in
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-600 py-3 px-4 rounded-md"
              >
                Please Login to Request
              </button>
            ) : (
              <button
                onClick={() => onRequest(supply)}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Requesting...
                  </>
                ) : (
                  <>
                    <Package className="mr-2" size={16} />
                    Request Supply
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyDetails;