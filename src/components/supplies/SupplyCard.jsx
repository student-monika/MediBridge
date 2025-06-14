import React from 'react';
import { Package, Calendar, MapPin, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const SupplyCard = ({ supply, onViewDetails, onRequest, requestStatus, loading }) => {
  // Helper function to calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to format date safely
  const formatDate = (date) => {
    if (!date) return 'No expiry date';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Show error state if no supply data or missing ID
  if (!supply || !supply.id) {
    console.error('SupplyCard: Invalid supply data:', supply);
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-500">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="mr-2" size={20} />
          <span>Supply data not available</span>
        </div>
      </div>
    );
  }

  // Calculate expiry information
  const daysUntilExpiry = getDaysUntilExpiry(supply.expiryDate);
  const isUrgent = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

  // Get supply name (handle both 'name' and 'itemName' fields)
  const supplyName = supply.name || supply.itemName || 'Unnamed Supply';

  // Get expiry status text and color
  const getExpiryStatus = () => {
    if (daysUntilExpiry === null) return { text: 'No expiry', color: 'text-gray-600' };
    if (isExpired) return { text: `Expired ${Math.abs(daysUntilExpiry)} days ago`, color: 'text-red-600' };
    if (isUrgent) return { text: `${daysUntilExpiry} days left`, color: 'text-red-600' };
    return { text: `${daysUntilExpiry} days left`, color: 'text-green-600' };
  };

  const expiryStatus = getExpiryStatus();

  // Handler for view details with validation
  const handleViewDetails = () => {
    console.log('SupplyCard: View details clicked for supply ID:', supply.id);
    if (onViewDetails && supply.id) {
      onViewDetails(supply);
    } else {
      console.error('SupplyCard: Cannot view details - missing handler or supply ID');
      alert('Error: Cannot view details. Please refresh the page.');
    }
  };

  // Handler for request with validation
  const handleRequest = () => {
    console.log('SupplyCard: Request clicked for supply ID:', supply.id);
    if (onRequest && supply.id) {
      onRequest(supply);
    } else {
      console.error('SupplyCard: Cannot request - missing handler or supply ID');
      alert('Error: Cannot process request. Please refresh the page.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
      {/* Header with status badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{supplyName}</h3>
          <p className="text-sm text-gray-600">{supply.category || 'Uncategorized'}</p>
        </div>
        <div className="flex flex-col gap-1">
          {/* Real-time status indicator */}
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Live
          </span>
          {isExpired && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
              <AlertTriangle className="mr-1" size={12} />
              Expired
            </span>
          )}
          {isUrgent && !isExpired && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Clock className="mr-1" size={12} />
              Urgent
            </span>
          )}
          {requestStatus && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              requestStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              requestStatus === 'approved' ? 'bg-green-100 text-green-800' :
              requestStatus === 'rejected' ? 'bg-red-100 text-red-800' :
              requestStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1)}
            </span>
          )}
        </div>
      </div>
      
      {/* Supply Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="mr-2 flex-shrink-0" size={16} />
          <span>{supply.quantity || 'N/A'} {supply.unit || 'units'}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="mr-2 flex-shrink-0" size={16} />
          <span>Expires: {formatDate(supply.expiryDate)}</span>
          {daysUntilExpiry !== null && (
            <span className={`ml-2 font-medium ${expiryStatus.color}`}>
              ({expiryStatus.text})
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2 flex-shrink-0" size={16} />
          <span>{supply.pickupLocation || supply.location || 'Location not specified'}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="mr-2 flex-shrink-0" size={16} />
          <span>{supply.donorName || 'Anonymous Donor'}</span>
        </div>
      </div>
      
      {/* Description */}
      {supply.description && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {supply.description}
        </p>
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mb-2">
          ID: {supply.id || 'MISSING ID'}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !supply.id}
          title={!supply.id ? 'Supply ID missing' : 'View detailed information'}
        >
          View Details
        </button>
        
        {requestStatus === 'pending' ? (
          <button
            disabled
            className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md flex items-center justify-center"
          >
            <Clock className="mr-2" size={16} />
            Pending
          </button>
        ) : requestStatus === 'approved' ? (
          <button
            disabled
            className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-md flex items-center justify-center"
          >
            <CheckCircle className="mr-2" size={16} />
            Approved
          </button>
        ) : requestStatus === 'completed' ? (
          <button
            disabled
            className="flex-1 bg-blue-100 text-blue-800 py-2 px-4 rounded-md flex items-center justify-center"
          >
            <CheckCircle className="mr-2" size={16} />
            Completed
          </button>
        ) : requestStatus === 'rejected' ? (
          <button
            disabled
            className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-md"
          >
            Rejected
          </button>
        ) : isExpired ? (
          <button
            disabled
            className="flex-1 bg-gray-100 text-gray-500 py-2 px-4 rounded-md"
          >
            Expired
          </button>
        ) : supply.status !== 'available' ? (
          <button
            disabled
            className="flex-1 bg-gray-100 text-gray-500 py-2 px-4 rounded-md"
          >
            Not Available
          </button>
        ) : (
          <button
            onClick={handleRequest}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !supply.id}
            title={!supply.id ? 'Supply ID missing' : 'Request this item'}
          >
            {loading ? 'Requesting...' : 'Request Item'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SupplyCard;