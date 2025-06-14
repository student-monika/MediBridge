import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const SupplyDetails = ({ supply, onClose, onRequest, requestStatus }) => {
  if (!supply) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{supply.name}</h2>
              <p className="text-gray-600">{supply.category}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {isUrgent && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="text-red-400 mr-3" size={20} />
                <div>
                  <p className="text-red-800 font-medium">Urgent: Expires Soon</p>
                  <p className="text-red-700 text-sm">This item expires in {daysUntilExpiry} days</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Supply Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{supply.quantity} {supply.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="font-medium">{new Date(supply.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Added</p>
                  <p className="font-medium">{new Date(supply.dateAdded).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{supply.status}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Donor Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Organization</p>
                  <p className="font-medium">{supply.donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{supply.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{supply.donorContact}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700">{supply.description}</p>
          </div>
          
          <div className="flex gap-3">
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
            ) : (
              <button
                onClick={() => onRequest(supply)}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Request This Item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyDetails;