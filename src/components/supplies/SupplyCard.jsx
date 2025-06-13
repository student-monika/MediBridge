import React from 'react';
import { Package, Calendar, MapPin, User, Clock, CheckCircle } from 'lucide-react';

const SupplyCard = ({ supply, onViewDetails, onRequest, requestStatus }) => {
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(supply.expiryDate);
  const isUrgent = daysUntilExpiry <= 30;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{supply.name}</h3>
          <p className="text-sm text-gray-600">{supply.category}</p>
        </div>
        {isUrgent && (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Urgent
          </span>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="mr-2" size={16} />
          {supply.quantity} {supply.unit}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="mr-2" size={16} />
          Expires: {new Date(supply.expiryDate).toLocaleDateString()}
          <span className={`ml-2 ${isUrgent ? 'text-red-600' : 'text-green-600'}`}>
            ({daysUntilExpiry} days)
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2" size={16} />
          {supply.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="mr-2" size={16} />
          {supply.donorName}
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">{supply.description}</p>
      
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(supply)}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
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
        ) : (
          <button
            onClick={() => onRequest(supply)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Request Item
          </button>
        )}
      </div>
    </div>
  );
};

export default SupplyCard;